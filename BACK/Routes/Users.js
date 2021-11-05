const express = require("express");

const router = express.Router();


const pool = require('../database');

const jwt = require("jsonwebtoken");
const { SECRET } = process.env

const { adminAuth, authorization, limiter } = require("../middlewares")



// register new users
router.post('/register', authorization, adminAuth, (req, res) => {

    const { fName, lName, username, email, password, admin } = req.body;

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
            } else {
                console.log("added user successfully")
                res.status(200).json({
                    operation: 1,
                })
            }
        })
    }
})


// login
router.post('/login', (req, res) => {
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
router.delete("/users/:id", authorization, adminAuth, (req, res) => {
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
router.get("/logout", (req, res) => {
    return res
        .clearCookie("accessdata_token")
        .status(200)
        .json({ message: "Successfully logged out " });
});

// get all the users
router.get('/users', authorization, (req, res) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

module.exports = router;