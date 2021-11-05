const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const { SECRET } = process.env


// admin rights checker
const adminAuth = async (req, res, next) => {
   
    if (req.user.admin) {
        next()
    } else {
        console.log("user was not an admin")
        return res.sendStatus(403).json({
            userstatus: 0
        });
    }
};

// authorization
const authorization = (req, res, next) => {
    const token = req.headers.authorization || req.cookies.accessdata_token;
    if (!token) {
        return res.sendStatus(403).json({
            userstatus: 0
        });
    }
    else {
        try {
            const data = jwt.verify(token, SECRET);
            req.user = data
            console.log(`auth Completed, welcome ${data.email}`)
            return next();
        } catch {
            return res.sendStatus(403).json({
                userstatus: 0
            })
        }
    }
};

// rate limiter
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 20,
    message: "Excediste el numero de peticiones intenta mas tarde",
});

module.exports = {
    adminAuth,
    authorization,
    limiter
}