const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "waiting",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: {
      type: Date,
    },
    billingStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({
  doctorId: 1,
  appointmentDate: 1,
  tokenNumber: 1,
});

module.exports = mongoose.model("Appointment", appointmentSchema);