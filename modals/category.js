const mongoose = require("mongoose");

const category_schema = mongoose.Schema({ 

    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
        unique:true,
    }

}, {  timestamps:true  });


module.exports = mongoose.model("Category",category_schema);