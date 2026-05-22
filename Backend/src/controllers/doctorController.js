const Doctor = require("../models/Doctor");


// CREATE DOCTOR
exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      phone,
      fee,
      availableDays,
      schedules,
      appointmentDuration,
      maxPatientsPerDay,
    } = req.body;

    // Check duplicate phone
    const existingDoctor = await Doctor.findOne({ phone });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      phone,
      fee,
      availableDays,
      schedules,
      appointmentDuration,
      maxPatientsPerDay,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL DOCTORS
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET SINGLE DOCTOR
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// SEARCH DOCTORS
exports.searchDoctors = async (req, res) => {
  try {
    const { query } = req.query;

    const doctors = await Doctor.find({
      isActive: true,

      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },

        {
          specialization: {
            $regex: query,
            $options: "i",
          },
        },

        {
          doctorId: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    Object.assign(doctor, req.body);

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// SOFT DELETE
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isActive = false;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET AVAILABLE DOCTORS
exports.getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      isActive: true,
      status: "available",
    });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};