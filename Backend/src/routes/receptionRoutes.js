const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  registerPatientWithAppointment,
} = require("../controllers/receptionController");

router.post(
  "/register-with-appointment",
  protect,
  authorizeRoles(
    "admin",
    "manager",
    "receptionist"
  ),
  registerPatientWithAppointment
);

module.exports = router;