import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { addPatient } from "../../api/patientApi";
import { addPatient as addPatientAction } from "../../features/patients/patientSlice";
import { User, Phone, IdCard, Calendar, MapPin, Users } from "lucide-react";

const AddPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState({
    name: "",
    cnic: "",
    mobile: "",
    age: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPatient = await addPatient(patient);
      dispatch(addPatientAction(newPatient));
      alert("Patient added successfully!");
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error adding patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", icon: User, required: true },
    { name: "cnic", label: "CNIC", type: "text", placeholder: "12345-1234567-1", icon: IdCard, required: true },
    { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "0300-1234567", icon: Phone, required: true },
    { name: "age", label: "Age", type: "number", placeholder: "Enter age", icon: Calendar, required: true },
    { name: "address", label: "Address", type: "text", placeholder: "Enter complete address", icon: MapPin, required: true },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Register New Patient</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in the patient details below</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {inputFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={field.type}
                          name={field.name}
                          value={patient[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Male", "Female", "Other"].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={option.toLowerCase()}
                          onChange={handleChange}
                          required
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {option === "Other" ? "Other" : option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Patient"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/patients")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;