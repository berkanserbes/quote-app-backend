const ResponseModel = require("../models/base-models/ResponseModel");
const User = require("../models/User");

const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res
      .status(200)
      .json(new ResponseModel(users, "Users fetched successfully", true));
  } catch (error) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-favoriteQuotes"); // Excluding favoriteQuotes
    if (!user)
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found.", false));

    return res
      .status(200)
      .json(new ResponseModel(user, "User retrieved successfully", true));
  } catch (error) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, image },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found!", false));
    }

    return res
      .status(200)
      .json(new ResponseModel(updatedUser, "User updated successfully", true));
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json(new ResponseModel(null, "Old password is incorrect.", false));
    }

    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json(new ResponseModel(null, "Passwords do not match.", false));

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    return res
      .status(200)
      .json(new ResponseModel(null, "Password updated successfully.", true));
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const getFavoriteQuotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await user.findById(userId).populate("favoriteQuotes");

    if (!user)
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found.", false));

    return res.status(200).json(user.favoriteQuotes);
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const addFavoriteQuote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quoteId } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found.", false));

    if (user.favoriteQuotes.includes(quoteId))
      return res
        .status(400)
        .json(new ResponseModel(null, "Quote already in favorites.", false));

    user.favoriteQuotes.push(quoteId);

    await user.save();

    return res
      .status(200)
      .json(
        new ResponseModel(
          user.favoriteQuotes,
          "Quote added to favorites.",
          true
        )
      );
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

const removeFavoriteQuote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quoteId } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json(new ResponseModel(null, "User not found", false));

    user.favoriteQuotes = user.favoriteQuotes.filter(
      (id) => id.toString() !== quoteId
    );

    await user.save();

    return res
      .status(200)
      .json(
        new ResponseModel(
          user.favoriteQuotes,
          "Quote removed from favorites.",
          true
        )
      );
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updatePassword,
  getFavoriteQuotes,
  addFavoriteQuote,
  removeFavoriteQuote,
};
