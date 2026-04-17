const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Model = require('../model/models.js');

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports.showForgot = function(req, res) {
  res.render('forgot');
};

module.exports.handleForgot = function(req, res) {
  const username = (req.body.username || '').trim();
  if (!username) {
    req.flash('error', 'Please provide a username.');
    return res.redirect('/forgot');
  }
  Model.User.findOne({ where: { username } }).then(function(user) {
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + RESET_TOKEN_TTL_MS;

      user.resetToken = hashResetToken(token);
      user.resetTokenExpires = new Date(expires);

      return user.save().then(function() {
        console.log('Password reset link: http://localhost:3000/reset/' + token);
      });
    }
  }).then(function() {
    req.flash('error', 'If an account exists, a reset link has been generated.');
    return res.redirect('/');
  }).catch(function() {
    req.flash('error', 'Unable to process password reset right now.');
    return res.redirect('/forgot');
  });
};

module.exports.showReset = function(req, res) {
  const tokenHash = hashResetToken(req.params.token);

  Model.User.findOne({
    where: {
      resetToken: tokenHash,
      resetTokenExpires: { [Op.gt]: new Date() }
    }
  }).then(function(user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    return res.render('reset', { token: req.params.token });
  }).catch(function() {
    req.flash('error', 'Unable to validate reset token.');
    return res.redirect('/forgot');
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
  if (password.length < MIN_PASSWORD_LENGTH) {
    req.flash('error', 'Password must be at least 8 characters long.');
    return res.redirect('back');
  }
  const tokenHash = hashResetToken(req.params.token);

  Model.User.findOne({
    where: {
      resetToken: tokenHash,
      resetTokenExpires: { [Op.gt]: new Date() }
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
    return user.save().then(function() {
      req.flash('error', 'Password has been reset.');
      return res.redirect('/');
    });
  }).catch(function() {
    req.flash('error', 'Unable to reset password right now.');
    return res.redirect('/forgot');
  });
};
