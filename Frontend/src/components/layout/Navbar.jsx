import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Welcome back!</h2>
        <p className="text-sm text-gray-500">Manage your clinic operations here</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-700 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user?.name || "Receptionist"}</p>
            <p className="text-xs text-gray-500">Receptionist</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;