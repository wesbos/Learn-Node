const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

// Do work here
router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/add", authController.isLoggedIn, storeController.addStore);
router.post(
  "/add",
  authController.isLoggedIn,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.get(
  "/stores/:storeId/edit",
  authController.isLoggedIn,
  catchErrors(storeController.editStore)
);
router.get("/stores/:slug", catchErrors(storeController.showStore));
router.post(
  "/update/:storeId",
  authController.isLoggedIn,
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get("/tags", catchErrors(storeController.getStoresByTag));
router.get("/tags/:tag", catchErrors(storeController.getStoresByTag));

router.get("/login", userController.loginForm);
router.post("/login", authController.loginUser);
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.validateRegister,
  userController.register,
  authController.loginUser
);

router.get("/logout", authController.logout);
module.exports = router;
