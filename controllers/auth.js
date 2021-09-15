const User = require("../modals/user");
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");


exports.signup = function(req,res){

    console.log('Sign-Up');
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log('Error in Sign-up controller');
        return res.status(422).json({
            error:errors.array()[0].msg,
            param:errors.array()[0].param
        });
    }

    var user = new User(req.body);
    user.save((err , user) => {

        if(err)
        {
            return res.status(400).json({
                error:"Unable to save user. This e-mail might be already registered !"
            })
        }
        res.json({
            id:user._id,
            name:user.name,
            email:user.email
        });
    });

}


exports.signin = function(req,res){

    console.log('Sign-In');
    const errors = validationResult(req)
    // Error object : 
    // {
    //     "errors": [
    //       {
    //         "location": "body",
    //         "msg": "Invalid value",
    //         "param": "username"
    //       }
    //     ]
    // }

    const { email,password } = req.body;
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error:errors.array()[0].msg,
            param:errors.array()[0].param
        });
    }
 

    User.findOne({ email },(err,user) => {
 
            if(err || user == null)
            {
                return res.status(400).json({
                    error:"User not registered !"
                });
            }

            if(!user.authenticate(password))
            {
                return res.status(402).json({
                    error:"Password is incorrect !"
                })
            }

            // If the user do exist in the DB and is entered into it 
            // with correct password,
            // create token

            var token = jwt.sign({ _id:user._id } ,process.env.SECRET );

            // put token in cookie . In first argument we are assigning the name to the token ,in second we are passing the token...
            res.cookie("token",token,{expire : new Date()+9999 });

            var { _id , name , role} = user;
            // send response to front end
            return res.json({
                 token,
                 user: { _id , name , role}
            });

    });


}


exports.signout = function(req,res){
    // res.send("user signout");
    console.log('Sign-Out');
    res.clearCookie("token");
    res.json({
        message:"Sign Out successfull"
    });

}

//  userProperty allows us to set a property of any name ,
//  "auth" in here , which holds
//  the id and some more info ... which is can be sent
//  back as response to the front-end...
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// expressJwt decrypts the token and fetches user's object id from it.
// Then, it create an object named auth and assigns key as _id and value
// decrypted object id.


//  Custom Middleware : For checking the authenticity , 
//  that wheather user can do stuff or not. For ex., in fb
//  u cannot view anybody elses profile until you are logged-in

//  req.profile() is set-up by the getUserById param
exports.isAuthenticated = (req,res,next) => {

    console.log('AuthCheck');
    var checker = req.auth && req.profile && req.profile._id == req.auth._id;

    if(!checker)
    {
        return res.status(403).json({
            error : "ACCESS DENIED"
        });
    }
    next();

}


exports.isAdmin = (req,res,next) => {

    console.log('IsAdminCheck');
    var checker = req.profile.role === 0;
    if(checker)
        return res.status(403).json({
            error : "Not allowed to do so! ACCESS DENIED"
        });
    
    next();

}
