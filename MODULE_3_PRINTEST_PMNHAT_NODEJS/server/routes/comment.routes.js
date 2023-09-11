const express = require("express");
const router = express.Router();
const database = require("../utils/database");
const { isLogin } = require("../middleware/allValidate.middleware");

router.get("/:id", (req, res) => {
  const { id } = req.params;
  database.query(
    `SELECT u.name, u.avartar, c.comment, c.timecomment  FROM user as u
    JOIN comment as c ON c.user_id = u.id WHERE c.pin_id= ? `,
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
          comment: data,
        });
      }
    }
  );
});

router.post("/", (req, res) => {
  let { user_id, pin_id, comment, timecomment } = req.body;
  database.query(
    `INSERT INTO pinterest_clone.comment (user_id, pin_id, comment, timecomment) 
    VALUES (?, ? , ? , ?)`,
    [user_id, pin_id, comment, timecomment],
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
          comment: data,
          message: "Bình luận thành công.",
        });
      }
    }
  );
});

module.exports = router;
