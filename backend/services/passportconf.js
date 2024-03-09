var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcrypt');
const saltRounds = 10;

var config = require('config');

var userModel = require('../models/user');
var adminModel = require('../models/admin');

var localStrategyOption = {
  usernameField: 'email',
  passwordField : 'password',
  passReqToCallback : true
}

function localStrategyVerify(req,email, password, done){
  userModel.findOne({'email':email}, (err, user)=>{
    //  database server error
    if(err) {
      return done(err, false, {
        success : false,
        message : 'server error'
      });
    }

    // user not found
    if(!user) {
      return done(null, false, {
        success : false,
        message : 'email is not registered'
      })
    } else if (user.status == false) {
      return done(null, false, {
        success : false,
        message : 'your account is blocked'
      })
    }
    else {
      //check for password
      bcrypt.compare(password, user.password)
      .then( (result) => {
        if(result) {
          return done(null, user, {
            success : true,
            message : 'logged in successfully'
          });
        } else {
          return done(null, false, {
            success : false,
            message : 'invalid password'
          });
        }
      })
    }

  })
}

var localStrategy = new LocalStrategy(localStrategyOption, localStrategyVerify);

passport.use('login',localStrategy);


var jwt_options = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : config.jwt.secret
}

function jwtStrategyVerify(jwt_payload, done) {
  userModel.findById(jwt_payload._id, (err, user)=> {
    //  database server error
    if(err) {
      return done(err, false, {
        success : false,
        message : 'server error'
      });
    }
    if (user) {
      return done(null, user,{
          success: true,
          message: "Successful"
      }); 
    } 
    else {
      return done(null, false,{
          success: false,
          message: "Authorization Failed"
      });
    }
  });
}

var jwtStrategy = new JwtStrategy(jwt_options, jwtStrategyVerify);

passport.use('user-token',jwtStrategy);

var localStrategyOptionAdmin = {
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true
}

function localStrategyVerifyAdmin(req, username, password, done) {
  adminModel.findOne({'username':username}, (err, admin)=> {
    // database server error
    if(err) {
      return done(err, false, {
        success : false,
        message : 'server error'
      })
    }

    //admin not found
    if(!admin) {
      return done(null, false, {
        success : false,
        message : 'user not found'
      })
    } else {
      //check of password 
      bcrypt.compare(password, admin.password)
      .then((result)=>{
        if(result) {
          return done(null, admin, {
            success : true,
            message : 'logged in successfully'
          })
        }
        else {
          return done(null, false, {
            success : false,
            message : 'invalid password'
          })
        }
      })
    }
  })
}

var localStrategyAdmin = new LocalStrategy(localStrategyOptionAdmin, localStrategyVerifyAdmin);

passport.use('admin-login',localStrategyAdmin);

function jwtStrategyVeriryAdmin(jwt_payload, done) {
  adminModel.findById(jwt_payload._id, (err, admin)=>{
    //database server error
    if(err) {
      return done(err, false, {
        success : false,
        message : 'server error'
      })
    }

    if (admin) {
      return done(null, admin, {
        success : true,
        message : 'successful'
      })
    } else {
      return done(null, false, {
        success : false,
        message : 'Authorization failed'
      })
    }
  })
}

var jwtStrategyAdmin = new JwtStrategy(jwt_options, jwtStrategyVeriryAdmin);

passport.use('admin-token', jwtStrategyAdmin);

module.exports = passport;