const express = require("express");
const router = express.Router();
const database = require("../utils/database");

// lấy số người đang theo dõi id này!
router.get("/:id", (req, res) => {
  const { id } = req.params;
  database.query(
    `SELECT s.user_id, s.user_id_follower  FROM user as u
    JOIN subcriber as s ON s.user_id = u.id WHERE u.id= ?`,
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
          subcriber: data,
          message: "lay scb thanh cong!",
        });
      }
    }
  );
});

//lấy số người mà người này theo dõi.
router.get("/following/:id", (req, res) => {
  const { id } = req.params;
  database.query(
    ` SELECT * From pinterest_clone.subcriber WHERE user_id_follower = ?`,
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
          subcriber: data,
          message: "lay so nguoi theo doi thanh cong!",
        });
      }
    }
  );
});

router.post("/", (req, res) => {
  const { user_id, user_id_follower } = req.body;
  database.query(
    `INSERT INTO pinterest_clone.subcriber (user_id, user_id_follower) 
    VALUES (?,?);
    `,
    [user_id, user_id_follower],
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
          message: "lay scb thanh cong!",
        });
      }
    }
  );
});

router.delete("/", (req, res) => {
  const { user_id, user_id_follower } = req.body;
  database.query(
    `DELETE FROM pinterest_clone.subcriber 
    WHERE (user_id =? AND user_id_follower=?) `,
    [user_id, user_id_follower],
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
          message: "bo scb thanh cong!",
        });
      }
    }
  );
});

module.exports = router;
