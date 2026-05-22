const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
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

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    amount: {
      type: Number,
      required: true,
    },

    doctorShare: {
      type: Number,
      default: 0,
    },

    pharmacyShare: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
    },

    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Billing", billingSchema);