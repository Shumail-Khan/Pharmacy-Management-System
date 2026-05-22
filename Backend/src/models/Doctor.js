const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],

    schedules: [scheduleSchema],

    appointmentDuration: {
      type: Number,
      default: 15,
    },

    maxPatientsPerDay: {
      type: Number,
      default: 40,
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Auto-generate doctor ID
doctorSchema.pre("save", async function () {
  if (!this.doctorId) {
    const count = await mongoose.model("Doctor").countDocuments();

    this.doctorId = `DOC-${String(count + 1).padStart(4, "0")}`;
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);