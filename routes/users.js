const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const verifyToken = require("../jwt/verifyToken");
const router = express.Router();
require("dotenv").config();

// Get request
router.get("/", (req, res) => {
  res.send("Welcome Home Amigos!!");
});

router.get("/allusers", (req, res) => {
  User.find({}, (err, data) => {
    if (err) throw new err();
    else {
      res.send(data);
    }
  });
});

// Protected Route (JWT Authentication required)
router.get("/posts", verifyToken, (req, res) => {
  res.send("congrats u are authenticated");
});

// Register Route
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  let errors = [];

  if (!username || !email || !password) {
    errors.push({ msg: "Please fill all fields", success: false });
  }

  if (password.length < 8) {
    errors.push({
      msg: "Password must be 8 or more character",
      success: false,
    });
  }

  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    errors.push({ msg: "Email is not valid", success: false });
  }

  if (errors.length > 0) {
    res.json(errors);
  } else {
    // Check if user already exists
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already in use" });
        res.json(errors);
      } else {
        // save to database with encrypted password

        const userData = new User({
          username,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(userData.password, salt, (err, hash) => {
            if (err) throw err;
            userData.password = hash;

            userData
              .save()
              .then(() => {
                errors.push({
                  msg: "User Registered Successfully",
                  success: true,
                });
                res.json(errors);
              })
              .catch(() => {
                errors.push({ msg: "Email is not valid" });
                res.json(errors);
              });
          });
        });
      }
    });
  }
});

// Check if user is logged in or not
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: "Please fill all fields", status: false });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password must be 8 or more character", status: false });
  }

  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    errors.push({ msg: "Email is not valid", status: false });
  }

  if (errors.length > 0) {
    res.json(errors);
  } else {
    User.findOne({ email })
      .then((user) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            req.session.user = user;
            jwt.sign(
              { user },
              process.env.jwtKey,
              { expiresIn: "1d" },
              (err, token) => {
                if (!err) {
                  res.json({
                    auth: true,
                    token,
                    theUser: req.session.user,
                  });
                } else {
                  res.json({
                    auth: false,
                  });
                }
              }
            );
          } else {
            errors.push({ msg: "Password incorrect", status: false });
            res.json(errors);
          }
        });
      })
      .catch(() => {
        errors.push({ msg: "User does not exists", status: false });
        res.json(errors);
      });
  }
});

module.exports = router;
