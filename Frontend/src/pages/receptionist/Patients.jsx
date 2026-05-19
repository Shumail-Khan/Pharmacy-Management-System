import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getPatients, searchPatient, deletePatient } from "../../api/patientApi";
import { setPatients, setSearchResults } from "../../features/patients/patientSlice";
import { Search, Edit, Trash2, UserPlus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, searchResults } = useSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      dispatch(setPatients(data));
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await searchPatient(searchTerm);
        dispatch(setSearchResults(results));
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      dispatch(setSearchResults([]));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const displayedPatients = searchResults.length > 0 ? searchResults : patients;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Patient Management</h2>
            <button
              onClick={() => navigate("/add-patient")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              Add New Patient
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by CNIC, Mobile Number, or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : displayedPatients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No patients found</td>
                    </tr>
                  ) : (
                    displayedPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{patient.cnic}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.mobile}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.age} / {patient.gender}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
    </div>
  );
};

export default Patients;