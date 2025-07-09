const mongoose=require('mongoose')
const songschema = new mongoose.Schema({
    video_name: String,
    userid: String,
    video_path: String,   // Path for the song file
    image_path: String,  // Path for the image file
  });
  
  const Store = mongoose.model('Store', songschema);
  module.exports = Store;