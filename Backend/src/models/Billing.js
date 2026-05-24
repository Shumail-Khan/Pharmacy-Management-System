const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
    },

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
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },

    notes: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isPrinted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// AUTO BILL NUMBER
billingSchema.pre("save", async function () {
  if (!this.billNumber) {
    const count =
      await mongoose.model("Billing")
        .countDocuments();

    this.billNumber =
      `BILL-${String(count + 1).padStart(5, "0")}`;
  }
});

module.exports =
  mongoose.model("Billing", billingSchema);