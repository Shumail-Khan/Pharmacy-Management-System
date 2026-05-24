import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  Receipt,
  UserPlus,
  Stethoscope
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/doctors", name: "Doctors", icon: Stethoscope },
    { path: "/add-patient", name: "Add Patient", icon: UserPlus },
    { path: "/patients", name: "Patients", icon: Users },
    { path: "/appointments", name: "Appointments", icon: Calendar },
    { path: "/queue", name: "Queue", icon: Clock },
    { path: "/billing", name: "Billing", icon: Receipt },
    
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white fixed left-0 top-0 shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-8 h-8 text-blue-300" />
          <div>
            <h1 className="text-xl font-bold">Pharmacy PMS</h1>
            <p className="text-xs text-blue-300">Reception Portal</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-700 text-white shadow-lg"
                  : "text-blue-100 hover:bg-blue-700/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;