const User = require("../modals/user");
const { Order } = require("../modals/order");


exports.getUserById = (req, res, next ,id) => {

    console.log('GetUserParam');
    // console.log("PARAM FIRST !")
    // As soon as the parameters are detected in URL , this function gets executed ,
    // no matter weather you are authenticated , authorized or not , it just gets 
    // executed !...

    User.findById(id).exec((err, user) => {

        if(err || !user){
            res.status(400).json({
                "error":"Can not be found"
            });
        }

        req.profile = user;
        next();
    });

}


exports.getUser = (req, res) => {

    console.log('GetUserDetails');
    req.profile._id = undefined;
    req.profile.purchases = undefined;
    req.profile.role = undefined;
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.__v = undefined;

    return res.json(req.profile);

}


exports.updateUser = async (req, res) => {

    console.log('UpdateUser');
    try {
        let user = await User.findByIdAndUpdate({ _id:req.profile._id, }, { $set: req.body } , { new:true,useFindAndModify:false } );
        user._id = undefined;
        user.purchases = undefined;
        user.role = undefined;
        user.salt = undefined;
        user.encry_password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        user.__v = undefined;

        return res.json(user);
    }
    catch(e){
        return res.json({
            error:"Error while updating !"
        })
    }

}


exports.userPurchaseList = (req, res) => {

    console.log('GetUserPurchaseList');
// How it works >>
//    If we talk specifically here , then , first of all Order.find() finds all the 
//    records with req.profile._id , this gives you an array from the Order's 
//    collections where all the orders have user property = req.profile._id .
//    Then , we the populate.

    Order.find({ user:req.profile._id })
    .populate("user","_id name")
    .exec((err, order) => {
        if(err) return res.status(400).json({
            err:"No order in this account"
        });
        return res.json(order);
    });

}


exports.pushOrderInPurchaseList = (req, res, next) => {

    console.log('PushOrderInPurchaseList');
    let purchases = [];
    req.body.order.products.forEach(product => {

        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction:req.body.order.transaction_id
        });
    });

    // store it to DB...
    User.findOneAndUpdate(
        { _id:req.profile._id  },
        { $push: { purchases:purchases } },
        { new:true },
        (err, purchases) => {

            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                });
            }

            next();
        }
    );

}
