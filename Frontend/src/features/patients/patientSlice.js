import { createSlice } from "@reduxjs/toolkit";

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    loading: false,
    error: null,
    searchResults: [],
  },
  reducers: {
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.unshift(action.payload);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action) => {
      state.patients = state.patients.filter(p => p._id !== action.payload);
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
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
  setPatients, 
  addPatient, 
  updatePatient, 
  deletePatient, 
  setSearchResults,
  setLoading,
  setError 
} = patientSlice.actions;
export default patientSlice.reducer;