import { mockDoctors } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDoctors = async () => {
  await delay(500);
  return mockDoctors;
};

export const getDoctorById = async (id) => {
  await delay(300);
  const doctor = mockDoctors.find(d => d._id === id);
  if (doctor) return doctor;
  throw new Error("Doctor not found");
};