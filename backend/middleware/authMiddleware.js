const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json("Access Denied");

  const decoded = jwt.verify(token, "secretkey");
  req.user = decoded;
  next();
};
