const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');
const userController = require('../controllers/user');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here`
router.get('/', storeController.getStores)
router.get('/add', 
  userController.loginGuarantee,
  storeController.addStore);
  
router.post('/add',
  userController.loginGuarantee,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
)
router.post('/add/:slug',
  userController.loginGuarantee,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore))
router.get('/stores/:slug', catchErrors(storeController.getStore))
router.get('/stores/:slug/edit', catchErrors(storeController.editStore))

router.get('/tags', catchErrors(storeController.getPostByTag))
router.get('/tags/:tag', catchErrors(storeController.getPostByTag))

router.get('/login', userController.loginPage);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/register', userController.registerPage)
router.post('/register',
  userController.registerValidation, 
  catchErrors(userController.register)
);

router.get('/account', userController.accountPage);
router.post('/account', userController.updateAccount);

router.post('/forgot', userController.forgotPassword);

router.get('/account/reset/:token', userController.resetPasswordPage);
router.post('/account/reset', userController.resetPasswordValidation , catchErrors(userController.updatePassword));

module.exports = router

