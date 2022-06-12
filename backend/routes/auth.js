const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET="shaurya";

// ROUTE 1----create user using post "/api/auth/createuser" doesnt require login

router.post(
  "/createuser",
  [
    //constraints for user
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password length small").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if errors return bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check wether user with this email exist

      let user = await User.findOne({ email: req.body.email }); //its a promise therefor wait for it to resolve
      if (user) {
        return res.status(400).json({ error: "email alredy exist" });
      }

      //create new user
      const salt = await bcrypt.genSalt(10); //await as it returns promise
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET); //JWT_SECRET

      // to get name password and email as response
      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      //   res.json({error:'please enter unique email',message: err.message})})
      //to get user as response

      // res.json(user);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//ROUTE 2----authenticate a user using post "/api/auth/createuser" doesnt require login
router.post(
  "/login",
  [
    //constraints for user
    // body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password cannot be empty").exists(),
  ],
  async (req, res) => {
    //if errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructuring to extract email and password from body
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "provide correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password); //old and entered pass comparison
      if (!passwordCompare) {
        return res.status(400).json({ error: "provide correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      //authtoken contains userid
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//ROUTE 3---- get logged in user details using post "/api/auth/createuser" login req
router.post(
  "/getuser",fetchuser,async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
