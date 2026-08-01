var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');


/* GET users listing. */
router.options('*', (req,res)=> {res.statusCode=200});
router.get('/',cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
    .then((users)=>{
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json(users);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

router.post('/signup', cors.corsWithOptions, function(req,res,next){
  // Validate required fields before touching the DB so a malformed request
  // returns 400 instead of an unhelpful 500.
  if(!req.body.username || !req.body.password){
    res.statusCode=400;
    res.setHeader('Content-type','application/json');
    res.json({err: {message: 'Username and password are required'}, success: false});
    return;
  }

  User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
    if(err){
      // Log the FULL error so the exact failure is visible in Render logs.
      console.error('[SIGNUP ERROR] User.register failed:', err);

      // Duplicate username should be a client error (409), not a 500.
      if(err.name === 'UserExistsError'){
        res.statusCode=409;
        res.setHeader('Content-type','application/json');
        res.json({err: {message: 'Username already exists'}, success: false});
        return;
      }

      res.statusCode=500;
      res.setHeader('Content-type','application/json');
      res.json({err: err, success: false});
      return;
    }

    if(req.body.name)
      user.firstname = req.body.name;

    user.save((err, user) => {
      if(err){
        console.error('[SIGNUP ERROR] user.save failed:', err);
        res.statusCode = 500;
        res.setHeader('Content-type','application/json');
        res.json({err: err, success: false});
        return;
      }

      // Respond directly with success. (The previous passport.authenticate
      // auto-login required session middleware that isn't installed/configured
      // here, and the frontend moves to the Login modal after signup anyway.)
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json({status: 'Registration successfull !!', success: true});
    });
  });
});

router.post('/login',cors.corsWithOptions, (req, res, next)=>{

  passport.authenticate('local', (err, user, info) =>{
    if(err)
      return next(err);

    if(!user) {
      res.statusCode=401;
      res.setHeader('Content-type','application/json');
      res.json({success: false, status: 'Login Unsuccesfull', err:info});
      return;
    }

    req.logIn(user, (err)=>{
      if(err){
        res.statusCode=401;
        res.setHeader('Content-type','application/json');
        res.json({success: false, status: 'Login Unsuccesfull', err: 'Authentication failed'});
        return;
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json({status: 'Successfully logged in !!',success: true, token: token});
    });
  }) (req,res,next);
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

router.get('/checkJWTToken',cors.cors,  (req,res,next)=>{
  passport.authenticate('jwt', {session: false}, (err,user,info)=>{
    if(err) return next(err);

    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'JWT Invalid', success: false, err:info});
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'JWT valid', success: true, err:info});
    }
  }) (req,res);
});

module.exports = router;
