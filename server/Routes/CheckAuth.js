const express = require("express");
const protectedRoutes = require("../middleware/auth.middleware");

const router = express.Router();

// router.get("/", protectedRoutes, (req, res) => {
//   res.json({ status: true, user: req.user });
// });

router.get("/", (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ status: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    return res.json({ status: true, user: decoded });
  } catch (err) {
    return res.json({ status: false, message: "Invalid token" });
  }
});

module.exports = router;
