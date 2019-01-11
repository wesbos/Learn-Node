const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register'})
}

// registration data validation middleware
exports.validateRegister = (req, res, next) => {
    // these come in express-validator
    req.sanitizeBody('name')                                    // sanitize name data supplied
    req.checkBody('name', 'You must supply a name').notEmpty()  // make name required
    req.checkBody('email', 'Email not valid').isEmail()         // check for valid email format
    req.sanitizeBody('email').normalizeEmail({                  // normalize email inputs
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Confirm password cannot be blank').notEmpty()
    req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password)

    // catch any errors
    const errors = req.validationErrors()
    if (errors) {
        req.flash('error', errors.map(err => err.msg))
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
    } else {
        next() // only go forward to .register if no errors
    }
}

// more middleware to register the user
exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name })
    const register = promisify(User.register, User)
    await register(user, req.body.password)
    next() // go on to authController.login
}