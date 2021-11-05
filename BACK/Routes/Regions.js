const express = require("express");

const router = express.Router();

const pool = require('../database');

const { adminAuth, authorization, limiter } = require("../middlewares")


// get all the active regions
router.get('/regions', authorization, (req, res) => {
    pool.query(`SELECT * FROM regions WHERE active=1`
      , (error, result) => {
        if (error) throw error;
        res.status(200).json({
          regions: result,
        })
      });
  });
  
  // get all the active countries
  router.get('/countries', authorization, (req, res) => {
    pool.query(`SELECT * FROM countries WHERE active=1`
      , (error, result) => {
        if (error) throw error;
        res.status(200).json({
          countries: result,
        })
      });
  });
  
  
  // get countries by region id
  router.get('/countries/:regionid', authorization, (req, res) => {
    // console.log(req.params.regionid)
    pool.query(`SELECT * FROM countries WHERE active=1 AND Regions_id=${req.params.regionid}`
      , (error, result) => {
        if (error) throw error;
        res.status(200).json({
          countries: result,
        })
      });
  });
  
  // get cities by country id
  router.get('/cities/:countryid', authorization, (req, res) => {
    console.log(req.params.countryid)
    pool.query(`SELECT * FROM cities WHERE active=1 AND Countries_id=${req.params.countryid}`
      , (error, result) => {
        if (error) throw error;
        res.status(200).json({
          cities: result,
        })
      });
  });
  
  
  // get all the regions section data (only postman tests)
  router.get('/cities', authorization, (req, res) => {
    pool.query(`SELECT regions.name as RegionName,regions.id as RegionId,countries.name as CountryName,
    countries.id as CountryId,cities.name as cityName,cities.id as CityId from regions LEFT JOIN countries
     ON countries.Regions_id=regions.id LEFT JOIN cities ON cities.Countries_id = countries.id WHERE cities.id=1`
      , (error, result) => {
        if (error) throw error;
        res.send(result);
      });
  });
  
  
  // add region
  router.post('/regions', authorization, (req, res) => {
    const newRegion = {
      name: req.body.name,
      active: 1
    }
    console.log(newRegion)
    pool.query("INSERT INTO regions set ?", [newRegion]), (error, result) => {
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
  });
  
  
  // add country by region id
  router.post('/countries/:idRegion', authorization, (req, res) => {
    const newCountry = {
      name: req.body.name,
      Regions_id: req.params.idRegion,
      active: 1
    }
    console.log(newCountry)
    pool.query("INSERT INTO countries set ?", [newCountry]), (error, result) => {
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
  });
  
  
  // add a new city by id country
  router.post('/cities/:idCountry', authorization, (req, res) => {
    const newCity = {
      name: req.body.name,
      Countries_id: req.params.idCountry,
      active: 1
    }
    // console.log(newCity)
    pool.query("INSERT INTO cities set ?", [newCity]), (error, result) => {
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
  });
  
  
  // edit country name
  router.put("/countries/:id", authorization, async (req, res) => {
    const id = req.params.id
    pool.query(`UPDATE countries set name="${req.body.name}" WHERE id = ?`, [id]);
    res.status(200).json({
      operation: 1,
    })
  })
  
  // edit city name
  router.put("/cities/:id", authorization, async (req, res) => {
    const id = req.params.id
    pool.query(`UPDATE cities set name="${req.body.name}" WHERE id = ?`, [id]);
    res.status(200).json({
      operation: 1,
    })
  })
  
  
  // deactivate a country
  router.delete('/countries/:id', authorization, (req, res) => {
    pool.query(`UPDATE countries SET active = 0 WHERE id = ?`, [req.params.id]);
    res.status(200).json({
      operation: 1,
    })
  })
  // deactivate a country
  router.delete('/cities/:id', authorization, (req, res) => {
    pool.query(`UPDATE cities SET active = 0 WHERE id = ?`, [req.params.id]);
    res.status(200).json({
      operation: 1,
    })
  })
  
  // deactivate a region
  router.delete('/regions/:idRegion', authorization, (req, res) => {
    pool.query(`UPDATE regions SET active = 0 WHERE id = ?`, [req.params.idRegion]);
    res.status(200).json({
      operation: 1,
    })
  })
  
  // reactivate a region (only postman)
  router.put('/regions/active/:idRegion', authorization, (req, res) => {
    pool.query(`UPDATE regions SET active = 1 WHERE id = ?`, [req.params.idRegion]);
    res.status(200).json({
      operation: 1,
    })
  })
  
  module.exports = router;