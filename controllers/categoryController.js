const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    req.flash("success",`${category.name} has been created!`)
    res.status(201).redirect("/users/dashboard")
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
   const category = await Category.findOneAndRemove({_id:req.params._id})
   req.flash("error",`${category.name} has been removed!`)
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};