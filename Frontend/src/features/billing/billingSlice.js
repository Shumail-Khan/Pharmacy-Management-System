import { createSlice } from "@reduxjs/toolkit";

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    bills: [],
    todayBills: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBills: (state, action) => {
      state.bills = action.payload;
    },
    setTodayBills: (state, action) => {
      state.todayBills = action.payload;
    },
    addBill: (state, action) => {
      state.bills.unshift(action.payload);
      state.todayBills.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBills, setTodayBills, addBill, setLoading, setError } = billingSlice.actions;
export default billingSlice.reducer;