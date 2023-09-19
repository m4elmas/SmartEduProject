const mongoose = require("mongoose");
const schema = mongoose.Schema;
const slugify = require("slugify");

const CategorySchema = new schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },

  slug: {
    type: String,
    unique: true,
  },
  
});

CategorySchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Categorym = mongoose.model("Category", CategorySchema);
module.exports = Categorym;
