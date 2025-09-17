const express = require("express");
const protectedRoutes = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protectedRoutes, (req, res) => {
  res.json({ status: true, user: req.user });
});

module.exports = router