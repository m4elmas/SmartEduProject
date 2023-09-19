const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      Category: req.body.Category,
      user: req.session.userId,
    });
    req.flash("success",`${course.name} has been created successfully!`)
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error",`something happened! ${error} `)
    res.status(400).redirect("/courses");
};
}

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = await req.query.category;
    const query = await req.query.search;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};

    if (categorySlug) {
      filter = { Category: category._id };
    }
    if (query) {
      filter = { name: query };
    }
    if (!query && !categorySlug) {
      filter.name = "";
      filter.Category = null;
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { Category: filter.Category },
      ],
    })
      .sort("-createAt")
      .populate("user");

    const categories = await Category.find({});
    res.status(200).render("courses", {
      courses,
      page_name: "courses",
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const categories = await Category.find({});
    res.status(200).render("course-single", {
      course,
      user,
      categories,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
   const course = await Course.findOneAndRemove({slug:req.params.slug})
   req.flash("error",`${course.name} has been removed!`)
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
   const course = await Course.findOne({slug:req.params.slug})
   course.name = req.body.name;
   course.description = req.body.description;
   course.category = req.body.category;
   course.slug = req.body.slug;
   course.save();

   req.flash("success",`${course.name} has been updated!`)
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
