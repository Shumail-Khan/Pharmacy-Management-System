const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");


// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationFee,
      remarks,
    } = req.body;

    // Validate patient
    const patient = await Patient.findById(patientId);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Validate doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Prevent double booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: {
        $ne: "cancelled",
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Doctor already booked for this slot",
      });
    }

    // Auto token generation
    const lastToken = await Appointment.findOne({
      doctorId,
      appointmentDate,
    }).sort({ tokenNumber: -1 });

    const tokenNumber = lastToken
      ? lastToken.tokenNumber + 1
      : 1;

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      tokenNumber,
      consultationFee,
      remarks,
      status: "waiting",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL APPOINTMENTS
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name cnic mobile")
      .populate("doctorId", "name specialization")
      .sort({
        appointmentDate: -1,
        tokenNumber: 1,
      });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET TODAY'S QUEUE
exports.getTodaysQueue = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const queue = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },

      status: {
        $in: ["waiting", "in-progress"],
      },
    })
      .populate("patientId", "name mobile")
      .populate("doctorId", "name")
      .sort({
        tokenNumber: 1,
      });

    res.status(200).json({
      success: true,
      count: queue.length,
      queue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// CALL NEXT PATIENT
exports.callNextPatient = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "in-progress";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Patient called successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// COMPLETE APPOINTMENT
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "completed";

    appointment.completedAt = new Date();

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment completed",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// CANCEL APPOINTMENT
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";

    appointment.cancelledAt = new Date();

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// RESCHEDULE APPOINTMENT
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Prevent conflicts
    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },

      doctorId: appointment.doctorId,

      appointmentDate,

      appointmentTime,

      status: {
        $ne: "cancelled",
      },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked",
      });
    }

    appointment.appointmentDate = appointmentDate;

    appointment.appointmentTime = appointmentTime;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};