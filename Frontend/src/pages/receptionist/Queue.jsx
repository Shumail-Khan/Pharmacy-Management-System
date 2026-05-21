import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { setTodayAppointments } from "../../features/appointments/appointmentSlice";
import { Clock, User, Stethoscope, CheckCircle, SkipForward, Users, Activity, Bell, Volume2 } from "lucide-react";

const Queue = () => {
  const dispatch = useDispatch();
  const { todayAppointments } = useSelector((state) => state.appointments);
  const [currentToken, setCurrentToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastCalled, setLastCalled] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Mock data for today's appointments
  const [mockAppointments, setMockAppointments] = useState([
    {
      _id: "q1",
      patientId: "p1",
      patientName: "John Doe",
      patientMobile: "0300-1234567",
      doctorId: "d1",
      doctorName: "Ahmed Khan",
      doctorSpecialization: "Cardiologist",
      tokenNumber: 101,
      status: "waiting",
      paymentAmount: 1000,
      time: "09:00 AM",
      arrivedAt: "09:15 AM",
    },
    {
      _id: "q2",
      patientId: "p2",
      patientName: "Jane Smith",
      patientMobile: "0300-7654321",
      doctorId: "d2",
      doctorName: "Fatima Ali",
      doctorSpecialization: "Dermatologist",
      tokenNumber: 102,
      status: "waiting",
      paymentAmount: 800,
      time: "09:30 AM",
      arrivedAt: "09:25 AM",
    },
    {
      _id: "q3",
      patientId: "p3",
      patientName: "Mike Johnson",
      patientMobile: "0300-9876543",
      doctorId: "d3",
      doctorName: "Usman Riaz",
      doctorSpecialization: "General Physician",
      tokenNumber: 103,
      status: "completed",
      paymentAmount: 600,
      time: "10:00 AM",
      arrivedAt: "09:50 AM",
      completedAt: "10:25 AM",
    },
    {
      _id: "q4",
      patientId: "p4",
      patientName: "Sarah Wilson",
      patientMobile: "0300-5555555",
      doctorId: "d1",
      doctorName: "Ahmed Khan",
      doctorSpecialization: "Cardiologist",
      tokenNumber: 104,
      status: "waiting",
      paymentAmount: 1000,
      time: "10:30 AM",
      arrivedAt: "10:20 AM",
    },
    {
      _id: "q5",
      patientId: "p5",
      patientName: "David Brown",
      patientMobile: "0300-4444444",
      doctorId: "d4",
      doctorName: "Ayesha Malik",
      doctorSpecialization: "Pediatrician",
      tokenNumber: 105,
      status: "waiting",
      paymentAmount: 700,
      time: "11:00 AM",
      arrivedAt: "10:55 AM",
    },
  ]);

  useEffect(() => {
    fetchQueue();
    
    // Auto refresh every 10 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchQueue();
      }, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchQueue = () => {
    // Simulate API call with mock data
    setTimeout(() => {
      dispatch(setTodayAppointments(mockAppointments));
      const waitingAppointments = mockAppointments.filter(a => a.status === "waiting");
      if (waitingAppointments.length > 0 && !currentToken) {
        setCurrentToken(waitingAppointments[0]);
      }
      setLoading(false);
    }, 500);
  };

  const playSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log("Sound not supported");
    }
  };

  const handleCallNext = () => {
    const waitingAppointments = mockAppointments.filter(a => a.status === "waiting");
    
    if (waitingAppointments.length > 0) {
      // Sort by token number
      waitingAppointments.sort((a, b) => a.tokenNumber - b.tokenNumber);
      const nextPatient = waitingAppointments[0];
      
      // Update the appointment status
      const updatedAppointments = mockAppointments.map(app => 
        app._id === nextPatient._id 
          ? { ...app, status: "completed", completedAt: new Date().toLocaleTimeString() }
          : app
      );
      
      setMockAppointments(updatedAppointments);
      dispatch(setTodayAppointments(updatedAppointments));
      
      // Update current token to next waiting patient
      const remainingWaiting = updatedAppointments.filter(a => a.status === "waiting");
      setCurrentToken(remainingWaiting.length > 0 ? remainingWaiting[0] : null);
      setLastCalled(nextPatient);
      
      // Show notification
      setShowNotification(true);
      playSound();
      
      // Hide notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
      
      // Announce with speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Token number ${nextPatient.tokenNumber}, ${nextPatient.patientName}, please proceed to Doctor ${nextPatient.doctorName}`);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
      
      alert(`🔔 Calling Next Patient!\n\nToken #${nextPatient.tokenNumber}\nPatient: ${nextPatient.patientName}\nDoctor: Dr. ${nextPatient.doctorName}\n\nPlease proceed to the consultation room.`);
    } else {
      alert("✅ No patients waiting in queue. All patients have been served!");
    }
  };

  const handleResetQueue = () => {
    if (window.confirm("Are you sure you want to reset the queue? This will mark all waiting patients as completed.")) {
      const updatedAppointments = mockAppointments.map(app => 
        app.status === "waiting" 
          ? { ...app, status: "completed", completedAt: new Date().toLocaleTimeString() }
          : app
      );
      setMockAppointments(updatedAppointments);
      dispatch(setTodayAppointments(updatedAppointments));
      setCurrentToken(null);
      setLastCalled(null);
      alert("Queue has been reset. All patients marked as completed.");
    }
  };

  const handleReopenPatient = (patientId) => {
    if (window.confirm("Reopen this patient? They will be added back to the waiting queue.")) {
      const updatedAppointments = mockAppointments.map(app => 
        app._id === patientId 
          ? { ...app, status: "waiting", completedAt: null }
          : app
      );
      setMockAppointments(updatedAppointments);
      dispatch(setTodayAppointments(updatedAppointments));
      
      // Update current token if needed
      const waitingAppointments = updatedAppointments.filter(a => a.status === "waiting");
      if (waitingAppointments.length > 0 && !currentToken) {
        setCurrentToken(waitingAppointments[0]);
      }
      
      alert("Patient has been reopened and added back to the queue.");
    }
  };

  const waitingPatients = mockAppointments.filter(a => a.status === "waiting").sort((a, b) => a.tokenNumber - b.tokenNumber);
  const completedPatients = mockAppointments.filter(a => a.status === "completed").sort((a, b) => a.tokenNumber - b.tokenNumber);
  
  const totalPatients = mockAppointments.length;
  const servedToday = completedPatients.length;
  const waitingCount = waitingPatients.length;
  const completionRate = totalPatients > 0 ? ((servedToday / totalPatients) * 100).toFixed(1) : 0;

  // Auto-refresh status indicator
  const getEstimatedWaitTime = () => {
    if (waitingCount === 0) return "No waiting";
    const avgConsultTime = 15; // minutes per patient
    const estimatedMinutes = waitingCount * avgConsultTime;
    if (estimatedMinutes < 60) return `~${estimatedMinutes} minutes`;
    return `~${Math.floor(estimatedMinutes / 60)} hour${Math.floor(estimatedMinutes / 60) > 1 ? 's' : ''}`;
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          {/* Header with controls */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Patient Queue Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage patient flow and waiting queue</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Activity className="w-4 h-4" />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={handleResetQueue}
                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition"
              >
                Reset Queue
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Total Today</p>
              <p className="text-2xl font-bold">{totalPatients}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Waiting</p>
              <p className="text-2xl font-bold">{waitingCount}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Served</p>
              <p className="text-2xl font-bold">{servedToday}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Completion Rate</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">Est. Wait Time</p>
              <p className="text-2xl font-bold text-sm">{getEstimatedWaitTime()}</p>
            </div>
          </div>

          {/* Current Token Display - Enhanced */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            
            <h3 className="text-white text-lg mb-2 flex items-center justify-center gap-2">
              <Bell className="w-5 h-5" />
              Currently Serving
            </h3>
            <div className="text-8xl font-bold text-white mb-4 font-mono">
              #{currentToken?.tokenNumber || "---"}
            </div>
            {currentToken ? (
              <div className="text-white">
                <p className="text-2xl font-semibold">{currentToken.patientName}</p>
                <p className="text-blue-100 text-lg">Dr. {currentToken.doctorName}</p>
                <p className="text-blue-200 text-sm mt-2">Token #{currentToken.tokenNumber} • {currentToken.doctorSpecialization}</p>
              </div>
            ) : (
              <div className="text-white">
                <p className="text-xl">No patients waiting</p>
                <p className="text-blue-100">All patients have been served</p>
              </div>
            )}
          </div>

          {/* Last Called Notification */}
          {showNotification && lastCalled && (
            <div className="fixed top-20 right-8 z-50 animate-bounce-in">
              <div className="bg-green-500 text-white rounded-lg shadow-xl p-4 max-w-sm">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Calling Patient</p>
                    <p className="text-sm">Token #{lastCalled.tokenNumber} - {lastCalled.patientName}</p>
                    <p className="text-xs opacity-90">Please proceed to Dr. {lastCalled.doctorName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Waiting Queue - Enhanced */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Waiting Queue</h3>
                </div>
                <div className="flex gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    {waitingCount} Patients
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Next: #{waitingPatients[0]?.tokenNumber || 'None'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {waitingPatients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No patients in queue</p>
                    <p className="text-sm text-gray-400">All patients have been served</p>
                  </div>
                ) : (
                  waitingPatients.map((patient, index) => (
                    <div
                      key={patient._id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        index === 0 
                          ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 shadow-md' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="font-bold text-xl">#{patient.tokenNumber}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">Dr. {patient.doctorName}</p>
                          <p className="text-xs text-gray-400">Arrived: {patient.arrivedAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {index === 0 && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                            NEXT
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Token #{patient.tokenNumber}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Patients - Enhanced */}
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
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {completedPatients.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No completed patients</p>
                    <p className="text-sm text-gray-400">Patients will appear here after consultation</p>
                  </div>
                ) : (
                  completedPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">Dr. {patient.doctorName}</p>
                          {patient.completedAt && (
                            <p className="text-xs text-gray-400">Completed: {patient.completedAt}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600">Token #{patient.tokenNumber}</p>
                          <p className="text-xs text-green-600">✓ Served</p>
                        </div>
                        <button
                          onClick={() => handleReopenPatient(patient._id)}
                          className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition"
                          title="Reopen patient"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Call Next Button - Enhanced */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCallNext}
              disabled={waitingCount === 0}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl transition shadow-md text-lg font-semibold ${
                waitingCount > 0
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <SkipForward className="w-6 h-6" />
              {waitingCount > 0 ? `Call Next Patient (${waitingCount} waiting)` : 'No Patients Waiting'}
            </button>
            
            <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800 font-medium">Queue Status</p>
                <p className="text-xs text-blue-600">
                  {waitingCount} patient{waitingCount !== 1 ? 's' : ''} waiting
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-800 font-medium">Next in Line</p>
                <p className="text-xs text-blue-600">
                  {waitingPatients[0] ? `Token #${waitingPatients[0].tokenNumber}` : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Queue Tips */}
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Queue Management Tips:</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Click "Call Next Patient" to announce the next patient in queue</li>
                  <li>• The system will play an audio announcement and show notification</li>
                  <li>• Completed patients move to the "Completed Today" section</li>
                  <li>• Estimated wait time is calculated based on queue length</li>
                  <li>• Auto-refresh updates the queue every 10 seconds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes bounceIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Queue;