const Appointment =
  require("../models/Appointment");

const Billing =
  require("../models/Billing");



// DAILY REPORT
exports.dailyReport =
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

      // ======================
      // PATIENTS CHECKED
      // ======================

      const appointments =
        await Appointment.find({
          appointmentDate: {
            $gte: date,
            $lt: nextDate,
          },

          status: "completed",
        });

      // ======================
      // BILLING
      // ======================

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

        report: {
          totalPatients:
            appointments.length,

          totalIncome,

          totalBills:
            bills.length,
        },
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };