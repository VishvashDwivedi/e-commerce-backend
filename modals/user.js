const mongoose = require("mongoose");
var crypto = require("crypto");
var uuid = require('uuid');

var userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    mobile:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        trim: true,
        unique: true
    },
    address:{
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    encry_password:{
        type:String,
        required:true,
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default:[]
    }

},  {  timestamps:true  } );


userSchema.virtual("password")
    // https://stackoverflow.com/questions/18239358/adding-virtual-variables-to-a-mongoose-schema
    .set( function(password) {
        this._password = password;
        this.salt = uuid.v1();
        this.encry_password = this.securePass(password);
    } )
    
    // https://github.com/Automattic/mongoose/issues/2642
    .get(function(){
        return this._password;
    })


userSchema.methods = {

    authenticate : function(plainpass)
    {
        return (this.securePass(plainpass) === this.encry_password);
    },

    securePass : function(plainpass)
    {
        if(!plainpass)    return "";

        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpass)
            .digest('hex');
        }
        catch(err){
            return "";
        }

    }
}


module.exports = mongoose.model("User",userSchema);