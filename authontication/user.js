const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    instaid:{
        type:String,
        required:false
    },
    instapass:{
        type:String,
        required:false
    },
    fbid:{
        type:String,
        required:false
    },
    fbpass:{
        type:String,
        required:false
    },
    twiid:{
        type:String,
        required:false
    },
    twipass:{
        type:String,
        required:false
    },
    otp:{
        type:String,
        required:false
    }
});
const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    imgpath: {
        type: String,
        required: false
    },
    fb:{
        type: String,
        required: false
    },
    insta:{
        type: String,
        required: false
    },
    twi:{
        type: String,
        required: false
    },
    mail:{
        type:String,
        required:true
    }
});
const User=mongoose.model('users',UserSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports = { User, Post };