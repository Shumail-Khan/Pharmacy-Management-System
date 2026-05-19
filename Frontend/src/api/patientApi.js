import { mockPatients } from "./mockData";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPatients = async () => {
  await delay(500);
  return mockPatients;
};

export const addPatient = async (data) => {
  await delay(500);
  const newPatient = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  mockPatients.unshift(newPatient);
  return newPatient;
};

export const updatePatient = async (id, data) => {
  await delay(500);
  const index = mockPatients.findIndex(p => p._id === id);
  if (index !== -1) {
    mockPatients[index] = { ...mockPatients[index], ...data };
    return mockPatients[index];
  }
  throw new Error("Patient not found");
};

export const deletePatient = async (id) => {
  await delay(500);
  const index = mockPatients.findIndex(p => p._id === id);
  if (index !== -1) {
    mockPatients.splice(index, 1);
    return { success: true };
  }
  throw new Error("Patient not found");
};

export const searchPatient = async (query) => {
  await delay(300);
  const results = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(query.toLowerCase()) ||
    patient.cnic.includes(query) ||
    patient.mobile.includes(query)
  );
  return results;
};