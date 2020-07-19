require("dotenv").config();
// --- Libraries importing

const express = require("express");
const bodyParser = require("body-parser");
const session = require("client-sessions");
const morgan = require("morgan");
//const path = require("path");
const DButils = require("./DB/DButils");
const cors = require("cors");

// --- Routes importing
const auth = require("./routes/auth");
const user = require("./routes/users");
const recipes = require("./routes/recipes");

// --- App settings and config
const app = express();
var port = process.env.PORT || "3001";
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(morgan(":method :url :status   :response-time ms")); //logger

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(
  session({
    cookieName: process.env.COOKIE_NAME, // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 20 * 60 * 1000, // expired after 20 sec
    activeDuration: 0, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie: {
      httpOnly: false
    }
  })
);

app.get("/alive", (req, res) => {
  res.send("I am alive");
});

//#region cookie middleware
app.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next());
  } else {
    next();
  }
});
//#endregion

//Routing
app.use("/users", user);
app.use(auth);
app.use("/recipes", recipes);

//Default router
app.use((req, res) => {
  res.sendStatus(404); //not found
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});
