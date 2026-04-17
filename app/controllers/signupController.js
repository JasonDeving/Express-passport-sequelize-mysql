var bcrypt = require('bcrypt'),
    Model = require('../model/models.js')

module.exports.show = function(req, res) {
  res.render('signup')
}

module.exports.signup = function(req, res) {
  var username = (req.body.username || '').trim()
  var password = req.body.password
  var password2 = req.body.password2
  
  if (!username || !password || !password2) {
    req.flash('error', "Please, fill in all the fields.")
    return res.redirect('/signup')
  }
  
  if (password !== password2) {
    req.flash('error', "Please, enter the same password twice.")
    return res.redirect('/signup')
  }

  if (password.length < 8) {
    req.flash('error', 'Password must be at least 8 characters long.')
    return res.redirect('/signup')
  }
  
  var salt = bcrypt.genSaltSync(10)
  var hashedPassword = bcrypt.hashSync(password, salt)
  
  var newUser = {
    username: username,
    salt: salt,
    password: hashedPassword
  }
  
  Model.User.create(newUser).then(function() {
    res.redirect('/')
  }).catch(function(error) {
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  })
}
