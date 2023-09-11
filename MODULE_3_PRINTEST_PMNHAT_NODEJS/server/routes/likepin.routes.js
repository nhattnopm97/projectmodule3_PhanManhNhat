const express = require("express");
const router = express.Router();
const database = require("../utils/database");

router.get("/:id", async (req, res) => {
  //sử dụng database lấy vvềtoafn bộ user
  const { id } = req.params;
  database.query(
    `SELECT * FROM pinterest_clone.like_pin 
  WHERE pin_id = ?`,
    [id],
    (err, data) => {
      if (err) {
        console.log("Kết nối thất bại", err);
        res.status(500).json({
          status: "failed",
          err,
        });
      } else {
        console.log("data", data);
        res.status(200).json({
          status: "ok",
          likepin: data,
        });
      }
    }
  );
});

router.post("/:id", async (req, res) => {
  //sử dụng database lấy vvềtoafn bộ user
  const { id } = req.params;
  const { user_id } = req.body;
  database.query(
    `SELECT * FROM pinterest_clone.like_pin 
  WHERE pin_id = ?`,
    [id],
    (err, data) => {
      if (err) {
        console.log("Kết nối thất bại", err);
        res.status(500).json({
          status: "failed",
          err,
        });
      } else {
        console.log("data", data);
        if (
          data.find((like) => like.pin_id === id && like.user_id === user_id)
        ) {
          res.status(500).json({ status: "errror", message: "đã like rồi!" });
        } else {
          database.query(
            `INSERT INTO pinterest_clone.like_pin (user_id, pin_id) 
            VALUES (?, ?)
            `,
            [user_id, id],
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
                  message: "Thich thanh cong",
                });
              }
            }
          );
        }
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  database.query(
    `DELETE FROM pinterest_clone.like_pin WHERE pin_id= ? AND user_id = ?`,
    [id, user_id],
    (err, data) => {
      if (err) {
        console.log("Kết nối thất bại", err);
        res.status(500).json({
          status: "failed",
          err,
          message: "loi server",
        });
      } else {
        res.status(200).json({
          status: "ok",
          data,
          message: "Bo thich thanh cong",
        });
      }
    }
  );
});

module.exports = router;
