const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const authorizeRoles =
  require("../middleware/roleMiddleware");

const {
  dailyReport,
} = require(
  "../controllers/reportController"
);


router.get(
  "/daily",
  protect,
  authorizeRoles(
    "admin",
    "manager",
    "receptionist"
  ),
  dailyReport
);

module.exports = router;