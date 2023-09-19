const express = require("express");
const authController = require("../controllers/authController");
const authmiddleware = require("../middlewares/authmiddleware");
const User = require("../models/User");
const { body } = require("express-validator");

const router = express.Router();

router.route("/signup").post(
  [
    body("name").not().isEmpty().withMessage("Please Enter Your Name"),
    body("email")
      .isEmail()
      .withMessage(" Please Enter Your Valid Email")
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject("Email is already exist!");
          }
        });
      }),

    body("password").not().isEmpty().withMessage(" Please Enter Your Password"),
  ],
  authController.createUser
);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authmiddleware, authController.getDashboardPage);
router.route("/:_id").delete(authController.deleteUser);
module.exports = router;
