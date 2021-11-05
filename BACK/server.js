require('dotenv').config()
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const { adminAuth, authorization, limiter } = require("./middlewares")

const pool = require('./database');

const app = express();

const { SECRET } = process.env


// middlewares globales

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(limiter)
app.use(cookieParser())




// ROUTES


// USERS----------------------------------------------

// register new users
app.post('/register', authorization, adminAuth, (req, res) => {

  const { fName, lName, username, email, password,admin } = req.body;

  const newUser = {
    fName,
    lName,
    username,
    email,
    admin,
    password
  }

  if (fName && lName && username && email && password) {
    // console.log("register in process")
    pool.query('SELECT * FROM users where email=?', [email], (error, result) => {
      if (!result[0]) {
        usercreator()
      } else {
        res.status(200).json({
          operation: 0,
        })
      }
    });
  } else {
    res.status(200).json({
      operation: 0,
    })
  }

  function usercreator() {
    // console.log("adding user ")
    pool.query("INSERT INTO users set ?", [newUser], (error, result) => {
      if (error) {
        console.log(error)
        res.status(200).json({
          operation: 0,
        })
      }else{
        console.log("added user successfully")
        res.status(200).json({
          operation: 1,
        })
      }
    })
  }
})


// login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)

  pool.query("SELECT * FROM users WHERE email = ? AND password=?", [email, password], (error, result) => {
    // console.log(result[0].admin)
    if (!result[0]) {
      console.log("user not found")
      res.status(200).json({
        userstate: 0
      })
    } else if (result[0].admin) {
      console.log("welcome admin")
      jwtokener(result, 2)
    }
    else if (!result[0].admin) {
      console.log("welcome user")
      jwtokener(result, 1)
    }
  });


  function jwtokener(result, userstatus) {
    const token = jwt.sign(
      {
        id: result[0].id,
        email: result[0].email,
        admin: result[0].admin,
      },
      SECRET,
      { expiresIn: "180m" }
    );
    res.cookie("accessdata_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    
    res.status(200).json({
      userstate: userstatus,
      jwttoken: token
    })
  }

});




// delete user
app.delete("/users/:id", authorization, adminAuth, (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM users WHERE id = ?', [id], (error, result) => {
    if (error) {
      res.send(`User with  id:${id} does not exist`);
    } else {
      res.send(`Deleted user with  id:${id} successfully`)
    }
  });
});


// logout
app.get("/logout", (req, res) => {
  return res
    .clearCookie("accessdata_token")
    .status(200)
    .json({ message: "Successfully logged out " });
});

// get all the users
app.get('/users', authorization, (req, res) => {
  pool.query('SELECT * FROM users', (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});




// REGIONS/COUNTRIES/CITIES------------------------------------------

// get all the active regions
app.get('/regions', authorization, (req, res) => {
  pool.query(`SELECT * FROM regions WHERE active=1`
    , (error, result) => {
      if (error) throw error;
      res.status(200).json({
        regions: result,
      })
    });
});

// get all the active countries
app.get('/countries', authorization, (req, res) => {
  pool.query(`SELECT * FROM countries WHERE active=1`
    , (error, result) => {
      if (error) throw error;
      res.status(200).json({
        countries: result,
      })
    });
});


// get countries by region id
app.get('/countries/:regionid', authorization, (req, res) => {
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
app.get('/cities/:countryid', authorization, (req, res) => {
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
app.get('/cities', authorization, (req, res) => {
  pool.query(`SELECT regions.name as RegionName,regions.id as RegionId,countries.name as CountryName,
  countries.id as CountryId,cities.name as cityName,cities.id as CityId from regions LEFT JOIN countries
   ON countries.Regions_id=regions.id LEFT JOIN cities ON cities.Countries_id = countries.id WHERE cities.id=1`
    , (error, result) => {
      if (error) throw error;
      res.send(result);
    });
});


// add region
app.post('/regions', authorization, (req, res) => {
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
app.post('/countries/:idRegion', authorization, (req, res) => {
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
app.post('/cities/:idCountry', authorization, (req, res) => {
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
app.put("/countries/:id", authorization, async (req, res) => {
  const id = req.params.id
  pool.query(`UPDATE countries set name="${req.body.name}" WHERE id = ?`, [id]);
  res.status(200).json({
    operation: 1,
  })
})

// edit city name
app.put("/cities/:id", authorization, async (req, res) => {
  const id = req.params.id
  pool.query(`UPDATE cities set name="${req.body.name}" WHERE id = ?`, [id]);
  res.status(200).json({
    operation: 1,
  })
})


// deactivate a country
app.delete('/countries/:id', authorization, (req, res) => {
  pool.query(`UPDATE countries SET active = 0 WHERE id = ?`, [req.params.id]);
  res.status(200).json({
    operation: 1,
  })
})
// deactivate a country
app.delete('/cities/:id', authorization, (req, res) => {
  pool.query(`UPDATE cities SET active = 0 WHERE id = ?`, [req.params.id]);
  res.status(200).json({
    operation: 1,
  })
})

// deactivate a region
app.delete('/regions/:idRegion', authorization, (req, res) => {
  pool.query(`UPDATE regions SET active = 0 WHERE id = ?`, [req.params.idRegion]);
  res.status(200).json({
    operation: 1,
  })
})

// reactivate a region (only postman)
app.put('/regions/active/:idRegion', authorization, (req, res) => {
  pool.query(`UPDATE regions SET active = 1 WHERE id = ?`, [req.params.idRegion]);
  res.status(200).json({
    operation: 1,
  })
})




// COMPANIES----------------------------------------------

// get all the companies data
app.get('/companies', authorization, (req, res) => {
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
app.post('/companies', authorization, (req, res) => {
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
app.put('/companies/:id', authorization, (req, res) => {
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
app.delete('/companies/:id', authorization, (req, res) => {
  pool.query(`UPDATE companies SET active = 0 WHERE id = ?`, [req.params.id]);
  res.status(200).json({
    operation: 1,
    op: "deactivated correctly"
  })
})


// CONTACTS ---------------------------------------------


// get all contact data
app.get('/contacts', authorization, (req, res) => {
  pool.query(` SELECT con.id, con.fName, con.lName, con.job, con.email, con.address, con.email, con.interest,
   com.name as companyName,cit.name as cityName,coun.name as countryName,reg.name as regionName
  ,con.company_id,con.city_id,coun.id as countryID,reg.id as regionID,con.active
  ,GROUP_CONCAT(
         CONCAT_WS(': ', soc.name, account)
         SEPARATOR ',')as socials
    FROM contacts_has_social php 
    JOIN contacts con ON php.contacts_id = con.id  
    JOIN social soc ON php.social_id = soc.id 
    Join companies com ON con.company_id = com.id
    Join cities cit ON con.city_id =cit.id 
    Join countries coun ON cit.Countries_id=coun.id 
    Join regions reg ON coun.Regions_id = reg.id 
    group by con.id 
    HAVING con.active = 1
 `
    , (error, result) => {
      if (error) throw error;
      console.log(result[0].socials)
      
      res.status(200).json({
        contacts: result,
      })
    });
});


// get every social media 
app.get('/socials', authorization, (req, res) => {
  pool.query(`SELECT * from social`
    , (error, result) => {
      if (error) throw error;
      console.log(result[0].socials)
      res.status(200).json({
        socials: result,
      })
    });
});

// get social data of a contact
app.get('/editsocials/:id', authorization, (req, res) => {
  pool.query(`SELECT * from contacts_has_social where contacts_id=?`, [req.params.id]
    , (error, result) => {
      if (error) throw error;
      console.log(result[0])
      res.status(200).json({
        socials: result,
      })
    });
});

// update the  contact data
app.put('/contacts/:id', authorization, (req, res) => {
  const { fName, lName, job, email, companyid, cityid, address, interest,
    faceAcc, facePref, linkAcc, linkPref, instaAcc, instaPref, whatAcc, whatPref } = req.body;
 
  pool.query(`UPDATE contacts SET fName=?,lName=?,job=?,email=?,company_id=?,city_id=?,address=?,interest=? WHERE id = ?`,
    [fName, lName, job, email, companyid, cityid, address, interest, req.params.id], (error, result) => {
      if (error) {
        console.log(error)
        res.status(200).json({
          operation: 0,
        })
      } else {
        updatePart2()
      }
    })
  function updatePart2() {
    console.log(faceAcc, facePref, linkAcc, linkPref, instaAcc, instaPref, whatAcc, whatPref)
    pool.query("SELECT * from contacts WHERE email=?", [email], (error, result) => {
      if (error) {
        console.log(error)
        res.status(200).json({
          operation: 0,
        })
      } else {
        updatePart3(result[0].id, 1, whatAcc, whatPref)
        updatePart3(result[0].id, 2, instaAcc, instaPref)
        updatePart3(result[0].id, 3, linkAcc, linkPref)
        updatePart3(result[0].id, 4, faceAcc, facePref)

        res.status(200).json({
          operation: 1,
        })
      }
    })
  }
  function updatePart3(contactID,socialID,account,preference) {
    pool.query(`UPDATE contacts_has_social SET account=?,preference=? WHERE contacts_id = ? AND social_id=?`,
    [account,preference,contactID,socialID], (error, result) => {
      if (error) {
        console.log(error)
        res.status(200).json({
          operation: 0,
        })
      }
    })
  }
})


// create new contact
app.post('/contacts', authorization, (req, res) => {
  const { fName, lName, job, email, companyid, cityid, address, interest,
    faceAcc, facePref, linkAcc, linkPref, instaAcc, instaPref, whatAcc, whatPref } = req.body;

  const newContact = {
    fName: fName,
    lName: lName,
    job: job,
    email: email,
    address: address,
    interest: interest,
    company_id: companyid,
    city_id: cityid
  }

  pool.query("INSERT INTO contacts set ?", [newContact], (error, result) => {
    if (error) {
      res.status(200).json({
        operation: 0,
      })
    } else {
      part2()
    }
  })

  function part2() {
    
    pool.query("SELECT * from contacts WHERE email=?", [email], (error, result) => {
      if (error) {
        res.status(200).json({
          operation: 0,
        })
      }
      contactSocials(result[0].id, 1, whatAcc, whatPref)
      contactSocials(result[0].id, 2, instaAcc, instaPref)
      contactSocials(result[0].id, 3, linkAcc, linkPref)
      contactSocials(result[0].id, 4, faceAcc, facePref)
      res.status(200).json({
        operation: 1,
      })
    })
  }

  function contactSocials(contactID, socialID, SocAccount, SocPreference) {
    const newSocial = {
      contacts_id: contactID,
      social_id: socialID,
      account: SocAccount,
      preference: SocPreference,
    }
    pool.query("INSERT INTO contacts_has_social set ?", [newSocial], (error, result) => {
      if (error) {
        console.log(error)
        res.status(200).json({
          operation: 0,
        })
      }
    })
  }

});


// deactive contact by id
app.delete('/contacts/:id', authorization, (req, res) => {
  pool.query(`UPDATE contacts SET active = 0 WHERE id = ?`, [req.params.id]);
  res.status(200).json({
    operation: 1,
  })
})


// -----------------------------------
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
