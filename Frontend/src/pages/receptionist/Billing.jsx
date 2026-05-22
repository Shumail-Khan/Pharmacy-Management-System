import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { setBills, addBill } from "../../features/billing/billingSlice";
import { DollarSign, Receipt, Printer, Stethoscope, Users, TrendingUp, Filter, X, Calendar, Phone, User, Clock } from "lucide-react";

const Billing = () => {
  const dispatch = useDispatch();
  const { bills } = useSelector((state) => state.billing);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [doctorStats, setDoctorStats] = useState([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [formData, setFormData] = useState({ patientId: "", doctorId: "", amount: "" });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateDoctorStats();
  }, [bills]);

  const loadData = () => {
    const storedAppointments = localStorage.getItem('mock_appointments');
    const storedDoctors = localStorage.getItem('mock_doctors');
    const storedBills = localStorage.getItem('mock_bills');
    
    if (storedAppointments) {
      const allApps = JSON.parse(storedAppointments);
      setAppointments(allApps.filter(a => a.status === "completed" && !a.billed));
    }
    if (storedDoctors) setDoctors(JSON.parse(storedDoctors));
    
    if (storedBills) {
      const billsData = JSON.parse(storedBills);
      dispatch(setBills(billsData));
    } else {
      dispatch(setBills([]));
    }
    
    setLoading(false);
  };

  const calculateDoctorStats = () => {
    const stats = {};
    
    bills.forEach(bill => {
      const doctorName = bill.doctorName;
      if (!stats[doctorName]) {
        stats[doctorName] = { 
          doctorName, 
          doctorId: bill.doctorId, 
          patientCount: 0, 
          totalEarnings: 0, 
          patients: [],
          totalBills: 0
        };
      }
      stats[doctorName].patientCount++;
      stats[doctorName].totalEarnings += bill.amount;
      stats[doctorName].totalBills++;
      stats[doctorName].patients.push({ 
        patientName: bill.patientName, 
        amount: bill.amount, 
        date: bill.date,
        receiptNumber: bill.receiptNumber,
        patientId: bill.patientId
      });
    });
    
    setDoctorStats(Object.values(stats));
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctorDetails(doctor);
    setShowDoctorModal(true);
  };

  const handleGenerateBill = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({ 
      patientId: appointment.patientId, 
      doctorId: appointment.doctorId, 
      amount: appointment.doctorFee || 500 
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const receiptNumber = `RCP-${String(bills.length + 1).padStart(3, '0')}`;
    const newBill = {
      _id: `b${Date.now()}`,
      patientId: selectedAppointment.patientId,
      patientName: selectedAppointment.patientName,
      doctorId: selectedAppointment.doctorId,
      doctorName: selectedAppointment.doctorName,
      amount: parseInt(formData.amount),
      receiptNumber: receiptNumber,
      date: new Date().toISOString(),
    };
    
    const storedBills = localStorage.getItem('mock_bills');
    let allBills = storedBills ? JSON.parse(storedBills) : [];
    allBills.unshift(newBill);
    localStorage.setItem('mock_bills', JSON.stringify(allBills));
    dispatch(addBill(newBill));
    
    // Mark appointment as billed
    const storedAppointments = localStorage.getItem('mock_appointments');
    if (storedAppointments) {
      const allAppointments = JSON.parse(storedAppointments);
      const updatedAppointments = allAppointments.map(a => 
        a._id === selectedAppointment._id ? { ...a, billed: true } : a
      );
      localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
    }
    
    setShowModal(false);
    loadData();
    alert(`✅ Bill generated successfully!\nReceipt #${receiptNumber}\nAmount: Rs. ${formData.amount}`);
  };

  const handlePrint = (bill) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f0f0f0; }
            .receipt { max-width: 400px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0; opacity: 0.9; }
            .content { padding: 20px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px dashed #eee; }
            .total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            .footer { background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header"><h2>🏥 Pharmacy PMS</h2><p>Payment Receipt</p></div>
            <div class="content">
              <div class="row"><strong>Receipt No:</strong><span>#${bill.receiptNumber}</span></div>
              <div class="row"><strong>Date:</strong><span>${new Date(bill.date).toLocaleDateString()}</span></div>
              <div class="row"><strong>Patient Name:</strong><span>${bill.patientName}</span></div>
              <div class="row"><strong>Doctor Name:</strong><span>Dr. ${bill.doctorName}</span></div>
              <div class="row total"><strong>Total Amount:</strong><strong>Rs. ${bill.amount.toLocaleString()}</strong></div>
            </div>
            <div class="footer"><p>Thank you for visiting!</p><p>Generated on: ${new Date().toLocaleString()}</p></div>
          </div>
          <script>window.print();setTimeout(()=>window.close(),500);</script>
        </body>
      </html>
    `);
  };

  const getTotalIncome = () => bills.reduce((sum, bill) => sum + bill.amount, 0);
  
  const getFilteredBills = () => {
    let filtered = bills;
    if (selectedDoctor !== "all") filtered = filtered.filter(bill => bill.doctorId === selectedDoctor);
    if (dateFilter === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter(bill => new Date(bill.date).toDateString() === today);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(bill => new Date(bill.date) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(bill => new Date(bill.date) >= monthAgo);
    }
    return filtered;
  };

  const filteredBills = getFilteredBills();
  const totalEarnings = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Billing & Reports</h2>
            <p className="text-sm text-gray-500">Manage payments and view doctor earnings</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-green-100 text-sm">Total Income</p><p className="text-3xl font-bold">Rs. {getTotalIncome().toLocaleString()}</p></div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-100 text-sm">Total Bills</p><p className="text-3xl font-bold">{bills.length}</p></div>
                <Receipt className="w-12 h-12 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-100 text-sm">Active Doctors</p><p className="text-3xl font-bold">{doctors.length}</p></div>
                <Stethoscope className="w-12 h-12 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Doctor Performance Section - Clickable Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Doctor Performance Report
              </h3>
              <div className="flex gap-2">
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)} 
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorStats.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl">
                  <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No doctor records found. Generate bills to see doctor performance.</p>
                </div>
              ) : (
                doctorStats.map((doctor, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleDoctorClick(doctor)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border-l-4 border-blue-500 cursor-pointer group"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">Dr. {doctor.doctorName}</h4>
                          <p className="text-xs text-gray-500">Click to view details</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">Rs. {doctor.totalEarnings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Earnings</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-gray-700">{doctor.patientCount}</p>
                        <p className="text-xs text-gray-500">Patients Treated</p>
                      </div>
                      <div className="text-center">
                        <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-gray-700">Rs. {(doctor.totalEarnings / doctor.patientCount || 0).toFixed(0)}</p>
                        <p className="text-xs text-gray-500">Avg per Patient</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition">
                      Click to see patient list →
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Bills */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Pending Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-8 text-gray-500">No pending bills</td></tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app._id} className="border-b">
                        <td className="px-4 py-3">{app.patientName}</td>
                        <td className="px-4 py-3">Dr. {app.doctorName}</td>
                        <td className="px-4 py-3">Rs. {app.doctorFee}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleGenerateBill(app)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition">
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Bill History</h3>
              <select 
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)} 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Doctors</option>
                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
              </select>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Filtered Results:</span>
                <span className="text-sm font-semibold text-gray-800">{filteredBills.length} bills</span>
                <span className="text-sm text-gray-600">| Total: Rs. {totalEarnings.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => { setSelectedDoctor("all"); setDateFilter("today"); }} 
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Reset Filters
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                  ) : filteredBills.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8">No bills found</td></tr>
                  ) : (
                    filteredBills.map((bill) => (
                      <tr key={bill._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{bill.receiptNumber}</td>
                        <td className="px-4 py-3">{new Date(bill.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{bill.patientName}</td>
                        <td className="px-4 py-3">Dr. {bill.doctorName}</td>
                        <td className="px-4 py-3 font-medium text-green-600">Rs. {bill.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handlePrint(bill)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            <Printer className="w-4 h-4" /> Print
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

      {/* Doctor Details Modal */}
      {showDoctorModal && selectedDoctorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 sticky top-0 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Dr. {selectedDoctorDetails.doctorName}</h3>
                  <p className="text-blue-100 text-sm">Doctor Performance Report</p>
                </div>
              </div>
              <button onClick={() => setShowDoctorModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Total Earnings</p>
                  <p className="text-2xl font-bold">Rs. {selectedDoctorDetails.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Patients Treated</p>
                  <p className="text-2xl font-bold">{selectedDoctorDetails.patientCount}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <p className="text-sm opacity-90">Average per Patient</p>
                  <p className="text-2xl font-bold">Rs. {(selectedDoctorDetails.totalEarnings / selectedDoctorDetails.patientCount || 0).toFixed(0)}</p>
                </div>
              </div>

              {/* Patient List */}
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Patients Treated by Dr. {selectedDoctorDetails.doctorName}
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedDoctorDetails.patients.map((patient, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{patient.patientName}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">Rs. {patient.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600">#{patient.receiptNumber}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(patient.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 font-bold text-gray-800">Total</td>
                      <td className="px-4 py-3 font-bold text-green-600">Rs. {selectedDoctorDetails.totalEarnings.toLocaleString()}</td>
                      <td colSpan="2" className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary Message for Doctor */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Today's Summary for Dr. {selectedDoctorDetails.doctorName}</p>
                    <p className="text-sm text-green-700 mt-1">
                      You have treated <strong>{selectedDoctorDetails.patientCount}</strong> patients today 
                      and earned a total of <strong>Rs. {selectedDoctorDetails.totalEarnings.toLocaleString()}</strong>.
                      Average payment per patient is <strong>Rs. {(selectedDoctorDetails.totalEarnings / selectedDoctorDetails.patientCount || 0).toFixed(0)}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDoctorModal(false)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition font-medium">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <input type="text" value={selectedAppointment.patientName} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <input type="text" value={`Dr. ${selectedAppointment.doctorName}`} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee *</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">Generate Bill</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;