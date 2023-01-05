
const mongoose = require('mongoose');

const  bcrypt  = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {type :String , required : true},
    email : {type :String , required : true , unique : true},
    password : {type :String , required : true},
    pic:{
        type :String,
        required : true,
        default : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
},
{ timestamps : true});


userSchema.methods.matchpassword = async function(enteredpassword){          //comparing Both Passwords 
   return await bcrypt.compare(enteredpassword , this.password);
};

// Before storing password Hash it 

// This is kind of Middleware b/w 
userSchema.pre('save' ,async function (next){
    if(!this.isModified){           // If not modified then don't move 
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})


const User = mongoose.model("User" , userSchema);
module.exports = User;