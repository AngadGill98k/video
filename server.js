const express = require('express')
const app = express()
const PORT = 3001
const path = require('path')
const mongoose = require('mongoose');
const cors = require('cors');
const multer=require('multer');
const User = require('./models/user.js');
const Store=require('./models/store.js')
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // or wherever your React app runs
  credentials: true                // 🔥 must be true to support cookies
}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/viode' }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, './uploads');  // The folder where files will be stored
    },
    filename: (req, file, cb) => {
      const filename = Date.now() + path.extname(file.originalname);  // Generate unique filename
      return cb(null, filename);  // Provide the generated filename
    }
  });

const upload=multer({storage})

mongoose.connect('mongodb://127.0.0.1:27017/viode')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));





passport.use(new LocalStrategy(
  { usernameField: 'mail' },  // tell passport to use `mail` instead of `username`
  async (mail, password, done) => {
    const user = await User.findOne({ mail });
    if (!user) return done(null, false, { message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Wrong password' });

    return done(null, user._id);
  }
));

passport.serializeUser((user, done) => {
  done(null, user); // Store only the user ID in session
});

passport.deserializeUser(async (id, done) => {

  done(null, id);
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: 'You must be logged in' });
}














app.post('/signup',async (req,res)=>{
    let {username, mail, password}=req.body
    let hashed=await bcrypt.hash(password, 10);
    let user=await new User({
        name:username,
        mail,
        password:hashed,
        playlist:[],
        videos_created:[]
    })
    await user.save()
    if (user){
        res.json({msg:'added user'})
    }
})
app.post('/signin', passport.authenticate('local'), (req, res) => {
  res.json({ msg: 'Logged in successfully', user: req.user });
});

app.get('/user', async (req, res) => {
  try {
    const userId = req.user; // assuming populated by session middleware

    const user = await User.findById(userId).lean(); // .lean() returns plain JS object

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch all songs created using the IDs in user.songs_created
    const video = await Store.find({
      _id: { $in: user.videos_created }
    }).lean();

    // Return combined user info with song documents
    res.json({
      username: user.name,
      mail: user.mail,
      playlists: user.playlist,
      videos: video
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});


app.post('/up_video', ensureAuth, upload.fields([{ name: 'video' }, { name: 'img' }]), async (req, res) => {
  try {
    const userid = req.user;
    const { video_name } = req.body;
    const videoFile = req.files['video'][0];
    const img = req.files['img'][0];

    const videoPath = `/uploads/${videoFile.filename}`;
    const imagePath = `/uploads/${img.filename}`;

    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const store = new Store({
      video_name,
      userid,
      video_path: videoPath,
      image_path: imagePath,
    });
    await store.save();

    user.videos_created.push(store._id);
    await user.save();

    res.json({ msg: 'Video uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading video');
  }
});
app.post('/add-playlist', async (req, res) => {
  const userId = req.user;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Playlist name is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const newPlaylist = {
      playlist_name: name.trim(),
      videos: []
    };

    user.playlist.push(newPlaylist);
    await user.save();

    // Return the last inserted playlist (the one just added)
    const created = user.playlist[user.playlist.length - 1];
    res.json({ msg: 'Playlist created', playlist: created });

  } catch (err) {
    console.error('Error adding playlist:', err);
    res.status(500).json({ msg: 'Server error creating playlist' });
  }
});

app.post('/add-video-to-playlist', async (req, res) => {
  const userId = req.user;
  const { playlistId, videoId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const playlist = user.playlist.id(playlistId);
  if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await user.save();
  }

  res.json({ msg: 'Video added to playlist' });
});

app.post('/get-videos-by-ids', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ msg: 'Invalid video IDs' });
    }

    const videos = await Store.find({ _id: { $in: ids } });
    console.log(videos)
    res.json({ videos });
  } catch (err) {
    console.error('Error fetching videos by IDs:', err);
    res.status(500).json({ msg: 'Server error fetching videos' });
  }
});

app.get('/get-user-playlists', async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  res.json({ playlists: user.playlist });
});

app.post('/searching', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || input.trim() === '') {
      return res.status(400).json({ msg: 'Search term is required' });
    }

    const store = await Store.find({
      video_name: { $regex: input, $options: 'i' } // 🔄 updated to video_name
    });

    res.json({ msg: 'Search complete', videos: store });
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


app.post('/add-song-to-playlist', async (req, res) => {
  const userId = req.user;
  const { playlistId, songId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const playlist = user.playlist.id(playlistId);
  if (!playlist) return res.status(404).json({ msg: 'Playlist not found' });

  if (!playlist.videos.includes(songId)) {
    playlist.videos.push(songId);
    await user.save();
  }

  res.json({ msg: 'Song added to playlist' });
});

app.get('/random-videos', async (req, res) => {
  try {
    const videos = await Store.aggregate([{ $sample: { size: 30 } }]);
    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching random videos' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
