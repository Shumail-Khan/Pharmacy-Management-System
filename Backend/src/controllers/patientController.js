const Patient = require("../models/Patient");


// CREATE PATIENT
exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      cnic,
      mobile,
      age,
      gender,
      address,
      medicalHistory,
    } = req.body;

    // Check existing CNIC
    const existingPatient = await Patient.findOne({
      $or: [{ cnic }, { mobile }],
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient already exists",
      });
    }

    const patient = await Patient.create({
      name,
      cnic,
      mobile,
      age,
      gender,
      address,
      medicalHistory,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL PATIENTS
exports.getPatients = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const patients = await Patient.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// SEARCH PATIENT
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;

    const patients = await Patient.find({
      isActive: true,
      $or: [
        { cnic: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET SINGLE PATIENT
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE PATIENT
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    Object.assign(patient, req.body);

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// SOFT DELETE PATIENT
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isActive = false;

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};