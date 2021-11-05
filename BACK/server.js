require('dotenv').config()
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const userRoutes=require('./Routes/Users');
const regionRoutes=require('./Routes/Regions');
const companiesRoutes=require('./Routes/Companies');
const contactRoutes=require('./Routes/Contacts');


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


// USERS
app.use(userRoutes)

// REGIONS/COUNTRIES/CITIES
app.use(regionRoutes)

// COMPANIES----------------------------------------------
app.use(companiesRoutes)

// CONTACTS ---------------------------------------------
app.use(contactRoutes)


// -----------------------------------
app.listen(3000, function () {
  console.log("Server started on port 3000");
});