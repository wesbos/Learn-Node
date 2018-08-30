const express = require('express')
const router = express.Router()
const storeController = require('../controllers/store')
const {catchErrors} = require('../handlers/errorHandlers')

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
module.exports = router
