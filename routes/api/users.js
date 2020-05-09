const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
  //destructuring data from url on the req.body
  const { name, email, password } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);
  try {
    // Form validationconst { errors, isValid } = validateRegisterInput(req.body);// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          //save the new user
          newUser.save().then((userSave) => res.json(userSave));
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//login user
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", async (req, res) => {
  //destructuring from req.body / from the url

  const { email, password } = req.body;

  const { errors, isValid } = validateLoginInput(req.body);

  // Form validationconst { errors, isValid } = validateLoginInput(req.body);// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        }; // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600, // 1 hour
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
