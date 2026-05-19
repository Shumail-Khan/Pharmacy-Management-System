// Mock data for testing without backend
export const mockPatients = [
  {
    _id: "1",
    name: "John Doe",
    cnic: "12345-1234567-1",
    mobile: "0300-1234567",
    age: "30",
    gender: "male",
    address: "123 Main Street",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Jane Smith",
    cnic: "12345-7654321-1",
    mobile: "0300-7654321",
    age: "25",
    gender: "female",
    address: "456 Oak Avenue",
    createdAt: new Date().toISOString(),
  },
];

export const mockDoctors = [
  {
    _id: "1",
    name: "Ahmed Khan",
    specialization: "Cardiologist",
    phone: "0300-1111111",
    fee: 1000,
    schedule: "Mon-Fri 9AM-5PM",
    status: "active",
  },
  {
    _id: "2",
    name: "Fatima Ali",
    specialization: "Dermatologist",
    phone: "0300-2222222",
    fee: 800,
    schedule: "Mon-Wed 10AM-4PM",
    status: "active",
  },
];

export const mockAppointments = [
  {
    _id: "1",
    patientId: "1",
    patientName: "John Doe",
    patientMobile: "0300-1234567",
    doctorId: "1",
    doctorName: "Ahmed Khan",
    doctorSpecialization: "Cardiologist",
    doctorFee: 1000,
    date: new Date().toISOString(),
    time: "10:00",
    tokenNumber: 101,
    status: "waiting",
  },
  {
    _id: "2",
    patientId: "2",
    patientName: "Jane Smith",
    patientMobile: "0300-7654321",
    doctorId: "2",
    doctorName: "Fatima Ali",
    doctorSpecialization: "Dermatologist",
    doctorFee: 800,
    date: new Date().toISOString(),
    time: "11:00",
    tokenNumber: 102,
    status: "completed",
  },
];

export const mockBills = [
  {
    _id: "1",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Ahmed Khan",
    amount: 1000,
    receiptNumber: "RCP-001",
    status: "paid",
    date: new Date().toISOString(),
  },
];