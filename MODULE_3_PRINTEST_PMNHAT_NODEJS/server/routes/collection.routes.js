const express = require("express");
const router = express.Router();
const database = require("../utils/database");
const { isLogin } = require("../middleware/allValidate.middleware");

router.get("/", isLogin, (req, res) => {
  console.log("req.url", req.url);
  database.query("SELECT * FROM pinterest_clone.collection", (err, data) => {
    if (err) {
      console.log("Kết nối thất bại", err);
      res.status(500).json({
        status: "failed",
        err,
      });
    } else {
      res.status(200).json({
        status: "ok",
        collection: data,
      });
    }
  });
});

router.get("/name/:id", isLogin, (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  database.query(
    " SELECT distinct name FROM pinterest_clone.collection WHERE user_id = ?",
    [id],
    (error, data) => {
      if (error) {
        console.log("Kết nối thất bại", error);
        res.status(500).json({
          status: "failed",
          error,
        });
      } else {
        res.status(200).json({
          status: 200,
          collection: data,
        });
      }
    }
  );
});
router.get("/:id", isLogin, (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  database.query(
    ` SELECT c.name, p.link, c.pin_id FROM collection as c
    JOIN pin as p ON c.pin_id = p.id where c.user_id = ?;`,
    [id],
    (error, data) => {
      if (error) {
        console.log("Kết nối thất bại", error);
        res.status(500).json({
          status: "failed",
          error,
        });
      } else {
        res.status(200).json({
          status: 200,
          detailCollection: data,
        });
      }
    }
  );
});

router.post("/", isLogin, (req, res) => {
  const { name, user_id, pin_id } = req.body;
  console.log("req.body", req.body);
  database.query(
    `INSERT INTO pinterest_clone.collection (name, user_id, pin_id) 
    VALUES (?, ?, ?)`,
    [name, user_id, pin_id],
    (error, data) => {
      if (error) {
        console.log("Kết nối thất bại", error);
        res.status(500).json({
          status: "failed",
          error,
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Lưu mới thành công",
          data: data,
        });
      }
    }
  );
});

router.delete("/:id", isLogin, (req, res) => {
  const { id } = req.params;
  const { user_id, name } = req.body;
  console.log("id", id, "user_id", user_id, "name", name);
  database.query(
    `DELETE FROM pinterest_clone.collection
   WHERE name =? and user_id =? and pin_id =?`,
    [name, user_id, id],
    (error, data) => {
      if (error) {
        console.log("Kết nối thất bại", error);
        res.status(500).json({
          status: "failed",
          error,
        });
      } else {
        console.log("data", data);
        res.status(200).json({
          status: 200,
          message: "Đã bỏ lưu !",
        });
      }
    }
  );
});

module.exports = router;
