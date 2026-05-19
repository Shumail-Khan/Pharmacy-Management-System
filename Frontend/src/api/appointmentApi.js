import { mockAppointments, mockPatients, mockDoctors } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAppointments = async () => {
  await delay(500);
  return mockAppointments;
};

export const createAppointment = async (data) => {
  await delay(500);
  const patient = mockPatients.find(p => p._id === data.patientId);
  const doctor = mockDoctors.find(d => d._id === data.doctorId);
  
  const newAppointment = {
    _id: Date.now().toString(),
    patientId: data.patientId,
    patientName: patient?.name || "Unknown",
    patientMobile: patient?.mobile || "N/A",
    doctorId: data.doctorId,
    doctorName: doctor?.name || "Unknown",
    doctorSpecialization: doctor?.specialization || "General",
    doctorFee: doctor?.fee || 500,
    date: data.date,
    time: data.time,
    tokenNumber: Math.floor(Math.random() * 900) + 100,
    status: "waiting",
  };
  mockAppointments.unshift(newAppointment);
  return newAppointment;
};

export const updateAppointment = async (id, data) => {
  await delay(500);
  const index = mockAppointments.findIndex(a => a._id === id);
  if (index !== -1) {
    mockAppointments[index] = { ...mockAppointments[index], ...data };
    return mockAppointments[index];
  }
  throw new Error("Appointment not found");
};

export const cancelAppointment = async (id) => {
  await delay(500);
  const index = mockAppointments.findIndex(a => a._id === id);
  if (index !== -1) {
    mockAppointments[index].status = "cancelled";
    return { success: true };
  }
  throw new Error("Appointment not found");
};

export const getTodayAppointments = async () => {
  await delay(500);
  const today = new Date().toDateString();
  return mockAppointments.filter(a => new Date(a.date).toDateString() === today);
};