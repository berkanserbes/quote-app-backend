require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ResponseModel = require("../models/base-models/ResponseModel");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const responseModel = new ResponseModel(
        null,
        "User already exist!",
        false
      );
      return res.status(400).json(responseModel);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json(new ResponseModel(newUser, "User created successfully!", true));
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const responseModel = new ResponseModel(null, "No user found!", false);
      return res.status(400).json(responseModel);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      const responseModel = new ResponseModel(null, "Invalid password!", false);
      return res.status(400).json(responseModel);
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json(token);
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

module.exports = { register, login };
