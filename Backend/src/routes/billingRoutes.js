const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const authorizeRoles =
  require("../middleware/roleMiddleware");

const {
  generateBill,
  getBills,
  getBillById,
  getDailyBillingSummary,
  getDoctorEarnings,
} = require(
  "../controllers/billingController"
);


// GENERATE BILL
router.post(
  "/",
  protect,
  authorizeRoles(
    "admin",
    "manager",
    "receptionist"
  ),
  generateBill
);


// GET ALL BILLS
router.get(
  "/",
  protect,
  authorizeRoles(
    "admin",
    "manager",
    "receptionist"
  ),
  getBills
);


// DAILY SUMMARY
router.get(
  "/summary/daily",
  protect,
  authorizeRoles(
    "admin",
    "manager"
  ),
  getDailyBillingSummary
);


// DOCTOR EARNINGS
router.get(
  "/doctor/:doctorId",
  protect,
  authorizeRoles(
    "admin",
    "manager"
  ),
  getDoctorEarnings
);


// SINGLE BILL
router.get(
  "/:id",
  protect,
  authorizeRoles(
    "admin",
    "manager",
    "receptionist"
  ),
  getBillById
);

module.exports = router;