const express = require("express");

const router = express.Router();

const pool = require('../database');

const { adminAuth, authorization, limiter } = require("../middlewares")



// get all contact data
router.get('/contacts', authorization, (req, res) => {
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
  router.get('/socials', authorization, (req, res) => {
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
  router.get('/editsocials/:id', authorization, (req, res) => {
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
  router.put('/contacts/:id', authorization, (req, res) => {
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
  router.post('/contacts', authorization, (req, res) => {
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
  router.delete('/contacts/:id', authorization, (req, res) => {
    pool.query(`UPDATE contacts SET active = 0 WHERE id = ?`, [req.params.id]);
    res.status(200).json({
      operation: 1,
    })
  })
  

  module.exports = router;