const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", dashboardController.stats);

module.exports = router;
