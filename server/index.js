const express = require('express');
// const session = require('express-session');
const passport = require('passport')
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
var session = require('express-session');

import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import favicon from 'serve-favicon';
import socket from 'socket.io'
import { Server } from 'http'
import bodyParser from 'body-parser'
import fs from 'fs'
const mongoose = require('mongoose');
import Message from '../db/messageSchema'
import Room from '../db/roomSchema'
import { Binary } from 'mongodb'
import serveStatic from 'serve-static'
import imageDecoder from './imageDecoder'
// import Image from '../db/imageSchema'


const port = 5000;
const app = express();
const server = Server(app)
const compiler = webpack(config);
const io = socket(server)
const staticPath = path.join(__dirname, '..', '/public')

var room;
mongoose.connect('mongodb://admin:password@ds139791.mlab.com:39791/social-finance')

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(bodyParser.json()); // Send JSON responses



app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(serveStatic(staticPath))

//Configure Strategy
// Social Authentication routes
// 1. Login via Facebook
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

function extractProfile (profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}


var findOrCreate = require('mongoose-findorcreate')
var Schema = mongoose.Schema;
var UserSchema = new Schema({ googleId: Number, email: String, displayName: String});
UserSchema.plugin(findOrCreate);
var User = mongoose.model('User', UserSchema);

passport.use(new GoogleStrategy({
    clientID: '314444125630-jlt21ef4buv6vblsbvd83tcmd8vic56f.apps.googleusercontent.com',
    clientSecret: 'zrihpmMdc-8AnhLEI9NhDHT4',
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken)
    console.log('profile', profile)
    User.findOrCreate(
      { googleId: profile.id, email:profile.emails[0].value, displayName: profile.displayName },
      function (err, user) {
        console.log('findOrCreate user', user)
        return done(err, {
          user: user
        });
      }
    );
  }
));
passport.serializeUser(function(user, callback){
        console.log('serializing user.');
        callback(null, user.id);
    });

passport.deserializeUser(function(user, callback){
       console.log('deserialize user.');
       callback(null, user.id);
    });
//Authenticate Requests
app.use(session({
	secret: 'google-oauth-jwt',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.session());
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
                   successRedirect : '/',
                   failureRedirect : '/'
           }));



app.get('/messages', (req, res) => {
  Message.find({}, (err, docs) => {
    res.json(docs)
  })

})

app.get('/rooms', (req, res) => {
  console.log('in fetch rooms')
  Room.find({}, (err, docs) => {
    console.log('docs', docs)
    res.json(docs)
  })
})

app.post('/rooms', (req, res) => {
  let message = new Message({user: req.body.messages[0].user, content: req.body.messages[0].content, room: req.body.title})
  console.log('message', message)
  let room = new Room({title: req.body.title})

  message.save((err) => {
    if (err) return err
  })

  room.save((err) => {
    if (err) return err
  })

  res.json(message)
})

app.get('/', function(req, res) {
  console.log('get route caught this', req.user)
  var options;
  if ( req.user){
    options = {
      headers: {
          'email': req.user.email,
          'name': req.user.displayName,
      }
    };
  }

  res.sendFile(path.join( __dirname, '../src/index.html') ,options);
});


///////////

io.on('connection', function(socket) {
  console.log('a user connected')
  socket.on('subscribe', (data) => {
    room = data.room
    socket.join(room)
    console.log('joined room', room)
   }
  )
  socket.on('unsubscribe', () => { socket.leave(room)
    console.log('leaving room', room)
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

  socket.on('chat message', function(msg) {
    console.log('sending message to', msg.room)
    console.log('this message', msg)
    let message = new Message({user: msg.user, content: msg.message})


    // let message = new Message({user: msg.user, content: msg.message, room: msg.room})
    message.save((err) => {
        if (err) return err
      })

    io.to(msg.room).emit('chat message', JSON.stringify(msg))
  })

  socket.on('new room', (roomData) => {
    let message = new Message({user: roomData.user, content: roomData.message, room: roomData.room})
    message.save((err) => {
      if (err) return err
    })

  })

  socket.on('file_upload', (data, buffer) => {
    console.log(data)
    const user = data.user
    const fileName = path.join(__dirname, '../public/images', data.file)
    const tmpFileName = path.join('/images', data.file)
    const imageBuffer = imageDecoder(buffer)

    fs.open(fileName, 'a+', (err, fd) => {
      if (err) throw err;

      fs.writeFile(fileName, imageBuffer.data, {encoding: 'base64'}, (err) => {
        fs.close(fd, () => {
          let message = Message({user: user, room: room, image: tmpFileName})

          message.save((err) => {
            if (err) return err
          })
          console.log('file saved successfully!')
        });
      })
    })

    console.log('reached room, sending', fileName)
    io.to(room).emit('file_upload_success', {file: tmpFileName, user: user})
  })
});


const db = mongoose.connection;

db.once('open', () => {
 server.listen(port, function(err) {
   if (err) {
     console.log(err);
   } else {
     open(`http://localhost:${port}`);
  }
});


// app.post('/messages', (req, res) => {
//   console.log(req.body)
//     let message = new Message({user: req.body.user, content: req.body.message, room: room})
//     message.save((err) => {
//       if (err) return err
//     })
//       res.json(req.body)
//  })

})
