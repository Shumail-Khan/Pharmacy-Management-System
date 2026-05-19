import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getBills, createBill } from "../../api/billingApi";
import { getAppointments } from "../../api/appointmentApi";
import { setBills, addBill } from "../../features/billing/billingSlice";
import { DollarSign, Receipt, Printer, Calendar, Search } from "lucide-react";

const Billing = () => {
  const dispatch = useDispatch();
  const { bills } = useSelector((state) => state.billing);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billsData, appointmentsData] = await Promise.all([
        getBills(),
        getAppointments(),
      ]);
      dispatch(setBills(billsData));
      setAppointments(appointmentsData.filter(a => a.status === "completed" && !a.billed));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      amount: appointment.doctorFee || 500,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBill = await createBill({
        ...formData,
        appointmentId: selectedAppointment._id,
        date: new Date(),
      });
      dispatch(addBill(newBill));
      setShowModal(false);
      fetchData();
      alert("Bill generated successfully!");
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Error generating bill");
    }
  };

  const handlePrint = (bill) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .receipt { max-width: 400px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .content { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>Pharmacy PMS</h2>
              <p>Payment Receipt</p>
            </div>
            <div class="content">
              <div class="row">
                <strong>Receipt No:</strong>
                <span>#${bill.receiptNumber}</span>
              </div>
              <div class="row">
                <strong>Date:</strong>
                <span>${new Date(bill.date).toLocaleDateString()}</span>
              </div>
              <div class="row">
                <strong>Patient Name:</strong>
                <span>${bill.patientName}</span>
              </div>
              <div class="row">
                <strong>Doctor Name:</strong>
                <span>Dr. ${bill.doctorName}</span>
              </div>
              <div class="row total">
                <strong>Total Amount:</strong>
                <strong>Rs. ${bill.amount}</strong>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for visiting!</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  const getTotalIncome = () => {
    return bills.reduce((sum, bill) => sum + bill.amount, 0);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Income Today</p>
                  <p className="text-3xl font-bold mt-2">Rs. {getTotalIncome().toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Bills Generated</p>
                  <p className="text-3xl font-bold mt-2">{bills.length}</p>
                </div>
                <Receipt className="w-12 h-12 text-blue-200" />
              </div>
            </div>
          </div>

          {/* Pending Bills */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No pending bills</td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td className="px-4 py-3">{appointment.patientName}</td>
                        <td className="px-4 py-3">Dr. {appointment.doctorName}</td>
                        <td className="px-4 py-3">Rs. {appointment.doctorFee || 500}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleGenerateBill(appointment)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Generate Bill
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Receipt #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : bills.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No bills found</td>
                    </tr>
                  ) : (
                    bills.map((bill) => (
                      <tr key={bill._id}>
                        <td className="px-4 py-3 font-medium">#{bill.receiptNumber}</td>
                        <td className="px-4 py-3">{new Date(bill.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{bill.patientName}</td>
                        <td className="px-4 py-3">Dr. {bill.doctorName}</td>
                        <td className="px-4 py-3 font-medium">Rs. {bill.amount}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handlePrint(bill)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Bill Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Generate Bill</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <input
                  type="text"
                  value={selectedAppointment.patientName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <input
                  type="text"
                  value={`Dr. ${selectedAppointment.doctorName}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee *</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                  Generate Bill
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;