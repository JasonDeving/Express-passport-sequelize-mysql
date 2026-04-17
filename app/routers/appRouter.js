var passport = require('passport'),
    signupController = require('../controllers/signupController.js'),
    passwordResetController = require('../controllers/passwordResetController.js')

module.exports = function(express) {
  var router = express.Router()
  var performLogout = function(req, res) {
    req.logout(function(err) {
      if (err) {
        req.flash('error', 'Logout failed.')
        return res.redirect('/')
      }
      req.session.destroy(function() {
        res.clearCookie('sid')
        return res.redirect('/')
      })
    })
  }

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next()
    req.flash('error', 'You have to be logged in to access the page.')
    return res.redirect('/')
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

  router.post('/logout', isAuthenticated, performLogout)
  router.get('/logout', isAuthenticated, performLogout)

  return router
}
