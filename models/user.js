const mongoose=require('mongoose')


const playlistschema=new mongoose.Schema({
    playlist_name:String,
    videos:[String]
})

const userschema=new mongoose.Schema({
    name:String,
    mail:String,
    password:String,
    playlist:[playlistschema],
    videos_created:[String]
})
const User=mongoose.model('User',userschema)
module.exports=User