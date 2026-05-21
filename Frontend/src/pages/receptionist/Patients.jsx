import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getPatients, searchPatient, deletePatient } from "../../api/patientApi";
import { getDoctors } from "../../api/doctorApi";
import { setPatients, setSearchResults } from "../../features/patients/patientSlice";
import { Search, Trash2, UserPlus, Printer, Phone, User, Ticket, Stethoscope, DollarSign, X, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, searchResults } = useSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [tokenDetails, setTokenDetails] = useState({
    doctorName: "",
    doctorId: "",
    paymentAmount: "",
    tokenNumber: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      dispatch(setPatients(data));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await searchPatient(searchTerm);
        dispatch(setSearchResults(results));
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      dispatch(setSearchResults([]));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const generateTokenNumber = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const handleOpenTokenModal = (patient) => {
    setSelectedPatient(patient);
    setTokenDetails({
      doctorName: "",
      doctorId: "",
      paymentAmount: "",
      tokenNumber: generateTokenNumber(),
      appointmentDate: getTodayDate(),
      appointmentTime: getCurrentTime(),
    });
    setShowTokenModal(true);
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    if (selectedDoctor) {
      setTokenDetails({
        ...tokenDetails,
        doctorId: doctorId,
        doctorName: selectedDoctor.name,
      });
    }
  };

  const handlePrintToken = () => {
    if (!tokenDetails.doctorName) {
      alert("Please select a doctor");
      return;
    }
    if (!tokenDetails.paymentAmount || tokenDetails.paymentAmount <= 0) {
      alert("Please enter valid payment amount");
      return;
    }

    const selectedDoctor = doctors.find(d => d._id === tokenDetails.doctorId);
    const today = new Date();
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Token - ${selectedPatient.name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .token-card {
              max-width: 450px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              overflow: hidden;
              animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
              from {
                transform: translateY(-50px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .token-header {
              background: linear-gradient(135deg, #1e3a8a, #3b82f6);
              color: white;
              padding: 25px;
              text-align: center;
            }
            .token-header h1 {
              font-size: 28px;
              margin-bottom: 5px;
            }
            .token-header p {
              font-size: 12px;
              opacity: 0.9;
            }
            .token-body {
              padding: 30px;
            }
            .token-label {
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            .token-number {
              text-align: center;
              font-size: 72px;
              font-weight: bold;
              color: #d97706;
              margin: 15px 0;
              font-family: 'Courier New', monospace;
              letter-spacing: 5px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .divider {
              height: 2px;
              background: linear-gradient(to right, transparent, #e5e7eb, transparent);
              margin: 20px 0;
            }
            .info-section {
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              padding: 8px 0;
              border-bottom: 1px dashed #f3f4f6;
            }
            .info-label {
              font-weight: 600;
              color: #4b5563;
              font-size: 13px;
            }
            .info-value {
              color: #1f2937;
              font-size: 14px;
              font-weight: 500;
            }
            .doctor-info {
              background: #eff6ff;
              padding: 15px;
              border-radius: 10px;
              margin: 15px 0;
            }
            .doctor-info .info-row {
              border-bottom: none;
            }
            .payment-box {
              background: #f0fdf4;
              padding: 15px;
              border-radius: 10px;
              margin: 15px 0;
              text-align: center;
            }
            .payment-box .label {
              font-size: 12px;
              color: #166534;
            }
            .payment-box .amount {
              font-size: 28px;
              font-weight: bold;
              color: #166534;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
            .instruction {
              background: #fef3c7;
              padding: 10px;
              border-radius: 8px;
              margin-top: 15px;
              text-align: center;
            }
            .instruction p {
              font-size: 11px;
              color: #92400e;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .token-card {
                box-shadow: none;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="token-card">
            <div class="token-header">
              <h1>🏥 Pharmacy PMS</h1>
              <p>Appointment Token Slip</p>
            </div>
            <div class="token-body">
              <div class="token-label">YOUR TOKEN NUMBER</div>
              <div class="token-number">#${tokenDetails.tokenNumber}</div>
              
              <div class="divider"></div>
              
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Patient Name:</span>
                  <span class="info-value">${selectedPatient.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Mobile Number:</span>
                  <span class="info-value">${selectedPatient.mobile}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(tokenDetails.appointmentDate).toLocaleDateString('en-PK')}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${tokenDetails.appointmentTime}</span>
                </div>
              </div>

              <div class="doctor-info">
                <div class="info-row">
                  <span class="info-label">👨‍⚕️ Doctor Name:</span>
                  <span class="info-value">Dr. ${tokenDetails.doctorName}</span>
                </div>
                ${selectedDoctor ? `
                <div class="info-row" style="margin-top: 8px;">
                  <span class="info-label">📋 Specialization:</span>
                  <span class="info-value">${selectedDoctor.specialization}</span>
                </div>
                <div class="info-row" style="margin-top: 4px;">
                  <span class="info-label">💰 Consultation Fee:</span>
                  <span class="info-value">Rs. ${selectedDoctor.fee}</span>
                </div>
                ` : ''}
              </div>

              <div class="payment-box">
                <div class="label">💰 Payment Received</div>
                <div class="amount">Rs. ${parseInt(tokenDetails.paymentAmount).toLocaleString()}</div>
              </div>

              <div class="instruction">
                <p>⚠️ Please wait for your turn</p>
                <p>Keep this token for consultation</p>
              </div>
            </div>
            <div class="footer">
              <p>Generated on: ${today.toLocaleString()}</p>
              <p style="margin-top: 5px;">Thank you for choosing us!</p>
            </div>
          </div>
          <script>
            window.print();
            setTimeout(() => { window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    
    setShowTokenModal(false);
    alert(`✅ Token #${tokenDetails.tokenNumber} printed successfully!\n\n📋 Patient: ${selectedPatient.name}\n👨‍⚕️ Doctor: Dr. ${tokenDetails.doctorName}\n💰 Amount: Rs. ${parseInt(tokenDetails.paymentAmount).toLocaleString()}\n🎫 Token: #${tokenDetails.tokenNumber}`);
  };

  const displayedPatients = searchResults.length > 0 ? searchResults : patients;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Patient Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage patient records and generate tokens</p>
            </div>
            <button
              onClick={() => navigate("/add-patient")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              New Patient
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or mobile number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : displayedPatients.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    displayedPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{patient.name}</div>
                              <div className="text-xs text-gray-500">ID: {patient._id?.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{patient.mobile}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">
                            {new Date(patient.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenTokenModal(patient)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition text-sm"
                            >
                              <Ticket className="w-4 h-4" />
                              Generate Token
                            </button>
                            <button
                              onClick={() => handleDelete(patient._id)}
                              className="text-red-600 hover:text-red-800 transition p-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">New This Month</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Today's Patients</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Generation Modal */}
      {showTokenModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-white">Generate Token</h3>
                <p className="text-green-100 text-sm">Enter appointment details</p>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Patient Info Summary */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Patient Details</p>
                <p className="font-semibold text-gray-800 text-lg">{selectedPatient.name}</p>
                <p className="text-sm text-gray-600">{selectedPatient.mobile}</p>
              </div>

              {/* Token Number Display */}
              <div className="bg-orange-50 p-4 rounded-lg mb-6 text-center">
                <p className="text-sm text-orange-600">Token Number</p>
                <p className="text-4xl font-bold text-orange-600 font-mono">#{tokenDetails.tokenNumber}</p>
              </div>

              {/* Doctor Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope className="w-4 h-4 inline mr-1" />
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={tokenDetails.doctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization} (Fee: Rs.{doctor.fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={tokenDetails.appointmentDate}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, appointmentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Appointment Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={tokenDetails.appointmentTime}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, appointmentTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Payment Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Payment Amount (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={tokenDetails.paymentAmount}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, paymentAmount: e.target.value })}
                  placeholder="Enter consultation fee"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Token Summary */}
              {(tokenDetails.doctorName || tokenDetails.paymentAmount) && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="font-semibold text-gray-700 mb-2">📋 Token Summary:</p>
                  <div className="space-y-1 text-sm">
                    <p>👨‍⚕️ Doctor: Dr. {tokenDetails.doctorName || "Not selected"}</p>
                    <p>📅 Date: {tokenDetails.appointmentDate || "Not set"}</p>
                    <p>⏰ Time: {tokenDetails.appointmentTime || "Not set"}</p>
                    <p>💰 Amount: Rs. {parseInt(tokenDetails.paymentAmount).toLocaleString() || "0"}</p>
                    <p>🎫 Token: #{tokenDetails.tokenNumber}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrintToken}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Token & Give to Patient
                </button>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;