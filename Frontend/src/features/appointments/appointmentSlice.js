import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    todayAppointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setTodayAppointments: (state, action) => {
      state.todayAppointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
      state.todayAppointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      const todayIndex = state.todayAppointments.findIndex(a => a._id === action.payload._id);
      if (todayIndex !== -1) {
        state.todayAppointments[todayIndex] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setAppointments, 
  setTodayAppointments, 
  addAppointment, 
  updateAppointment,
  setLoading,
  setError 
} = appointmentSlice.actions;
export default appointmentSlice.reducer;