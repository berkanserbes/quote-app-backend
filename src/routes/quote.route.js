const { Router } = require("express");
const {
  getQuotes,
  createQuote,
  getQuoteById,
} = require("../controllers/quote.controller");

const router = new Router();

router.route("/").get(getQuotes).post(createQuote);
router.route("/:id").get(getQuoteById);

module.exports = router;
