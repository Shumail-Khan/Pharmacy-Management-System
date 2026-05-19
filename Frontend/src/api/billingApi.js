import { mockBills, mockAppointments, mockPatients, mockDoctors } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getBills = async () => {
  await delay(500);
  return mockBills;
};

export const createBill = async (data) => {
  await delay(500);
  const patient = mockPatients.find(p => p._id === data.patientId);
  const doctor = mockDoctors.find(d => d._id === data.doctorId);
  
  const newBill = {
    _id: Date.now().toString(),
    patientId: data.patientId,
    patientName: patient?.name || "Unknown",
    doctorId: data.doctorId,
    doctorName: doctor?.name || "Unknown",
    amount: data.amount,
    receiptNumber: `RCP-${String(mockBills.length + 1).padStart(3, '0')}`,
    status: "paid",
    date: new Date().toISOString(),
  };
  mockBills.unshift(newBill);
  
  // Mark appointment as billed
  if (data.appointmentId) {
    const appointmentIndex = mockAppointments.findIndex(a => a._id === data.appointmentId);
    if (appointmentIndex !== -1) {
      mockAppointments[appointmentIndex].billed = true;
    }
  }
  
  return newBill;
};

export const getTodayBills = async () => {
  await delay(500);
  const today = new Date().toDateString();
  return mockBills.filter(b => new Date(b.date).toDateString() === today);
};

export const updateBill = async (id, data) => {
  await delay(500);
  const index = mockBills.findIndex(b => b._id === id);
  if (index !== -1) {
    mockBills[index] = { ...mockBills[index], ...data };
    return mockBills[index];
  }
  throw new Error("Bill not found");
};

export const deleteBill = async (id) => {
  await delay(500);
  const index = mockBills.findIndex(b => b._id === id);
  if (index !== -1) {
    mockBills.splice(index, 1);
    return { success: true };
  }
  throw new Error("Bill not found");
};