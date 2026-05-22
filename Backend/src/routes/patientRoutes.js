const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createPatient,
  getPatients,
  searchPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");


// CREATE
router.post(
  "/",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  createPatient
);


// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getPatients
);


// SEARCH
router.get(
  "/search",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  searchPatients
);


// GET SINGLE
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getPatientById
);


// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  updatePatient
);


// DELETE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "manager"),
  deletePatient
);

module.exports = router;