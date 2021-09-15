const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout , signup , signin , isSignedIn } = require("../controllers/auth.js");

router.post("/signin",[
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password").isLength({min:8}).withMessage("Password length must be atleast 8 characters.")
]
, signin );


router.post("/signup",[
    check("name","Name should be atleast 3 charracters long.").trim().isLength({min:3}),
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password").isLength({min:8}).withMessage("Password length must be atleast 8 characters."),
    check("mobile").isLength({min:10,max:10}).isMobilePhone().withMessage("Mobile number is invalid."),
    check("address").isLength({min:5}).withMessage("Please enter a valid address.")
]
, signup );


router.get("/signout",signout);


router.get("/testroute",isSignedIn ,(req,res) => {
    res.json(req.auth);
});


module.exports = router;