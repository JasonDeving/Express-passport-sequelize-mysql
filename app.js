// application

var express = require('express'),
    app = express(),
    setupHandlebars  = require('./app/setupHandlebars.js')(app),
    setupPassport = require('./app/setupPassport'),
    flash = require('connect-flash'),
    appRouter = require('./app/routers/appRouter.js')(express),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jsonParser = bodyParser.json()

var port = process.env.PORT || 3000
var isProduction = process.env.NODE_ENV === 'production'
var sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  sessionSecret = 'development-only-secret-change-me'
  console.warn('SESSION_SECRET is not set. Falling back to an insecure development secret.')
}

app.use(cookieParser())
app.use(session({
  name: 'sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 12 // 12 hours
  }
}))

app.use(function(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  next()
})

app.use(express.static('app/public'));

app.use(flash())
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash('error')
    next()
});

app.use(jsonParser)
app.use(bodyParser.urlencoded({
  extended: true
}))

setupPassport(app)

app.use('/', appRouter)

// start app
app.listen(port)
console.log('Server started on port ' + port)

module.exports.getApp = app
