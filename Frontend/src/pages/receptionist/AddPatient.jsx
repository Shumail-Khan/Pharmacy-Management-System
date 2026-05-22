import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { addPatient as addPatientAction } from "../../features/patients/patientSlice";
import { addAppointment } from "../../features/appointments/appointmentSlice";
import { User, Phone, IdCard, Calendar, MapPin, Stethoscope, Clock, AlertCircle, Printer, Ticket, CheckCircle, DollarSign, RefreshCw } from "lucide-react";

const AddPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  
  const [patient, setPatient] = useState({
    name: "",
    cnic: "",
    mobile: "",
    age: "",
    gender: "",
    address: "",
  });

  const [appointment, setAppointment] = useState({
    doctorId: "",
    date: "",
    time: "",
    paymentAmount: "",
  });

  const [createAppointmentNow, setCreateAppointmentNow] = useState(true);

  // Load doctors from localStorage or initialize
  useEffect(() => {
    const storedDoctors = localStorage.getItem('mock_doctors');
    if (storedDoctors) {
      setDoctors(JSON.parse(storedDoctors));
    } else {
      const mockDoctors = [
        { _id: "d1", name: "Ahmed Khan", specialization: "Cardiologist", fee: 1000, available: true },
        { _id: "d2", name: "Fatima Ali", specialization: "Dermatologist", fee: 800, available: true },
        { _id: "d3", name: "Usman Riaz", specialization: "General Physician", fee: 600, available: true },
        { _id: "d4", name: "Ayesha Malik", specialization: "Pediatrician", fee: 700, available: true },
        { _id: "d5", name: "Omar Hassan", specialization: "Neurologist", fee: 1200, available: true },
        { _id: "d6", name: "Sana Khan", specialization: "Gynecologist", fee: 900, available: true },
      ];
      setDoctors(mockDoctors);
      localStorage.setItem('mock_doctors', JSON.stringify(mockDoctors));
    }
    setLoadingDoctors(false);
  }, []);

  const generateTokenNumber = () => {
    const existingAppointments = localStorage.getItem('mock_appointments');
    let existingTokens = [];
    if (existingAppointments) {
      existingTokens = JSON.parse(existingAppointments).map(a => a.tokenNumber);
    }
    
    let newToken;
    do {
      newToken = Math.floor(Math.random() * 900) + 100;
    } while (existingTokens.includes(newToken));
    return newToken;
  };

  const generatePatientId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P${timestamp}${random}`;
  };

  const handlePatientChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppointmentChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(d => d._id === doctorId);
    if (selectedDoctor) {
      setAppointment({
        ...appointment,
        doctorId: doctorId,
        paymentAmount: selectedDoctor.fee.toString(),
      });
    }
  };

  const printTokenSlip = (data) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Token - ${data.patient.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
            .token-card { max-width: 450px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }
            .token-header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 25px; text-align: center; }
            .token-header h1 { font-size: 28px; margin-bottom: 5px; }
            .token-body { padding: 30px; }
            .token-label { text-align: center; font-size: 12px; color: #6b7280; letter-spacing: 3px; text-transform: uppercase; }
            .token-number { text-align: center; font-size: 72px; font-weight: bold; color: #d97706; margin: 15px 0; font-family: 'Courier New', monospace; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 0; border-bottom: 1px dashed #f3f4f6; }
            .info-label { font-weight: 600; color: #4b5563; font-size: 13px; }
            .info-value { color: #1f2937; font-size: 14px; font-weight: 500; }
            .doctor-info { background: #eff6ff; padding: 15px; border-radius: 10px; margin: 15px 0; }
            .payment-box { background: #f0fdf4; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: center; }
            .payment-box .amount { font-size: 28px; font-weight: bold; color: #166534; }
            .instruction { background: #fef3c7; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: center; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 11px; color: #6b7280; }
            @media print { body { background: white; padding: 0; } .token-card { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="token-card">
            <div class="token-header"><h1>🏥 Pharmacy PMS</h1><p>Appointment Token Slip</p></div>
            <div class="token-body">
              <div class="token-label">YOUR TOKEN NUMBER</div>
              <div class="token-number">#${data.tokenNumber}</div>
              <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${data.patient.name}</span></div>
              <div class="info-row"><span class="info-label">Mobile Number:</span><span class="info-value">${data.patient.mobile}</span></div>
              <div class="info-row"><span class="info-label">Date:</span><span class="info-value">${new Date(data.appointment.date).toLocaleDateString()}</span></div>
              <div class="info-row"><span class="info-label">Time:</span><span class="info-value">${data.appointment.time}</span></div>
              <div class="doctor-info"><div class="info-row"><span class="info-label">👨‍⚕️ Doctor:</span><span class="info-value">Dr. ${data.doctor.name}</span></div></div>
              <div class="payment-box"><div class="label">💰 Payment Received</div><div class="amount">Rs. ${parseInt(data.paymentAmount).toLocaleString()}</div></div>
              <div class="instruction"><p>⚠️ Please wait for your turn</p><p>Keep this token for consultation</p></div>
            </div>
            <div class="footer"><p>Generated on: ${new Date().toLocaleString()}</p><p>Thank you for choosing us!</p></div>
          </div>
          <script>window.print();setTimeout(()=>window.close(),500);</script>
        </body>
      </html>
    `);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!patient.name || !patient.mobile || !patient.age || !patient.gender) {
      alert("Please fill all required patient fields");
      return;
    }
    
    if (createAppointmentNow && !appointment.doctorId) {
      alert("Please select a doctor for the appointment");
      return;
    }

    if (createAppointmentNow && (!appointment.date || !appointment.time)) {
      alert("Please select appointment date and time");
      return;
    }

    if (createAppointmentNow && (!appointment.paymentAmount || appointment.paymentAmount <= 0)) {
      alert("Please enter a valid payment amount");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      try {
        const newPatient = {
          _id: generatePatientId(),
          ...patient,
          createdAt: new Date().toISOString(),
        };
        
        const storedPatients = localStorage.getItem('mock_patients');
        let allPatients = storedPatients ? JSON.parse(storedPatients) : [];
        allPatients.unshift(newPatient);
        localStorage.setItem('mock_patients', JSON.stringify(allPatients));
        dispatch(addPatientAction(newPatient));
        
        if (createAppointmentNow && appointment.doctorId) {
          const selectedDoctor = doctors.find(d => d._id === appointment.doctorId);
          const tokenNumber = generateTokenNumber();
          
          const newAppointment = {
            _id: `a${Date.now()}`,
            patientId: newPatient._id,
            patientName: newPatient.name,
            patientMobile: newPatient.mobile,
            doctorId: appointment.doctorId,
            doctorName: selectedDoctor.name,
            doctorSpecialization: selectedDoctor.specialization,
            doctorFee: selectedDoctor.fee,
            date: appointment.date,
            time: appointment.time,
            tokenNumber: tokenNumber,
            status: "waiting",
            paymentAmount: appointment.paymentAmount,
            createdAt: new Date().toISOString(),
            billed: false,
          };
          
          const storedAppointments = localStorage.getItem('mock_appointments');
          let allAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
          allAppointments.unshift(newAppointment);
          localStorage.setItem('mock_appointments', JSON.stringify(allAppointments));
          dispatch(addAppointment(newAppointment));
          
          setGeneratedData({
            tokenNumber: tokenNumber,
            appointment: newAppointment,
            patient: newPatient,
            doctor: selectedDoctor,
            paymentAmount: appointment.paymentAmount,
          });
          
          setShowSuccessModal(true);
        } else {
          alert("✅ Patient added successfully!");
          navigate("/patients");
        }
      } catch (error) {
        console.error("Error adding patient:", error);
        alert("Error adding patient. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handlePrintToken = () => {
    if (generatedData) {
      printTokenSlip(generatedData);
    }
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    navigate("/queue");
  };

  const inputFields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", icon: User, required: true },
    { name: "cnic", label: "CNIC", type: "text", placeholder: "12345-1234567-1", icon: IdCard, required: false },
    { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "0300-1234567", icon: Phone, required: true },
    { name: "age", label: "Age", type: "number", placeholder: "Enter age", icon: Calendar, required: true },
    { name: "address", label: "Address", type: "text", placeholder: "Enter complete address", icon: MapPin, required: false },
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Register New Patient</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in the patient details and schedule appointment</p>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inputFields.map((field) => {
                      const Icon = field.icon;
                      return (
                        <div key={field.name} className={field.name === "address" ? "md:col-span-2" : ""}>
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
                              onChange={handlePatientChange}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                      <div className="flex gap-4">
                        {["Male", "Female", "Other"].map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input type="radio" name="gender" value={option.toLowerCase()} onChange={handlePatientChange} required className="text-blue-600" />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      Appointment Details
                    </h3>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={createAppointmentNow} onChange={(e) => setCreateAppointmentNow(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-600">Create appointment now</span>
                    </label>
                  </div>
                  {createAppointmentNow && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select value={appointment.doctorId} onChange={(e) => handleDoctorSelect(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Select a doctor</option>
                              {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>Dr. {doctor.name} - {doctor.specialization} (Fee: Rs.{doctor.fee})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input type="date" name="date" value={appointment.date} onChange={handleAppointmentChange} min={today} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input type="time" name="time" value={appointment.time} onChange={handleAppointmentChange} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (Rs.) <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input type="number" name="paymentAmount" value={appointment.paymentAmount} onChange={handleAppointmentChange} placeholder="Auto-fills from doctor fee" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 flex items-center gap-2"><Ticket className="w-4 h-4 text-blue-600" /> Token number will be generated automatically after registration</p>
                      </div>
                    </div>
                  )}
                  {!createAppointmentNow && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> You can create an appointment later from the Appointments section</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</> : <><User className="w-5 h-5" /> {createAppointmentNow ? "Register & Generate Token" : "Register Patient"}</>}
                  </button>
                  <button type="button" onClick={() => navigate("/patients")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition font-medium">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && generatedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-center">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">Patient Registered!</h3>
              <p className="text-green-100">Appointment & Token Created</p>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 rounded-lg p-6 mb-6 text-center">
                <p className="text-sm text-orange-600 mb-2">Token Number</p>
                <p className="text-6xl font-bold text-orange-600 font-mono">#{generatedData.tokenNumber}</p>
                <div className="mt-4 space-y-2 text-left bg-white p-3 rounded-lg">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Patient:</span><span className="font-medium text-gray-800">{generatedData.patient.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Doctor:</span><span className="font-medium text-gray-800">Dr. {generatedData.doctor.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Payment:</span><span className="font-medium text-green-600">Rs. {parseInt(generatedData.paymentAmount).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Date & Time:</span><span className="font-medium text-gray-800">{new Date(generatedData.appointment.date).toLocaleDateString()} at {generatedData.appointment.time}</span></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handlePrintToken} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print Token</button>
                <button onClick={handleFinish} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2"><Ticket className="w-4 h-4" /> View Queue</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPatient;