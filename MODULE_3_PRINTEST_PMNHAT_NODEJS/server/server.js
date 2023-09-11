const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRouter = require("./routes/user.routes");
const pinRouter = require("./routes/pin.routes");
const commentRouter = require("./routes/comment.routes");
const collectionRouter = require("./routes/collection.routes");
const likepinRouter = require("./routes/likepin.routes");
const subcriberRouter = require("./routes/subcriber.routes");
server.use(cookieParser());
server.use(express.static("./public"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan("dev"));
server.use(cors());

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: {  },
    // cookie: {
    //   maxAge: 3600000, // 1h
    //   signed: true,
    // },
  })
);
server.use("/api/v1/user", userRouter);
server.use("/api/v1/pin", pinRouter);
server.use("/api/v1/collection", collectionRouter);
server.use("/api/v1/comment", commentRouter);
server.use("/api/v1/likepin", likepinRouter);
server.use("/api/v1/subcriber", subcriberRouter);

server.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

server.listen(3579, () => {
  console.log("server listening at http://localhost:3579");
});
