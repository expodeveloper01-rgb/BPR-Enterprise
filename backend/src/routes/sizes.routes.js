const router = require("express").Router();
const { getSizes } = require("../controllers/sizes.controller");

router.get("/", getSizes);

module.exports = router;
