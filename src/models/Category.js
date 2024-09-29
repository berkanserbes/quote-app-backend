const { Schema, default: mongoose } = require("mongoose");
const Categories = require("../utils/constants/categories");

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    enum: Object.values(Categories),
  },
});

module.exports = mongoose.model("Category", categorySchema);
