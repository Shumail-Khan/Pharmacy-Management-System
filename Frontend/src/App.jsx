import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/receptionist/Dashboard";
import Patients from "./pages/receptionist/Patients";
import AddPatient from "./pages/receptionist/AddPatient";
import Appointments from "./pages/receptionist/Appointments";
import Queue from "./pages/receptionist/Queue";
import Billing from "./pages/receptionist/Billing";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-patient"
        element={
          <ProtectedRoute>
            <AddPatient />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <Queue />
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;