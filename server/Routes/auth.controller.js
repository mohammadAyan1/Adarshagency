const express = require("express");
const SalesManModel = require("../Models/SalesManModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/salesman", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    console.log(username);
    console.log(password);

    if (!username || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const findSalesman = await SalesManModel.findOne({ username });

    console.log(findSalesman);

    if (!findSalesman) {
      return res.status(400).json({ message: "Wrong Credential" });
    }

    const checkPassword = findSalesman.password == password;
    console.log(checkPassword);

    if (!checkPassword) {
      return res.status(400).json({ message: "Wrong Credential" });
    }

    const token = jwt.sign({ id: findSalesman._id }, process.env.JWT, {
      expiresIn: "1D",
    });

    const isProd = process.env.NODE_ENV === "production";

    
    

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // false on localhost, true on Render
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      status: true,
      data: findSalesman,
      message: "Sales man Register successfull",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
