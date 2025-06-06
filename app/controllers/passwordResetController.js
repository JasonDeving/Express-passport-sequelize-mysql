const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Model = require('../model/models.js');

module.exports.showForgot = function(req, res) {
  res.render('forgot');
};

module.exports.handleForgot = function(req, res) {
  const username = req.body.username;
  if (!username) {
    req.flash('error', 'Please provide a username.');
    return res.redirect('/forgot');
  }
  Model.User.findOne({ where: { username } }).then(function(user) {
    if (!user) {
      req.flash('error', 'No user found.');
      return res.redirect('/forgot');
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour
    user.resetToken = token;
    user.resetTokenExpires = new Date(expires);
    user.save().then(function() {
      console.log('Password reset link: http://localhost:3000/reset/' + token);
      req.flash('error', 'Check console for reset link.');
      res.redirect('/');
    });
  });
};

module.exports.showReset = function(req, res) {
  Model.User.findOne({
    where: {
      resetToken: req.params.token,
      resetTokenExpires: { $gt: new Date() }
    }
  }).then(function(user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', { token: req.params.token });
  });
};

module.exports.handleReset = function(req, res) {
  const password = req.body.password;
  const password2 = req.body.password2;
  if (!password || !password2) {
    req.flash('error', 'Please fill in all fields.');
    return res.redirect('back');
  }
  if (password !== password2) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('back');
  }
  Model.User.findOne({
    where: {
      resetToken: req.params.token,
      resetTokenExpires: { $gt: new Date() }
    }
  }).then(function(user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.password = hashedPassword;
    user.salt = salt;
    user.resetToken = null;
    user.resetTokenExpires = null;
    user.save().then(function() {
      req.flash('error', 'Password has been reset.');
      res.redirect('/');
    });
  });
};
