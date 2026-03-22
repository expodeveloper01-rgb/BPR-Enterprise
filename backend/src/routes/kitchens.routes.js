const router = require("express").Router();
const { getKitchens } = require("../controllers/kitchens.controller");

router.get("/", getKitchens);

module.exports = router;
