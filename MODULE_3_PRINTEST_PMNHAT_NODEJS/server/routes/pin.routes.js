const express = require("express");
const router = express.Router();
const database = require("../utils/database");
const { isLogin } = require("../middleware/allValidate.middleware");
const multer = require("multer");

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

const upload = multer({ storage: storage }).single("aNewPin");

router.post("/newimage", async (req, res) => {
  await upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("a");
      res.json({ err });
      // Một lỗi của Multer xảy ra khi upload.
    } else if (err) {
      console.log("b", err);
    }
    // Mọi thứ khác chạy ok.
    console.log(req.file);
    res.json({
      status: 200,
      message: "Upload thành công",
      data: req.file.path,
    });
  });
});

router.post("/newPin", isLogin, (req, res) => {
  const { link, title, description, tag, timeupload, user_id } = req.body;
  console.log(req.body);
  database.query(
    `INSERT INTO pinterest_clone.pin 
  (link, title, description, tag, timeupload, user_id) 
  VALUES (?, ?, ?, ?, ?, ?)
  `,
    [link, title, description, tag, timeupload, user_id],
    (error, data) => {
      if (error) {
        console.log("Kết nối thất bại", error);
        res.status(500).json({
          status: "failed",
          error,
        });
      } else {
        res.status(200).json({
          status: "ok",
          data,
          message: "Create a new pin successfully!",
        });
      }
    }
  );
});

router.get("/", async (req, res) => {
  database.query("SELECT * FROM pinterest_clone.pin", (err, data) => {
    if (err) {
      console.log("Kết nối thất bại", err);
      res.status(500).json({
        status: "failed",
        err,
      });
    } else {
      res.status(200).json({
        status: "ok",
        pin: data,
      });
    }
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  database.query(
    "SELECT * FROM pinterest_clone.pin WHERE id = ?",
    [id],
    (err, data) => {
      if (err) {
        console.log("Kết nối thất bại", err);
        res.status(500).json({
          status: "failed",
          err,
        });
      } else {
        let tagArr = data[0].tag.split(",");
        let stringQueryTag = "SELECT * FROM pinterest_clone.pin WHERE ";
        for (let index = 0; index < tagArr.length; index++) {
          if (index === tagArr.length - 1) {
            stringQueryTag += ` tag like '%${tagArr[index]}%'`;
          } else {
            stringQueryTag += `tag like '%${tagArr[index]}%' or `;
          }
        }
        database.query(stringQueryTag, (error, lastResult) => {
          if (error) {
            console.log("Kết nối thất bại", error);
            res.status(500).json({
              status: "failed",
              error,
            });
          } else {
            res.status(200).json({
              status: "ok",
              pin: data,
              relate: lastResult,
            });
          }
        });
      }
    }
  );
});

router.get("/user/:id", isLogin, async (req, res) => {
  const { id } = req.params;
  database.query(
    "SELECT * FROM pinterest_clone.pin WHERE user_id = ?",
    [id],
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
          pin: data,
        });
      }
    }
  );
});

router.get("/userCreatePin/:id", (req, res) => {
  const { id } = req.params;
  database.query(
    `SELECT u.avartar, u.id, u.name FROM user as u
    JOIN pin as p ON p.user_id = u.id where p.id = ?`,
    [id],
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
          user: data,
          message: "lay thanh cong!",
        });
      }
    }
  );
});

router.delete("/:id", isLogin, (req, res) => {
  const { id } = req.params;
  database.query(
    `DELETE FROM pinterest_clone.pin WHERE (id = ?)`,
    [id],
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
          data,
          message: "xóa thành công!",
        });
      }
    }
  );
});

module.exports = router;
