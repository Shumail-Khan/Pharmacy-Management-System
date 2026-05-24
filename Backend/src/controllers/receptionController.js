const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.registerPatientWithAppointment = async (req, res) => {
  try {
    const {
      patient,
      appointment,
    } = req.body;

    // =========================
    // VALIDATE DOCTOR
    // =========================

    const doctor = await Doctor.findById(
      appointment.doctorId
    );

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Doctor unavailable",
      });
    }

    // =========================
    // FIND EXISTING PATIENT
    // =========================

    let existingPatient = await Patient.findOne({
      $or: [
        { cnic: patient.cnic },
        { mobile: patient.mobile },
      ],
    });

    let savedPatient;

    // =========================
    // CREATE PATIENT IF NOT EXISTS
    // =========================

    if (!existingPatient) {
      savedPatient = await Patient.create({
        ...patient,
        createdBy: req.user._id,
      });
    } else {
      savedPatient = existingPatient;
    }

    // =========================
    // NORMALIZE DATE
    // =========================

    const normalizedDate = new Date(
      appointment.date
    );

    normalizedDate.setHours(0, 0, 0, 0);

    // =========================
    // CHECK SLOT CONFLICT
    // =========================

    const existingAppointment =
      await Appointment.findOne({
        doctorId: appointment.doctorId,

        appointmentDate: normalizedDate,

        appointmentTime: appointment.time,

        status: {
          $ne: "cancelled",
        },
      });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // =========================
    // DAILY LIMIT CHECK
    // =========================

    const totalAppointments =
      await Appointment.countDocuments({
        doctorId: appointment.doctorId,

        appointmentDate: normalizedDate,

        status: {
          $ne: "cancelled",
        },
      });

    if (
      totalAppointments >=
      doctor.maxPatientsPerDay
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor daily patient limit reached",
      });
    }

    // =========================
    // TOKEN GENERATION
    // =========================

    const lastToken =
      await Appointment.findOne({
        doctorId: appointment.doctorId,

        appointmentDate: normalizedDate,
      }).sort({
        tokenNumber: -1,
      });

    const tokenNumber = lastToken
      ? lastToken.tokenNumber + 1
      : 1;

    // =========================
    // CREATE APPOINTMENT
    // =========================

    const createdAppointment =
      await Appointment.create({
        patientId: savedPatient._id,

        doctorId: appointment.doctorId,

        appointmentDate: normalizedDate,

        appointmentTime: appointment.time,

        consultationFee:
          appointment.paymentAmount,

        tokenNumber,

        status: "waiting",

        createdBy: req.user._id,
      });

    // =========================
    // POPULATE RESPONSE
    // =========================

    const populatedAppointment =
      await Appointment.findById(
        createdAppointment._id
      )
        .populate(
          "patientId",
          "name mobile cnic"
        )
        .populate(
          "doctorId",
          "name specialization fee"
        );

    res.status(201).json({
      success: true,

      message:
        "Patient registered and appointment created",

      data: {
        tokenNumber,

        patient: savedPatient,

        appointment: populatedAppointment,

        doctor,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};