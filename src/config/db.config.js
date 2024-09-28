const mongoose = require("mongoose");

const connectDb = async (url) => {
  try {
    return mongoose.connect(url, {
      autoCreate: true,
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDb;
