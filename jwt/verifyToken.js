const jwt = require("jsonwebtoken");

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  // Get auth header
  if (!token) {
    res.send("Send a token to get access");
  } else {
    jwt.verify(token, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.json({ auth: false, msg: "U failed to authenticate" });
      } else {
        res.userId = authData.id;
        next();
      }
    });
  }
};

module.exports = verifyToken;
