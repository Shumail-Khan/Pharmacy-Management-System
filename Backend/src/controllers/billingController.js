const Billing = require("../models/Billing");
const Appointment = require("../models/Appointment");


// GENERATE BILL
exports.generateBill = async (req, res) => {
  try {
    const {
      appointmentId,
      consultationFee,
      discount,
      paymentMethod,
      notes,
    } = req.body;

    // ======================
    // CHECK APPOINTMENT
    // ======================

    const appointment =
      await Appointment.findById(
        appointmentId
      )
        .populate("patientId")
        .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ======================
    // PREVENT DUPLICATE BILL
    // ======================

    const existingBill =
      await Billing.findOne({
        appointmentId,
      });

    if (existingBill) {
      return res.status(400).json({
        success: false,
        message:
          "Bill already generated",
      });
    }

    // ======================
    // TOTAL CALCULATION
    // ======================

    const totalAmount =
      consultationFee - (discount || 0);

    // ======================
    // CREATE BILL
    // ======================

    const bill = await Billing.create({
      patientId:
        appointment.patientId._id,

      doctorId:
        appointment.doctorId._id,

      appointmentId,

      tokenNumber:
        appointment.tokenNumber,

      consultationFee,

      discount,

      totalAmount,

      paymentMethod,

      notes,

      paymentStatus: "paid",

      createdBy: req.user._id,
    });

    // ======================
    // UPDATE APPOINTMENT
    // ======================

    appointment.billingStatus = "paid";

    await appointment.save();

    // ======================
    // RETURN POPULATED BILL
    // ======================

    const populatedBill =
      await Billing.findById(bill._id)
        .populate(
          "patientId",
          "name mobile"
        )
        .populate(
          "doctorId",
          "name specialization"
        );

    res.status(201).json({
      success: true,

      message:
        "Bill generated successfully",

      bill: populatedBill,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL BILLS
exports.getBills = async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate(
        "patientId",
        "name mobile"
      )
      .populate(
        "doctorId",
        "name specialization"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      bills,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// SINGLE BILL
exports.getBillById = async (req, res) => {
  try {
    const bill =
      await Billing.findById(
        req.params.id
      )
        .populate("patientId")
        .populate("doctorId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      bill,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// DAILY BILLING SUMMARY
exports.getDailyBillingSummary =
  async (req, res) => {
    try {

      const date =
        req.query.date
          ? new Date(req.query.date)
          : new Date();

      date.setHours(0, 0, 0, 0);

      const nextDate =
        new Date(date);

      nextDate.setDate(
        nextDate.getDate() + 1
      );

      const bills =
        await Billing.find({
          createdAt: {
            $gte: date,
            $lt: nextDate,
          },
        });

      const totalIncome =
        bills.reduce(
          (sum, bill) =>
            sum + bill.totalAmount,
          0
        );

      res.status(200).json({
        success: true,

        totalBills: bills.length,

        totalIncome,

        bills,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



// DOCTOR EARNINGS
exports.getDoctorEarnings =
  async (req, res) => {
    try {

      const { doctorId } =
        req.params;

      const bills =
        await Billing.find({
          doctorId,
          paymentStatus: "paid",
        });

      const totalEarnings =
        bills.reduce(
          (sum, bill) =>
            sum + bill.totalAmount,
          0
        );

      res.status(200).json({
        success: true,

        totalPatients:
          bills.length,

        totalEarnings,

        bills,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };