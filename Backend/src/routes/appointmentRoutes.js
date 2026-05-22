const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createAppointment,
  getAppointments,
  getTodaysQueue,
  callNextPatient,
  completeAppointment,
  cancelAppointment,
  rescheduleAppointment,
} = require("../controllers/appointmentController");


// CREATE APPOINTMENT
router.post(
  "/",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  createAppointment
);


// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getAppointments
);


// TODAY QUEUE
router.get(
  "/today",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getTodaysQueue
);


// CALL NEXT PATIENT
router.put(
  "/:id/call",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  callNextPatient
);


// COMPLETE APPOINTMENT
router.put(
  "/:id/complete",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  completeAppointment
);


// CANCEL APPOINTMENT
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  cancelAppointment
);


// RESCHEDULE
router.put(
  "/:id/reschedule",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  rescheduleAppointment
);

module.exports = router;