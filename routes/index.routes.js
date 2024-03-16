const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).json("All good in here");
});

module.exports = router;
