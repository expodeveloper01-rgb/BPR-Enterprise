const router = require("express").Router();
const { getCuisines } = require("../controllers/cuisines.controller");

router.get("/", getCuisines);

module.exports = router;
