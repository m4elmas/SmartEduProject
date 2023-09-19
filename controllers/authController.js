const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    const result = validationResult(req);
    console.log(result);

    for (let i = 0; i < result.array().length; i++) {
      req.flash("error", `${result.array()[i].msg}`);
    }

    res.status(400).redirect("/register");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          //user session
          req.session.userId = user._id;
          res.status(200).redirect("/users/dashboard");
        } else {
          req.flash("error", "Your Password is Not Correct!!");
          res.status(400).redirect("/login");
        }
      });
    }else throw ("Your Email İs Not Exist!!")
  } catch (error) {
    req.flash("error", error);
    res.status(400).redirect("/login");
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userId }).populate(
    "courses"
  );
  const users = await User.find();
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userId }).sort("-createAt");
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    users,
    categories,
    courses,
  });
};


exports.deleteUser = async (req, res) => {
  try {
   const user = await User.findOneAndRemove({_id:req.params._id})
   await Course.deleteMany({user:req.params._id})
   req.flash("error",`${user.email} has been removed!`)
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};