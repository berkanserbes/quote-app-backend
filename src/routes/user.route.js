const { Router } = require("express");
const {
  updateUser,
  updatePassword,
  getFavoriteQuotes,
  addFavoriteQuote,
  removeFavoriteQuote,
} = require("../controllers/user.controller");

const router = new Router();

router.route("/").put(updateUser);
router.route("/password").put(updatePassword);
router
  .route("/favorites")
  .get(getFavoriteQuotes)
  .post(addFavoriteQuote)
  .delete(removeFavoriteQuote);

module.exports = router;
