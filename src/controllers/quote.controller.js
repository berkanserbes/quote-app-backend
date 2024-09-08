const ResponseModel = require("../models/base-models/ResponseModel");
const Quote = require("../models/Quote");

const createQuote = async (req, res) => {
  try {
    const { body, author, category } = req.body;
    const result = await Quote.create({ body, author, category });

    const response = new ResponseModel(
      result,
      "Quote created successfully",
      true
    );

    res.status(201).json(response);
  } catch (err) {
    const response = new Response(null, err.message, false);
    res.status(500).json(response);
  }
};

const getQuotes = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      author = "",
      skip = 0,
      take = 20,
    } = req.query;

    const filterQuery = {};

    if (search) filterQuery.body = { $regex: search, $options: "i" };

    if (category)
      filterQuery.category = { $regex: new RegExp(`^${category}$`, "i") };

    if (author) filterQuery.author = { $regex: new RegExp(`^${author}$`, "i") };

    const result = await Quote.find(filterQuery).skip(+skip).limit(+take);

    const response = new ResponseModel(
      result,
      "Quotes fetched successfully",
      true
    );

    return res.status(200).json(response);
  } catch (err) {
    const response = new ResponseModel(null, err.message, false);
    return res.status(500).json(response);
  }
};

const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Quote.findById(id);

    if (!result) {
      const response = new ResponseModel(null, "Quote not found", true);
      return res.status(404).json(response);
    }

    const response = new ResponseModel(
      result,
      "Quote fetched successfully",
      true
    );

    return res.status(200).json(response);
  } catch (err) {
    const response = new ResponseModel(null, err.message, false);
    return res.status(500).json(response);
  }
};

module.exports = { createQuote, getQuotes, getQuoteById };
