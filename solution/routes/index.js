const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const { catchErrors } = require("../handlers/errorHandlers");

// Do work here
router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/stores/page/:page", catchErrors(storeController.getStores));
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
router.get("/account", authController.isLoggedIn, userController.account);
router.post(
  "/account",
  authController.isLoggedIn,
  catchErrors(userController.updateAccount)
);
// pass reset flow

// reset flow form in login page
// handle form submission
router.post("/account/forgot", catchErrors(authController.forgot));
// handle opening reset link
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.get("/map", storeController.mapPage);
router.get(
  "/hearts",
  authController.isLoggedIn,
  catchErrors(storeController.heartPage)
);

router.post(
  "/reviews/:id",
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);

router.get("/top", catchErrors(storeController.topStores));

// * API routes
// search stores
router.get("/api/search", catchErrors(storeController.searchStores));
// plot stores on map
router.get("/api/stores/near", catchErrors(storeController.mapStores));
// heart a store
router.post("/api/stores/:id/heart", catchErrors(storeController.heartStore));

module.exports = router;
