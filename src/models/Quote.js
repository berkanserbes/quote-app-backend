const { Schema } = require("mongoose");

const quoteSchema = new Schema({}, { timestamps: true });

module.exports = mongoose.model("Quote", quoteSchema);
