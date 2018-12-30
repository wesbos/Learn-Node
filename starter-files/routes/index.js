const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
// function 'wrapper' that can catch any errors from async await functions
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags', catchErrors(storeController.getStoresbyTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresbyTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. validate registration data
// 2. register user
// 3. Log them in
router.post('/register', userController.validateRegister)

module.exports = router;
