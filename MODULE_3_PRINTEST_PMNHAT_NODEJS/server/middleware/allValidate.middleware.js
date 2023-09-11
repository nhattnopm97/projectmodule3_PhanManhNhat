const jwt = require("jsonwebtoken");

module.exports.isLogin = async (req, res, next) => {
  let authorization = req.headers.authorization.split(" ");
  try {
    if (authorization.includes("Bearer") && authorization.length > 1) {
      let token = authorization[1];
      let decoded = jwt.verify(token, process.env.SECRET);
      // console.log(decoded);
      const currentTime = Date.now() / 1000; // Chuyển đổi sang đơn vị giây
      // console.log("currentTime", currentTime);
      if (decoded.exp < currentTime) {
        // Token đã hết hạn
        console.log("Token đã hết hạn");
        res.json({ message: "Đã hết thời gian đăng nhập" });
      } else {
        // Token còn hợp lệ
        next();
      }
    }
  } catch (error) {
    res.json({ error });
  }
};
