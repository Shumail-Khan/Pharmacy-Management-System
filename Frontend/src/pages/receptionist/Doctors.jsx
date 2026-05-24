import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { 
  Stethoscope, UserPlus, Search, Edit2, Trash2, X, 
  Phone, Mail, Clock, DollarSign, Users, Activity, 
  Calendar, Award, CheckCircle, Eye, Filter, Plus
} from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorStats, setDoctorStats] = useState({ 
    totalPatients: 0, 
    totalEarnings: 0, 
    completedAppointments: 0,
    todayPatients: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    fee: "",
    experience: "",
    qualification: "",
    availableDays: [],
    availableTimeStart: "09:00",
    availableTimeEnd: "17:00",
    roomNumber: "",
    bio: ""
  });

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "General Physician",
    "Pediatrician",
    "Neurologist",
    "Gynecologist",
    "Orthopedic",
    "Ophthalmologist",
    "ENT Specialist",
    "Psychiatrist",
    "Dentist",
    "Urologist"
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    const storedDoctors = localStorage.getItem('mock_doctors');
    if (storedDoctors) {
      setDoctors(JSON.parse(storedDoctors));
    } else {
      const mockDoctors = [
        { 
          _id: "d1", 
          name: "Ahmed Khan", 
          specialization: "Cardiologist", 
          fee: 1000, 
          available: true,
          phone: "0300-1234567",
          email: "ahmed.khan@clinic.com",
          experience: "8 years",
          qualification: "MBBS, FCPS Cardiology",
          availableDays: ["Monday", "Wednesday", "Friday"],
          availableTimeStart: "09:00",
          availableTimeEnd: "17:00",
          roomNumber: "101",
          bio: "Experienced cardiologist specializing in heart diseases",
          createdAt: new Date().toISOString()
        },
        { 
          _id: "d2", 
          name: "Fatima Ali", 
          specialization: "Dermatologist", 
          fee: 800, 
          available: true,
          phone: "0300-2345678",
          email: "fatima.ali@clinic.com",
          experience: "5 years",
          qualification: "MBBS, FCPS Dermatology",
          availableDays: ["Tuesday", "Thursday", "Saturday"],
          availableTimeStart: "10:00",
          availableTimeEnd: "18:00",
          roomNumber: "102",
          bio: "Skin specialist with expertise in cosmetic dermatology",
          createdAt: new Date().toISOString()
        },
        { 
          _id: "d3", 
          name: "Usman Riaz", 
          specialization: "General Physician", 
          fee: 600, 
          available: true,
          phone: "0300-3456789",
          email: "usman.riaz@clinic.com",
          experience: "12 years",
          qualification: "MBBS, MCPS",
          availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
          availableTimeStart: "09:00",
          availableTimeEnd: "16:00",
          roomNumber: "103",
          bio: "General physician treating all common illnesses",
          createdAt: new Date().toISOString()
        },
        { 
          _id: "d4", 
          name: "Ayesha Malik", 
          specialization: "Pediatrician", 
          fee: 700, 
          available: true,
          phone: "0300-4567890",
          email: "ayesha.malik@clinic.com",
          experience: "10 years",
          qualification: "MBBS, FCPS Pediatrics",
          availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
          availableTimeStart: "11:00",
          availableTimeEnd: "19:00",
          roomNumber: "104",
          bio: "Child specialist with focus on pediatric care",
          createdAt: new Date().toISOString()
        },
        { 
          _id: "d5", 
          name: "Omar Hassan", 
          specialization: "Neurologist", 
          fee: 1200, 
          available: true,
          phone: "0300-5678901",
          email: "omar.hassan@clinic.com",
          experience: "15 years",
          qualification: "MBBS, FCPS Neurology",
          availableDays: ["Tuesday", "Thursday"],
          availableTimeStart: "10:00",
          availableTimeEnd: "16:00",
          roomNumber: "105",
          bio: "Neurology specialist treating brain and nervous system disorders",
          createdAt: new Date().toISOString()
        },
        { 
          _id: "d6", 
          name: "Sana Khan", 
          specialization: "Gynecologist", 
          fee: 900, 
          available: true,
          phone: "0300-6789012",
          email: "sana.khan@clinic.com",
          experience: "7 years",
          qualification: "MBBS, FCPS Gynecology",
          availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
          availableTimeStart: "09:00",
          availableTimeEnd: "17:00",
          roomNumber: "106",
          bio: "Women's health specialist",
          createdAt: new Date().toISOString()
        }
      ];
      setDoctors(mockDoctors);
      localStorage.setItem('mock_doctors', JSON.stringify(mockDoctors));
    }
    setLoading(false);
  };

  const loadDoctorAppointments = (doctorId) => {
    const storedAppointments = localStorage.getItem('mock_appointments');
    if (storedAppointments) {
      const allAppointments = JSON.parse(storedAppointments);
      const doctorApps = allAppointments.filter(a => a.doctorId === doctorId);
      setDoctorAppointments(doctorApps);
      
      const completed = doctorApps.filter(a => a.status === "completed").length;
      const totalEarnings = doctorApps.filter(a => a.status === "completed").reduce((sum, a) => sum + (a.paymentAmount || a.doctorFee), 0);
      const today = new Date().toDateString();
      const todayPatients = doctorApps.filter(a => new Date(a.date).toDateString() === today).length;
      
      setDoctorStats({
        totalPatients: doctorApps.length,
        totalEarnings: totalEarnings,
        completedAppointments: completed,
        todayPatients: todayPatients
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'availableDays') {
        let updatedDays = [...formData.availableDays];
        if (checked) {
          updatedDays.push(value);
        } else {
          updatedDays = updatedDays.filter(day => day !== value);
        }
        setFormData({ ...formData, availableDays: updatedDays });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialization || !formData.fee || !formData.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (isEditing && selectedDoctor) {
      const updatedDoctors = doctors.map(doc => 
        doc._id === selectedDoctor._id 
          ? { ...formData, _id: doc._id, createdAt: doc.createdAt, available: true }
          : doc
      );
      setDoctors(updatedDoctors);
      localStorage.setItem('mock_doctors', JSON.stringify(updatedDoctors));
      alert("✅ Doctor updated successfully!");
    } else {
      const newDoctor = {
        _id: `d${Date.now()}`,
        ...formData,
        available: true,
        createdAt: new Date().toISOString()
      };
      const updatedDoctors = [newDoctor, ...doctors];
      setDoctors(updatedDoctors);
      localStorage.setItem('mock_doctors', JSON.stringify(updatedDoctors));
      alert("✅ Doctor added successfully!");
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email || "",
      fee: doctor.fee,
      experience: doctor.experience || "",
      qualification: doctor.qualification || "",
      availableDays: doctor.availableDays || [],
      availableTimeStart: doctor.availableTimeStart || "09:00",
      availableTimeEnd: doctor.availableTimeEnd || "17:00",
      roomNumber: doctor.roomNumber || "",
      bio: doctor.bio || ""
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor? This will also affect all appointments.")) {
      const updatedDoctors = doctors.filter(doc => doc._id !== doctorId);
      setDoctors(updatedDoctors);
      localStorage.setItem('mock_doctors', JSON.stringify(updatedDoctors));
      alert("✅ Doctor deleted successfully!");
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    loadDoctorAppointments(doctor._id);
    setShowDetailsModal(true);
  };

  const handleToggleAvailability = (doctorId) => {
    const updatedDoctors = doctors.map(doc => 
      doc._id === doctorId ? { ...doc, available: !doc.available } : doc
    );
    setDoctors(updatedDoctors);
    localStorage.setItem('mock_doctors', JSON.stringify(updatedDoctors));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      phone: "",
      email: "",
      fee: "",
      experience: "",
      qualification: "",
      availableDays: [],
      availableTimeStart: "09:00",
      availableTimeEnd: "17:00",
      roomNumber: "",
      bio: ""
    });
    setIsEditing(false);
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === "" || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.phone && doctor.phone.includes(searchTerm));
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter(d => d.available).length;
  const totalEarnings = doctors.reduce((sum, doc) => sum + (doc.fee || 0), 0);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
              <p className="text-sm text-gray-500">Manage doctor profiles, schedules, and availability</p>
            </div>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              Add New Doctor
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Doctors</p>
                  <p className="text-2xl font-bold">{totalDoctors}</p>
                </div>
                <Stethoscope className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Doctors</p>
                  <p className="text-2xl font-bold">{activeDoctors}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Specializations</p>
                  <p className="text-2xl font-bold">{specializations.length}</p>
                </div>
                <Award className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Avg Consultation Fee</p>
                  <p className="text-2xl font-bold">Rs. {(totalEarnings / totalDoctors || 0).toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by name, specialization, or phone..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  value={specializationFilter} 
                  onChange={(e) => setSpecializationFilter(e.target.value)} 
                  className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="flex justify-center h-64">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No doctors found</p>
              <button onClick={() => { resetForm(); setShowModal(true); }} className="mt-4 text-blue-600 hover:text-blue-700">
                + Add your first doctor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Dr. {doctor.name}</h3>
                          <p className="text-blue-100 text-sm">{doctor.specialization}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleAvailability(doctor._id)}
                        className={`text-xs px-2 py-1 rounded-full ${doctor.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        {doctor.available ? 'Available' : 'Off Duty'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Fee: Rs. {doctor.fee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{doctor.availableTimeStart} - {doctor.availableTimeEnd}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <button 
                        onClick={() => handleViewDetails(doctor)} 
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button 
                        onClick={() => handleEdit(doctor)} 
                        className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(doctor._id)} 
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {isEditing ? 'Update doctor information' : 'Fill in doctor details'}
                </p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-white hover:bg-white/20 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0300-1234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="doctor@clinic.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (Rs.) *</label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5 years"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MBBS, FCPS"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                  <input
                    type="time"
                    name="availableTimeStart"
                    value={formData.availableTimeStart}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available To</label>
                  <input
                    type="time"
                    name="availableTimeEnd"
                    value={formData.availableTimeEnd}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="grid grid-cols-4 gap-2">
                    {weekDays.map(day => (
                      <label key={day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="availableDays"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleInputChange}
                          className="text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio / About</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description about the doctor..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                  {isEditing ? 'Update Doctor' : 'Add Doctor'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 sticky top-0 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Dr. {selectedDoctor.name}</h3>
                  <p className="text-blue-100 text-sm">{selectedDoctor.specialization}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{doctorStats.totalPatients}</p>
                  <p className="text-xs text-gray-500">Total Patients</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{doctorStats.completedAppointments}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{doctorStats.todayPatients}</p>
                  <p className="text-xs text-gray-500">Today's Patients</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">Rs. {doctorStats.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                </div>
              </div>
              
              {/* Doctor Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="font-medium flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedDoctor.phone}</p>
                  {selectedDoctor.email && <p className="text-sm text-gray-600 mt-1">{selectedDoctor.email}</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Schedule</p>
                  <p className="font-medium">{selectedDoctor.availableTimeStart} - {selectedDoctor.availableTimeEnd}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.availableDays?.join(", ")}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Experience & Qualification</p>
                  <p className="font-medium">{selectedDoctor.experience || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.qualification || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Room / Fee</p>
                  <p className="font-medium">Room: {selectedDoctor.roomNumber || 'N/A'}</p>
                  <p className="text-sm text-green-600">Fee: Rs. {selectedDoctor.fee}</p>
                </div>
              </div>
              
              {/* Bio */}
              {selectedDoctor.bio && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">About</h4>
                  <p className="text-gray-600 text-sm">{selectedDoctor.bio}</p>
                </div>
              )}
              
              {/* Appointment History */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Recent Appointments
                </h4>
                {doctorAppointments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No appointments yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {doctorAppointments.slice(0, 10).map((app) => (
                      <div key={app._id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{app.patientName}</p>
                          <p className="text-xs text-gray-500">{new Date(app.date).toLocaleDateString()} at {app.time}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            app.status === "completed" ? "bg-green-100 text-green-700" : 
                            app.status === "waiting" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>
                            {app.status}
                          </span>
                          <p className="text-xs text-green-600 mt-1">Rs. {app.paymentAmount || app.doctorFee}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={() => { setShowDetailsModal(false); handleEdit(selectedDoctor); }} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg">
                  Edit Doctor
                </button>
                <button onClick={() => setShowDetailsModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;