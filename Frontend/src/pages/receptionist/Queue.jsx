import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getTodayAppointments, updateAppointment } from "../../api/appointmentApi";
import { setTodayAppointments, updateAppointment as updateAppointmentAction } from "../../features/appointments/appointmentSlice";
import { Clock, User, Stethoscope, CheckCircle, SkipForward } from "lucide-react";

const Queue = () => {
  const dispatch = useDispatch();
  const { todayAppointments } = useSelector((state) => state.appointments);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await getTodayAppointments();
      dispatch(setTodayAppointments(data));
      const waitingAppointments = data.filter(a => a.status === "waiting");
      if (waitingAppointments.length > 0) {
        setCurrentToken(waitingAppointments[0]);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    const waitingAppointments = todayAppointments.filter(a => a.status === "waiting");
    if (waitingAppointments.length > 0) {
      const nextPatient = waitingAppointments[0];
      await updateAppointment(nextPatient._id, { status: "completed" });
      await fetchQueue();
      alert(`Calling token #${nextPatient.tokenNumber}`);
    } else {
      alert("No patients in queue");
    }
  };

  const waitingPatients = todayAppointments.filter(a => a.status === "waiting");
  const completedPatients = todayAppointments.filter(a => a.status === "completed");

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          {/* Current Token Display */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-center">
            <h3 className="text-white text-lg mb-2">Currently Serving</h3>
            <div className="text-8xl font-bold text-white mb-4">
              #{currentToken?.tokenNumber || "---"}
            </div>
            {currentToken && (
              <div className="text-white">
                <p className="text-xl">{currentToken.patientName}</p>
                <p className="text-blue-100">Dr. {currentToken.doctorName}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Waiting Queue */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Waiting Queue</h3>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  {waitingPatients.length} Patients
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {waitingPatients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No patients in queue</p>
                ) : (
                  waitingPatients.map((patient, index) => (
                    <div
                      key={patient._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">#{patient.tokenNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">Dr. {patient.doctorName}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {index === 0 && (
                          <span className="text-green-600 font-medium">Next</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Patients */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Completed Today</h3>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {completedPatients.length} Patients
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {completedPatients.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No completed patients</p>
                ) : (
                  completedPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">Token #{patient.tokenNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Call Next Button */}
          <div className="mt-8">
            <button
              onClick={handleCallNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition shadow-md flex items-center justify-center gap-3 text-lg font-semibold"
            >
              <SkipForward className="w-6 h-6" />
              Call Next Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;