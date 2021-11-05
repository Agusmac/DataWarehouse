const express = require("express");

const router = express.Router();

const pool = require('../database');

const { adminAuth, authorization, limiter } = require("../middlewares")



// get all the companies data
router.get('/companies', authorization, (req, res) => {
    pool.query(`Select companies.id as CompanyID, companies.name as CompanyName,companies.address,companies.email,
    companies.phone,companies.city_id,cities.name as cityName, countries.name as CountryName,regions.name as RegionName
     from companies inner Join cities on cities.id=companies.city_id 
     inner Join countries on countries.id=cities.Countries_id inner Join regions on regions.id=countries.Regions_id where companies.active=1;`
        , (error, result) => {
            if (error) throw error;
            res.status(200).json({
                companies: result,
            })
        });
});



// add company
router.post('/companies', authorization, (req, res) => {
    const { name, address, email, phone } = req.body;
    pool.query("SELECT * from cities WHERE name=?", [req.body.city], (error, result) => {
        if (error) throw error;
        cityidsetter(result[0]);
    });
    function cityidsetter(city) {
        if (name && address && email && phone && city) {
            const newCompany = {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                city_id: city.id
            }
            pool.query("INSERT INTO companies set ?", [newCompany]), (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(200).json({
                        operation: 0,
                    })
                }
            }
            res.status(200).json({
                operation: 1,
            })

        } else {
            res.status(200).json({
                operation: 0,
            })
        }
    }
});


// UPDATE company
router.put('/companies/:id', authorization, (req, res) => {
    const companyid = req.params.id

    const { name, address, email, phone } = req.body;

    pool.query("SELECT * from cities WHERE name=?", [req.body.city], (error, result) => {
        if (error) throw error;
        cityidsetter(result[0]);
    });
    function cityidsetter(city) {
        if (name && address && email && phone && city) {
            pool.query(`UPDATE companies SET name=?,address=?,email=?,phone=?,city_id=? WHERE id = ?`, [name, address, email, phone, city.id, companyid]), (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(200).json({
                        operation: 0,
                    })
                }
            }
            res.status(200).json({
                operation: 1,
            })
        } else {
            res.status(200).json({
                operation: 0,
            })
        }
    }
});


// deactivate a company
router.delete('/companies/:id', authorization, (req, res) => {
    pool.query(`UPDATE companies SET active = 0 WHERE id = ?`, [req.params.id]);
    res.status(200).json({
        operation: 1,
        op: "deactivated correctly"
    })
})


module.exports = router;