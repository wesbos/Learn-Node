const express = require('express')
const router = express.Router()
const storeController = require('../controllers/store')
const userController = require('../controllers/user')
const authController = require('../controllers/auth')
const {catchErrors} = require('../handlers/errorHandlers')
const passport = require('passport'); 

// Do work here
router.get('/', storeController.getStores)
router.get('/add', storeController.addStore)
router.post('/add', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
)
router.post('/add/:slug', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore))
router.get('/stores/:slug', catchErrors(storeController.getStore))
router.get('/stores/:slug/edit', catchErrors(storeController.editStore))

router.get('/tags', catchErrors(storeController.getPostByTag))
router.get('/tags/:tag', catchErrors(storeController.getPostByTag))

router.get('/login', userController.loginPage);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successMessage: 'Đăng nhập thành công',
  failureRedirect: '/login',
  failureMessage: 'Xin hãy thử lại'
})
);

router.get('/logout', authController.logout);

router.get('/register', userController.registerPage)
router.post('/register', 
  userController.registerValidation, 
  catchErrors(authController.register)
)

module.exports = router

