import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { setTodayAppointments } from "../../features/appointments/appointmentSlice";
import { setTodayBills } from "../../features/billing/billingSlice";
import { Users, Clock, DollarSign, CheckCircle, TrendingUp, Calendar, Activity } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPatients: 0, waitingTokens: 0, totalIncome: 0, completed: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load from localStorage
    const storedAppointments = localStorage.getItem('mock_appointments');
    const storedBills = localStorage.getItem('mock_bills');
    const today = new Date().toDateString();
    
    let todayApps = [];
    let todayBills = [];
    
    if (storedAppointments) {
      const allApps = JSON.parse(storedAppointments);
      todayApps = allApps.filter(a => new Date(a.date).toDateString() === today);
      setRecentAppointments(todayApps.slice(0, 5));
      dispatch(setTodayAppointments(todayApps));
      
      const waiting = todayApps.filter(a => a.status === "waiting").length;
      const completed = todayApps.filter(a => a.status === "completed").length;
      
      if (storedBills) {
        const allBills = JSON.parse(storedBills);
        todayBills = allBills.filter(b => new Date(b.date).toDateString() === today);
        dispatch(setTodayBills(todayBills));
        
        setStats({
          totalPatients: todayApps.length,
          waitingTokens: waiting,
          totalIncome: todayBills.reduce((sum, b) => sum + b.amount, 0),
          completed: completed,
        });
      } else {
        setStats({ totalPatients: todayApps.length, waitingTokens: waiting, totalIncome: 0, completed: completed });
      }
    }
  };

  const statsCards = [
    { title: "Today's Patients", value: stats.totalPatients, icon: Users, bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { title: "Waiting Tokens", value: stats.waitingTokens, icon: Clock, bgColor: "bg-yellow-50", textColor: "text-yellow-600" },
    { title: "Total Income", value: `Rs. ${stats.totalIncome.toLocaleString()}`, icon: DollarSign, bgColor: "bg-green-50", textColor: "text-green-600" },
    { title: "Completed", value: stats.completed, icon: CheckCircle, bgColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}><Icon className={`w-6 h-6 ${card.textColor}`} /></div>
                    <TrendingUp className="text-gray-300 w-5 h-5" />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold">Recent Appointments</h3></div><span className="text-xs text-gray-500">Today</span></div>
              <div className="space-y-3">
                {recentAppointments.length > 0 ? recentAppointments.map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-medium">{app.patientName}</p><p className="text-sm text-gray-500">Token: #{app.tokenNumber}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${app.status === "completed" ? "bg-green-100 text-green-700" : app.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{app.status}</span>
                  </div>
                )) : <p className="text-gray-500 text-center py-8">No appointments today</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6"><Activity className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold">Quick Actions</h3></div>
              <div className="space-y-3">
                <button onClick={() => navigate("/add-patient")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">Register New Patient</button>
                <button onClick={() => navigate("/appointments")} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">Create Appointment</button>
                <button onClick={() => navigate("/billing")} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">Generate Bill</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;