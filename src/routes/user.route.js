const { Router } = require("express");
const {
  updateUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updatePassword,
  getFavoriteQuotes,
  addFavoriteQuote,
  removeFavoriteQuote,
} = require("../controllers/user.controller");

const router = new Router();

router
  .route("/favorites")
  .get(getFavoriteQuotes)
  .post(addFavoriteQuote)
  .delete(removeFavoriteQuote);

router.route("/password").put(updatePassword);

router.route("/").put(updateUser).get(getUsers);
router.route("/:id").get(getUserById);
router.route("/email/:email").get(getUserByEmail);

module.exports = router;
