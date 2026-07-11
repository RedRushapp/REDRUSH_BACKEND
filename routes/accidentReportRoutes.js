const express = require("express");
const { createAccidentReport } = require("../controllers/accidentReportController");

const router = express.Router();

// Public route: passersby report accidents without logging in.
router.post("/", createAccidentReport);

module.exports = router;
