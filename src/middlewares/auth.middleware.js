const jwt = require("jsonwebtoken");
const ResponseModel = require("../models/base-models/ResponseModel");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid!" });
    }

    const token = authHeader?.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (err) {
    return res.status(500).json(new ResponseModel(null, err.message, false));
  }
};

module.exports = authMiddleware;
