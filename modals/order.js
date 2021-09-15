const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = mongoose.Schema({

    product:{
        type:ObjectId,
        ref:"Product"
    },
    name: String,
    count: Number,
    price: Number

});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const Order_schema = mongoose.Schema({

    products: [ProductCartSchema],
    transactionID:{},
    amount:{ type: Number },
    updated: Date,
    address: {
        type: String,
        required : true
    },
    status:{
        type: String,
        default: "Processing",
        enum: [ "Cancelled", "Delivered", "Shipped", "Processing", "Recieved" ]
    },
    user:{
        type: ObjectId,
        ref:"User",
    }

}, {  timestamps:true  });


const Order = mongoose.model("Order",Order_schema);

module.exports = {ProductCart , Order};
