const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  searchDoctors,
  updateDoctor,
  deleteDoctor,
  getAvailableDoctors,
} = require("../controllers/doctorController");

// CREATE
router.post(
  "/",
  protect,
  authorizeRoles("admin", "manager"),
  createDoctor
);


// GET ALL
router.get(
  "/",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getDoctors
);


// AVAILABLE
router.get(
  "/available",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getAvailableDoctors
);


// SEARCH
router.get(
  "/search",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  searchDoctors
);


// GET SINGLE
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "manager", "receptionist"),
  getDoctorById
);


// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "manager"),
  updateDoctor
);


// DELETE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteDoctor
);

module.exports = router;