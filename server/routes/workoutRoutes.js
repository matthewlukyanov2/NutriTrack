const express = require("express");
const router = express.Router();

// Temporary test route
router.get("/", (req, res) => {
  res.send("Workout route working!");
});

module.exports = router;
