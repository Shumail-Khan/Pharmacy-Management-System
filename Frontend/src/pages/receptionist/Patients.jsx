import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { setPatients, setSearchResults } from "../../features/patients/patientSlice";
import { Search, Trash2, UserPlus, Phone, User, Calendar, MapPin, IdCard, Activity, X, Clock, Stethoscope, Award, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, searchResults } = useSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [patientAppointments, setPatientAppointments] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const storedPatients = localStorage.getItem('mock_patients');
    if (storedPatients) {
      dispatch(setPatients(JSON.parse(storedPatients)));
    }
    setLoading(false);
  };

  const loadAppointmentsForPatient = (patientId) => {
    const storedAppointments = localStorage.getItem('mock_appointments');
    if (storedAppointments) {
      const allAppointments = JSON.parse(storedAppointments);
      const patientApps = allAppointments.filter(a => a.patientId === patientId);
      setPatientAppointments(patientApps);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobile.includes(searchTerm) ||
        (p.cnic && p.cnic.includes(searchTerm))
      );
      dispatch(setSearchResults(results));
    } else {
      dispatch(setSearchResults([]));
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this patient? This will also delete all their appointments.")) {
      const storedPatients = localStorage.getItem('mock_patients');
      const storedAppointments = localStorage.getItem('mock_appointments');
      
      if (storedPatients) {
        const allPatients = JSON.parse(storedPatients);
        const updatedPatients = allPatients.filter(p => p._id !== id);
        localStorage.setItem('mock_patients', JSON.stringify(updatedPatients));
        dispatch(setPatients(updatedPatients));
      }
      
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.filter(a => a.patientId !== id);
        localStorage.setItem('mock_appointments', JSON.stringify(updatedAppointments));
      }
      
      alert("Patient deleted successfully!");
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    loadAppointmentsForPatient(patient._id);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const displayedPatients = searchResults.length > 0 ? searchResults : patients;
  const totalPatients = patients.length;
  const newThisMonth = patients.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div><h2 className="text-2xl font-bold text-gray-800">Patient Records</h2><p className="text-sm text-gray-500">Click on any patient to view complete details</p></div>
            <button onClick={() => navigate("/add-patient")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"><UserPlus className="w-4 h-4" /> New Patient</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white"><p className="text-sm opacity-90">Total Patients</p><p className="text-2xl font-bold">{totalPatients}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"><p className="text-sm opacity-90">New This Month</p><p className="text-2xl font-bold">{newThisMonth}</p></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-3"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search by name, mobile number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div><button onClick={handleSearch} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Search</button></div>
          </div>

          {loading ? (<div className="flex justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>) : displayedPatients.length === 0 ? (<div className="text-center py-12 bg-white rounded-xl"><User className="w-16 h-16 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No patients found</p></div>) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedPatients.map((patient) => (
                <div key={patient._id} onClick={() => handleViewDetails(patient)} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
                      <button onClick={(e) => handleDelete(patient._id, e)} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{patient.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3"><Phone className="w-3 h-3" /><span>{patient.mobile}</span></div>
                    <div className="flex items-center justify-between pt-3 border-t"><div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="w-3 h-3" /><span>ID: {patient._id?.slice(-6)}</span></div><div className="flex items-center gap-1 text-blue-600 text-sm font-medium"><span>View Details</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 sticky top-0 flex justify-between items-center">
              <div className="flex items-center gap-3"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-white" /></div><div><h3 className="text-xl font-bold text-white">{selectedPatient.name}</h3><p className="text-blue-100 text-sm">Patient ID: {selectedPatient._id?.slice(-8)}</p></div></div>
              <button onClick={() => setShowDetailsModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center"><Phone className="w-4 h-4 text-blue-600 mx-auto mb-1" /><p className="text-xs text-gray-500">Mobile</p><p className="text-sm font-semibold">{selectedPatient.mobile}</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><Activity className="w-4 h-4 text-green-600 mx-auto mb-1" /><p className="text-xs text-gray-500">Age/Gender</p><p className="text-sm font-semibold">{selectedPatient.age} yrs / {selectedPatient.gender}</p></div>
                <div className="bg-purple-50 rounded-lg p-3 text-center"><Calendar className="w-4 h-4 text-purple-600 mx-auto mb-1" /><p className="text-xs text-gray-500">Registered</p><p className="text-sm font-semibold">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p></div>
                <div className="bg-orange-50 rounded-lg p-3 text-center"><FileText className="w-4 h-4 text-orange-600 mx-auto mb-1" /><p className="text-xs text-gray-500">Total Visits</p><p className="text-sm font-semibold">{patientAppointments.length}</p></div>
              </div>

              <div className="mb-8"><h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-blue-600 rounded"></div>Personal Information</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl"><div className="flex items-start gap-3"><IdCard className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-xs text-gray-500">CNIC</p><p className="font-medium">{selectedPatient.cnic || "Not provided"}</p></div></div><div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gray-400 mt-1" /><div><p className="text-xs text-gray-500">Address</p><p className="font-medium">{selectedPatient.address || "Not provided"}</p></div></div></div></div>

              <div><h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-blue-600 rounded"></div>Appointment History</h4>
                {patientAppointments.length === 0 ? (<div className="text-center py-12 bg-gray-50 rounded-xl"><Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No appointment history</p></div>) : (
                  <div className="space-y-3">{patientAppointments.map((app) => (<div key={app._id} className="bg-gray-50 p-4 rounded-xl"><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-lg">#{app.tokenNumber}</span></div><div><p className="font-semibold">Dr. {app.doctorName}</p><p className="text-sm text-gray-500">{app.doctorSpecialization}</p></div></div><span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>{app.status}</span></div><div className="grid grid-cols-4 gap-4 text-sm ml-14"><div><p className="text-gray-500 text-xs">Date</p><p className="font-medium">{new Date(app.date).toLocaleDateString()}</p></div><div><p className="text-gray-500 text-xs">Time</p><p className="font-medium">{app.time}</p></div><div><p className="text-gray-500 text-xs">Fee</p><p className="font-medium text-green-600">Rs. {app.doctorFee}</p></div><div><p className="text-gray-500 text-xs">Paid</p><p className="font-medium text-green-600">Rs. {app.paymentAmount || app.doctorFee}</p></div></div></div>))}</div>)}
              </div>

              {patientAppointments.length > 0 && (<div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl"><h5 className="font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-blue-600" /> Summary</h5><div className="grid grid-cols-4 gap-4 text-center"><div><p className="text-2xl font-bold">{patientAppointments.length}</p><p className="text-xs text-gray-500">Visits</p></div><div><p className="text-2xl font-bold text-green-600">{patientAppointments.filter(a => a.status === "completed").length}</p><p className="text-xs text-gray-500">Completed</p></div><div><p className="text-2xl font-bold text-yellow-600">{patientAppointments.filter(a => a.status === "waiting").length}</p><p className="text-xs text-gray-500">Pending</p></div><div><p className="text-2xl font-bold text-green-600">Rs. {patientAppointments.reduce((sum, a) => sum + (a.paymentAmount || a.doctorFee), 0)}</p><p className="text-xs text-gray-500">Total Paid</p></div></div></div>)}

              <button onClick={() => setShowDetailsModal(false)} className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;