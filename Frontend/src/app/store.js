import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import patientReducer from "../features/patients/patientSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";
import billingReducer from "../features/billing/billingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    billing: billingReducer,
  },
});