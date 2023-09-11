const express = require("express");
const router = express();
const database = require("../utils/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { isLogin } = require("../middleware/allValidate.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("7", file);
    cb(null, `${__dirname}/../public`);
  },
  filename: function (req, file, cb) {
    console.log("10", req.file);
    let ext =
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const multiple = multer({ storage: storage }).array("avatar", 5);
const upload = multer({ storage: storage }).single("avatar");

router.post("/avatar", isLogin, async (req, res) => {
  await upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("a");
      res.json({ err });
      // Một lỗi của Multer xảy ra khi upload.
    } else if (err) {
      console.log("b", err);
    }
    // Mọi thứ khác chạy ok.
    res.json({
      status: 200,
      message: "Upload thành công",
      data: req.file.path,
    });
  });
});

router.get("/", isLogin, (req, res) => {
  res.json({ message: "hello worldaaaaaaaaaaaaa" });
});

// Đăng ký
router.post("/register", async (req, res) => {
  let { name, email, password, role, createDate, birthday } = req.body;
  // console.log(
  //   " name, email, password, role, createDate, birthday",
  //   name,
  //   email,
  //   password,
  //   role,
  //   createDate,
  //   birthday
  // );

  try {
    let isEmail = await database.query(
      "SELECT * FROM pinterest_clone.user WHERE email = ?",
      [email]
    );
    if (isEmail.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Email đã tồn tại!" });
    }
    const hash = await bcrypt.hash(password, 10);

    const query = `INSERT INTO pinterest_clone.user (name, password, email, createDate, role, birthday) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, hash, email, createDate, role, birthday];

    await database.query(query, values);

    res.json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Lấy dữ liệu từ database
  const query = "SELECT * FROM pinterest_clone.user WHERE email = ?";
  database.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: err,
      });
    } else {
      // Kiểm tra kết quả
      if (result.length == 0) {
        return res.status(400).json({
          status: 400,
          message: "Email hoặc mật khẩu không đúng",
        });
      } else {
        // Nếu như có tồn tại email
        const user = result[0];
        // So sánh mật khẩu từ client với server
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status: 500,
              message: err,
            });
          } else {
            if (!isMatch) {
              return res.status(400).json({
                status: 400,
                message: "Email hoặc mật khẩu không đúng",
              });
            } else {
              // req.session.userId = user.id;
              let token = jwt.sign(
                { email: user.email, id: user.id },
                process.env.SECRET,
                {
                  expiresIn: "1d",
                }
              );
              console.log(user.id);
              return res.status(200).json({
                status: 200,
                message: "Đăng nhập thành công",
                data: user,
                token: token,
              });
            }
          }
        });
      }
    }
  });
});

router.get("/:id", isLogin, async (req, res) => {
  const { id } = req.params;
  let query = "SELECT * FROM pinterest_clone.user WHERE id = ?";
  database.query(query, [id], (err, data) => {
    if (err) {
      console.log("err", err);
      res.status(500).json({ status: 500, err });
    } else {
      let user = data[0];
      res.status(200).json({ status: 200, success: true, user });
    }
  });
});

//edit user
router.put("/:id", isLogin, (req, res) => {
  const { id } = req.params;
  let { name, avartar, url, description } = req.body;
  database.query(
    "UPDATE `pinterest_clone`.`user` SET `name` = ?, `avartar` = ?, `url` = ?, `description` = ? WHERE (`id` = ?)",
    [name, avartar, url, description, id],
    (err, data) => {
      if (err) {
        console.log("Kết nối thất bại", err);
        res.status(500).json({
          status: "failed",
          err,
        });
      } else {
        res.status(200).json({
          status: "ok",
          message: data,
        });
      }
    }
  );
});

module.exports = router;
