import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { setAppointments } from "../../features/appointments/appointmentSlice";
import { Calendar as CalendarIcon, User, Stethoscope, Clock, X, Check, Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments } = useSelector((state) => state.appointments);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    patientMobile: "",
    doctorId: "",
    doctorName: "",
    doctorSpecialization: "",
    doctorFee: "",
    date: "",
    time: "",
  });

  // Mock Data
  const [mockPatients] = useState([
    { _id: "p1", name: "John Doe", mobile: "0300-1234567" },
    { _id: "p2", name: "Jane Smith", mobile: "0300-7654321" },
    { _id: "p3", name: "Mike Johnson", mobile: "0300-9876543" },
    { _id: "p4", name: "Sarah Wilson", mobile: "0300-5555555" },
    { _id: "p5", name: "David Brown", mobile: "0300-4444444" },
  ]);

  const [mockDoctors] = useState([
    { _id: "d1", name: "Ahmed Khan", specialization: "Cardiologist", fee: 1000 },
    { _id: "d2", name: "Fatima Ali", specialization: "Dermatologist", fee: 800 },
    { _id: "d3", name: "Usman Riaz", specialization: "General Physician", fee: 600 },
    { _id: "d4", name: "Ayesha Malik", specialization: "Pediatrician", fee: 700 },
    { _id: "d5", name: "Omar Hassan", specialization: "Neurologist", fee: 1200 },
  ]);

  const [mockAppointments, setMockAppointments] = useState([
    {
      _id: "a1",
      patientId: "p1",
      patientName: "John Doe",
      patientMobile: "0300-1234567",
      doctorId: "d1",
      doctorName: "Ahmed Khan",
      doctorSpecialization: "Cardiologist",
      doctorFee: 1000,
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      tokenNumber: 101,
      status: "waiting",
      paymentAmount: 1000,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "a2",
      patientId: "p2",
      patientName: "Jane Smith",
      patientMobile: "0300-7654321",
      doctorId: "d2",
      doctorName: "Fatima Ali",
      doctorSpecialization: "Dermatologist",
      doctorFee: 800,
      date: new Date().toISOString().split('T')[0],
      time: "11:00",
      tokenNumber: 102,
      status: "completed",
      paymentAmount: 800,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "a3",
      patientId: "p3",
      patientName: "Mike Johnson",
      patientMobile: "0300-9876543",
      doctorId: "d3",
      doctorName: "Usman Riaz",
      doctorSpecialization: "General Physician",
      doctorFee: 600,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: "14:00",
      tokenNumber: 103,
      status: "waiting",
      paymentAmount: 600,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "a4",
      patientId: "p4",
      patientName: "Sarah Wilson",
      patientMobile: "0300-5555555",
      doctorId: "d4",
      doctorName: "Ayesha Malik",
      doctorSpecialization: "Pediatrician",
      doctorFee: 700,
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: "09:30",
      tokenNumber: 104,
      status: "waiting",
      paymentAmount: 700,
      createdAt: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    // Load mock data
    dispatch(setAppointments(mockAppointments));
    setLoading(false);
  }, []);

  const generateTokenNumber = () => {
    const existingTokens = mockAppointments.map(a => a.tokenNumber);
    let newToken;
    do {
      newToken = Math.floor(Math.random() * 900) + 100;
    } while (existingTokens.includes(newToken));
    return newToken;
  };

  const handlePatientSelect = (patientId) => {
    const patient = mockPatients.find(p => p._id === patientId);
    if (patient) {
      setFormData({
        ...formData,
        patientId: patient._id,
        patientName: patient.name,
        patientMobile: patient.mobile,
      });
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = mockDoctors.find(d => d._id === doctorId);
    if (doctor) {
      setFormData({
        ...formData,
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization,
        doctorFee: doctor.fee,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      alert("Please fill all required fields");
      return;
    }

    const tokenNumber = generateTokenNumber();
    const newAppointment = {
      _id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientMobile: formData.patientMobile,
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      doctorSpecialization: formData.doctorSpecialization,
      doctorFee: formData.doctorFee,
      date: formData.date,
      time: formData.time,
      tokenNumber: tokenNumber,
      status: "waiting",
      paymentAmount: formData.doctorFee,
      createdAt: new Date().toISOString(),
    };

    const updatedAppointments = [newAppointment, ...mockAppointments];
    setMockAppointments(updatedAppointments);
    dispatch(setAppointments(updatedAppointments));
    
    setShowModal(false);
    setFormData({
      patientId: "",
      patientName: "",
      patientMobile: "",
      doctorId: "",
      doctorName: "",
      doctorSpecialization: "",
      doctorFee: "",
      date: "",
      time: "",
    });
    
    alert(`✅ Appointment created successfully!\n\nToken #${tokenNumber}\nPatient: ${newAppointment.patientName}\nDoctor: Dr. ${newAppointment.doctorName}\nDate: ${newAppointment.date}\nTime: ${newAppointment.time}`);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedAppointments = mockAppointments.map(app => 
      app._id === id ? { ...app, status: newStatus } : app
    );
    setMockAppointments(updatedAppointments);
    dispatch(setAppointments(updatedAppointments));
    alert(`✅ Appointment marked as ${newStatus}`);
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updatedAppointments = mockAppointments.map(app => 
        app._id === id ? { ...app, status: "cancelled" } : app
      );
      setMockAppointments(updatedAppointments);
      dispatch(setAppointments(updatedAppointments));
      alert("❌ Appointment cancelled successfully");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting": return "⏳ Waiting";
      case "completed": return "✅ Completed";
      case "cancelled": return "❌ Cancelled";
      default: return status;
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = searchTerm === "" || 
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tokenNumber.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalAppointments = appointments.length;
  const waitingCount = appointments.filter(a => a.status === "waiting").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const cancelledCount = appointments.filter(a => a.status === "cancelled").length;
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage patient appointments and queue</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Waiting</p>
              <p className="text-2xl font-bold">{waitingCount}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Cancelled</p>
              <p className="text-2xl font-bold">{cancelledCount}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Today</p>
              <p className="text-2xl font-bold">{todayCount}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name, doctor name, or token number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="waiting">Waiting</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-lg">#{appointment.tokenNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientMobile}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">Dr. {appointment.doctorName}</div>
                          <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{new Date(appointment.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-green-600">Rs. {appointment.doctorFee}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusBadge(appointment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {appointment.status === "waiting" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, "completed")}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 p-1.5 rounded-lg transition"
                                  title="Mark Completed"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCancel(appointment._id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-lg transition"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {appointment.status === "completed" && (
                              <span className="text-xs text-green-600">✓ Completed</span>
                            )}
                            {appointment.status === "cancelled" && (
                              <span className="text-xs text-red-600">✗ Cancelled</span>
                            )}
                          </div>
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

      {/* Modal for New Appointment */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-white">New Appointment</h3>
                <p className="text-blue-100 text-sm">Schedule a patient appointment</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Select Patient <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a patient</option>
                  {mockPatients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.mobile}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => navigate("/add-patient")}
                  className="text-xs text-blue-600 mt-1 hover:underline"
                >
                  + Add new patient
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope className="w-4 h-4 inline mr-1" />
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a doctor</option>
                  {mockDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization} (Rs.{doctor.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  min={today}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.doctorName && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Appointment Summary:</p>
                  <p className="text-sm text-gray-600">👨‍⚕️ Doctor: Dr. {formData.doctorName}</p>
                  <p className="text-sm text-gray-600">💰 Fee: Rs. {formData.doctorFee}</p>
                  <p className="text-sm text-gray-600">🎫 Token will be generated automatically</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
                >
                  Create Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition font-medium"
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

export default Appointments;