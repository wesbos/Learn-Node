const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const {catchErrors} = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.get('/stores/:storeId/edit', catchErrors(storeController.editStore));
router.post('/update/:storeId',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore));

module.exports = router;
