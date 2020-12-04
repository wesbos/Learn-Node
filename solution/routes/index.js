const express = require("express");
const router = express.Router();

// Do work here
router.get("/", (req, res) => {
  console.log("Hey from /");
  res.render('hello', {dog: req.query.dog})
});

router.get("/reverse/:name", (req, res) => {
  res.send(req.params.name.split('').reverse().join(''));
});
module.exports = router;
