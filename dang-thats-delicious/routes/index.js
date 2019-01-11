const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.get('/', storeController.homePage);

router.get('/add', storeController.addStore)
router.post('/add', storeController.createStore)

router.get('/login', userController.loginForm)
router.post('/login', () => console.log('login data posted!'))


router.get('/register', userController.registerForm)
router.post('/register',
    userController.validateRegister,    // 1 Validate Registration Data
    userController.register,            // 2 Register User
    authController.login                // 3 Log them in
)

module.exports = router;
