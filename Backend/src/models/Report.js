const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },

    totalPatients: {
      type: Number,
      default: 0,
    },

    totalIncome: {
      type: Number,
      default: 0,
    },

    doctorSummary: [
      {
        doctorName: String,
        patientsHandled: Number,
        incomeGenerated: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);