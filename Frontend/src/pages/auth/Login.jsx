import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      dispatch(loginSuccess(response.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <Stethoscope className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Pharmacy PMS</h1>
          <p className="text-blue-100 mt-2">Reception Portal</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="admin@gmail.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-500">
            Demo Credentials: admin@gmail.com / 123456
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;