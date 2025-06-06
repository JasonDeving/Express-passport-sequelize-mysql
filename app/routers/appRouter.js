var passport = require('passport'),
    signupController = require('../controllers/signupController.js'),
    passwordResetController = require('../controllers/passwordResetController.js')

module.exports = function(express) {
  var router = express.Router()

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next()
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }
  
  router.get('/signup', signupController.show)
  router.post('/signup', signupController.signup)

  router.get('/forgot', passwordResetController.showForgot)
  router.post('/forgot', passwordResetController.handleForgot)
  router.get('/reset/:token', passwordResetController.showReset)
  router.post('/reset/:token', passwordResetController.handleReset)

  router.post('/login', passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true 
  }))

  router.get('/', function(req, res) {
    res.render('home')
  })

  router.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('dashboard')
  })

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  return router
}
