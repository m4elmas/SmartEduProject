const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getHome = async (req, res) => {
  const courses = await Course.find().sort("-createAt").limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });
  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
};

exports.getAbout = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
    <h1>Mail Details </h1>
    <ul>
    <li>Name: ${req.body.name}</li>  
    <li>Email: ${req.body.email}</li>  
    </ul>
    <h1>Message </h1>
    <p>${req.body.message} </p>
    `;
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "helmer.beahan@ethereal.email",
        pass: "ZUW8wjYsuk6SdUx4zE",
      },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Mucahit Elmas  👻" <elmas.mcht@gmail.com>', // sender address
      to: "mucahit.elmas@hotmail.com", // list of receivers
      subject: "MERHABA", // Subject line
      html: outputMessage, // html body
    });

    req.flash("success", "We Receivede Your Message Successfully");

    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", `something happened! ${err}`);
    res.status(200).redirect("contact");
  }
};
