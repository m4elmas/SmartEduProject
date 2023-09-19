const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

//pageRoutes
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

//Controls Require
const pageController = require("./controllers/pageController");

//Connect DB
mongoose.connect("mongodb://127.0.0.1/smartedu-db").then(() => {
  console.log("DB Connected Successfully..");
});

//Template Engine
app.set("view engine", "ejs");

//Global Variable
global.userIN = null;

//MiddleWares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/smartedu-db" }),
  })
);
app.use("*", (req, res, next) => {
  userIN = req.session.userId;
  next();
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessage = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//ROUTES
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/category", categoryRoute);
app.use("/users", userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`server ${port} portunda başlatıldı...`);
});
