import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getTodayAppointments } from "../../api/appointmentApi";
import { getTodayBills } from "../../api/billingApi";
import { setTodayAppointments } from "../../features/appointments/appointmentSlice";
import { setTodayBills } from "../../features/billing/billingSlice";
import { 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { todayAppointments } = useSelector((state) => state.appointments);
  const { todayBills } = useSelector((state) => state.billing);
  const [stats, setStats] = useState({
    totalPatients: 0,
    waitingTokens: 0,
    totalIncome: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchTodayData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [todayAppointments, todayBills]);

  const fetchTodayData = async () => {
    try {
      const appointments = await getTodayAppointments();
      const bills = await getTodayBills();
      dispatch(setTodayAppointments(appointments));
      dispatch(setTodayBills(bills));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateStats = () => {
    const waiting = todayAppointments.filter(a => a.status === "waiting").length;
    const completed = todayAppointments.filter(a => a.status === "completed").length;
    const totalIncome = todayBills.reduce((sum, bill) => sum + bill.amount, 0);

    setStats({
      totalPatients: todayAppointments.length,
      waitingTokens: waiting,
      totalIncome: totalIncome,
      completed: completed,
    });
  };

  const statsCards = [
    {
      title: "Today's Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Waiting Tokens",
      value: stats.waitingTokens,
      icon: Clock,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Income",
      value: `Rs. ${stats.totalIncome.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const recentAppointments = todayAppointments.slice(0, 5);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.bgColor}`}>
                        <Icon className={`w-6 h-6 ${card.textColor}`} />
                      </div>
                      <TrendingUp className="text-gray-300 w-5 h-5" />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  </div>
                  <div className={`h-1 ${card.color}`}></div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Recent Appointments</h3>
                </div>
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="space-y-3">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">Token: #{appointment.tokenNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "completed" 
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "waiting"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No appointments today</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium">
                  Register New Patient
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-medium">
                  Create Appointment
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition font-medium">
                  Generate Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;