require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found!", false));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetPasswordToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
        token: resetToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_AUTH_USERNAME,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_AUTH_USERNAME,
      to: user.email,
      subject: "Password reset",
      text: `You requested to reset your password. Click the following link to reset it: http://localhost:3000/reset-password/${resetPasswordToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json(new ResponseModel(null, error.message, false));

      res.status(200).json(new ResponseModel(null, "Email sent!", true));
    });
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

module.exports = { register, login, forgotPassword };
