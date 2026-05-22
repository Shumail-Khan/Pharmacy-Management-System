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
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ patientId: "", patientName: "", patientMobile: "", doctorId: "", doctorName: "", doctorSpecialization: "", doctorFee: "", date: "", time: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedPatients = localStorage.getItem('mock_patients');
    const storedDoctors = localStorage.getItem('mock_doctors');
    const storedAppointments = localStorage.getItem('mock_appointments');
    
    if (storedPatients) setPatients(JSON.parse(storedPatients));
    if (storedDoctors) setDoctors(JSON.parse(storedDoctors));
    if (storedAppointments) {
      const apps = JSON.parse(storedAppointments);
      dispatch(setAppointments(apps));
    }
    setLoading(false);
  };

  const generateTokenNumber = () => {
    const storedAppointments = localStorage.getItem('mock_appointments');
    let existingTokens = storedAppointments ? JSON.parse(storedAppointments).map(a => a.tokenNumber) : [];
    let newToken;
    do { newToken = Math.floor(Math.random() * 900) + 100; } while (existingTokens.includes(newToken));
    return newToken;
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p._id === patientId);
    if (patient) setFormData({ ...formData, patientId: patient._id, patientName: patient.name, patientMobile: patient.mobile });
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId);
    if (doctor) setFormData({ ...formData, doctorId: doctor._id, doctorName: doctor.name, doctorSpecialization: doctor.specialization, doctorFee: doctor.fee });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) { alert("Please fill all fields"); return; }

    const tokenNumber = generateTokenNumber();
    const newAppointment = {
      _id: `a${Date.now()}`,
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
      billed: false,
    };

    const storedAppointments = localStorage.getItem('mock_appointments');
    let allAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
    allAppointments.unshift(newAppointment);
    localStorage.setItem('mock_appointments', JSON.stringify(allAppointments));
    dispatch(setAppointments(allAppointments));
    
    setShowModal(false);
    setFormData({ patientId: "", patientName: "", patientMobile: "", doctorId: "", doctorName: "", doctorSpecialization: "", doctorFee: "", date: "", time: "" });
    alert(`✅ Appointment created! Token #${tokenNumber}`);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const storedAppointments = localStorage.getItem('mock_appointments');
    if (storedAppointments) {
      const allAppointments = JSON.parse(storedAppointments);
      const updatedAppointments = allAppointments.map(app => app._id === id ? { ...app, status: newStatus } : app);
      localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
      dispatch(setAppointments(updatedAppointments));
      alert(`✅ Appointment marked as ${newStatus}`);
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("Cancel this appointment?")) {
      const storedAppointments = localStorage.getItem('mock_appointments');
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map(app => app._id === id ? { ...app, status: "cancelled" } : app);
        localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
        dispatch(setAppointments(updatedAppointments));
        alert("❌ Appointment cancelled");
      }
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

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = searchTerm === "" || app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || app.tokenNumber.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAppointments = appointments.length;
  const waitingCount = appointments.filter(a => a.status === "waiting").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;
  const cancelledCount = appointments.filter(a => a.status === "cancelled").length;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2><p className="text-sm text-gray-500">Manage patient appointments</p></div><button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"><Plus className="w-4 h-4" /> New Appointment</button></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white"><p className="text-sm">Total</p><p className="text-2xl font-bold">{totalAppointments}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white"><p className="text-sm">Waiting</p><p className="text-2xl font-bold">{waitingCount}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white"><p className="text-sm">Completed</p><p className="text-2xl font-bold">{completedCount}</p></div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white"><p className="text-sm">Cancelled</p><p className="text-2xl font-bold">{cancelledCount}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white"><p className="text-sm">Today</p><p className="text-2xl font-bold">{appointments.filter(a => a.date === today).length}</p></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6"><div className="flex gap-3"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div><div className="relative"><Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-2 border rounded-lg"><option value="all">All</option><option value="waiting">Waiting</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div></div></div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs">Token</th><th className="px-6 py-3 text-left text-xs">Patient</th><th className="px-6 py-3 text-left text-xs">Doctor</th><th className="px-6 py-3 text-left text-xs">Date & Time</th><th className="px-6 py-3 text-left text-xs">Fee</th><th className="px-6 py-3 text-left text-xs">Status</th><th className="px-6 py-3 text-left text-xs">Actions</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan="7" className="text-center py-8"><div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div></td></tr> : filteredAppointments.length === 0 ? <tr><td colSpan="7" className="text-center py-8">No appointments</td></tr> : filteredAppointments.map(app => (<tr key={app._id} className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-lg">#{app.tokenNumber}</td><td><div className="font-medium">{app.patientName}</div><div className="text-sm text-gray-500">{app.patientMobile}</div></td><td><div className="font-medium">Dr. {app.doctorName}</div><div className="text-sm text-gray-500">{app.doctorSpecialization}</div></td><td><div>{new Date(app.date).toLocaleDateString()}</div><div className="text-sm">{app.time}</div></td><td className="text-green-600 font-medium">Rs. {app.doctorFee}</td><td><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>{app.status}</span></td><td><div className="flex gap-2">{app.status === "waiting" && (<><button onClick={() => handleStatusUpdate(app._id, "completed")} className="bg-green-100 hover:bg-green-200 text-green-700 p-1.5 rounded-lg"><Check className="w-4 h-4" /></button><button onClick={() => handleCancel(app._id)} className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-lg"><X className="w-4 h-4" /></button></>)}</div></td></tr>))}</tbody></table></div></div>
        </div>
      </div>

      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between"><div><h3 className="text-xl font-bold text-white">New Appointment</h3><p className="text-blue-100 text-sm">Schedule appointment</p></div><button onClick={() => setShowModal(false)} className="text-white"><X className="w-6 h-6" /></button></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-2"><User className="w-4 h-4 inline mr-1" /> Patient *</label><select required value={formData.patientId} onChange={(e) => handlePatientSelect(e.target.value)} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Patient</option>{patients.map(p => (<option key={p._id} value={p._id}>{p.name} - {p.mobile}</option>))}</select><button type="button" onClick={() => navigate("/add-patient")} className="text-xs text-blue-600 mt-1">+ Add new patient</button></div><div><label className="block text-sm font-medium mb-2"><Stethoscope className="w-4 h-4 inline mr-1" /> Doctor *</label><select required value={formData.doctorId} onChange={(e) => handleDoctorSelect(e.target.value)} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Doctor</option>{doctors.map(d => (<option key={d._id} value={d._id}>Dr. {d.name} - {d.specialization} (Rs.{d.fee})</option>))}</select></div><div><label className="block text-sm font-medium mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> Date *</label><input type="date" required value={formData.date} min={today} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-2"><Clock className="w-4 h-4 inline mr-1" /> Time *</label><input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div><div className="flex gap-3 pt-4"><button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Create</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg">Cancel</button></div></form></div></div>)}
    </div>
  );
};

export default Appointments;