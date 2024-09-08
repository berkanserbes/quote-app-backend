const { Schema, Query, default: mongoose } = require("mongoose");
const Categories = require("../utils/constants/categories");

const quoteSchema = new Schema(
  {
    _id: {
      type: Number,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      default: "Unknown",
    },
    category: {
      type: String,
      enum: Object.values(Categories),
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

quoteSchema.pre("save", async function () {
  if (!this.isNew) return;
  const highestIndex = await mongoose
    .models("Quote")
    .findOne()
    .sort({ _id: -1 });

  this._id = highestIndex ? highestIndex._id + 1 : 1;
  next();
});

module.exports = mongoose.model("Quote", quoteSchema);
