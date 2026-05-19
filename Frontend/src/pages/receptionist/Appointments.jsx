import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getAppointments, createAppointment, updateAppointment, cancelAppointment } from "../../api/appointmentApi";
import { getDoctors } from "../../api/doctorApi";
import { getPatients } from "../../api/patientApi";
import { setAppointments } from "../../features/appointments/appointmentSlice";
import { Calendar as CalendarIcon, User, Stethoscope, Clock, X, Check } from "lucide-react";

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsData, doctorsData, patientsData] = await Promise.all([
        getAppointments(),
        getDoctors(),
        getPatients(),
      ]);
      dispatch(setAppointments(appointmentsData));
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenNumber = Math.floor(Math.random() * 900) + 100;
      const newAppointment = await createAppointment({ ...formData, tokenNumber, status: "waiting" });
      dispatch(setAppointments([newAppointment, ...appointments]));
      setShowModal(false);
      setFormData({ patientId: "", doctorId: "", date: "", time: "" });
      alert("Appointment created successfully!");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Error creating appointment");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      fetchData();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        fetchData();
      } catch (error) {
        console.error("Error cancelling appointment:", error);
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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              <CalendarIcon className="w-4 h-4" />
              New Appointment
            </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No appointments found</td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">#{appointment.tokenNumber}</div>
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
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {appointment.status === "waiting" && (
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, "completed")}
                                className="text-green-600 hover:text-green-800"
                                title="Mark Completed"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {appointment.status === "waiting" && (
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="text-red-600 hover:text-red-800"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">New Appointment</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.mobile}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor *</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Create Appointment
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

export default Appointments;