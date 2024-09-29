const { Router } = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/category.controller");

const router = new Router();

router.route("/").post(createCategory).get(getCategories);

module.exports = router;
