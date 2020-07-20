// --------------  Register  ----------------------
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const DBQueries = require("../DB/DBReaduQueries");
const DButils = require("../DB/DButils");

router.post("/register", async (req, res, next) => {
  try {
    const users = await DBQueries.getAllUserNames();
    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    if (req.body.password != req.body.confirmPassword)
      throw { status: 409, message: "password confirmation is wrong" };
    // add the new username
    let hash_password = bcrypt.hashSync(req.body.password, 14);

    //check legal user input
    //insert new user into db
    await DBQueries.insertNewUser(req, hash_password);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

// --------------  Login  ----------------------
router.post("/login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
