const ResponseModel = require("../models/base-models/ResponseModel");
const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      const response = new ResponseModel(
        null,
        "Category already exist!",
        false
      );
      return res.status(400).json(response);
    }

    const newCategory = new Category({ title });
    await newCategory.save();

    const response = new ResponseModel(
      newCategory,
      "Category created successfully",
      true
    );

    return res.status(201).json(response);
  } catch (err) {
    const response = new Response(null, err.message, false);
    res.status(500).json(response);
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await Category.find();

    const response = new ResponseModel(result, "", true);

    return res.status(200).json(response);
  } catch (err) {
    const response = new ResponseModel(null, err.message, false);
    return res.status(500).json(response);
  }
};

module.exports = { createCategory, getCategories };
