import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './pages/header/Header';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Currentstatus from './pages/Currentstatus/CurrentStatusf';
import Home from './pages/Home/Home';
import History from './pages/History/Historyf';
import ProtectedRoute from './pages/components/ProtectedRoute'; 
import LogoutPage from './pages/auth/logout/logout'; 
import AdminApproval from './pages/admin/AdminApproval';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        {/* Admin Specific Routes */}
        <Route 
          path="/admin/approval" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminApproval />
            </ProtectedRoute>
          } 
        />

        {/* FIX: Consolidating Dashboard Routes 
            We point the main /dashboard path to a logic-check or 
            ensure /supervisor/dashboard is the primary home for supervisors.
        */}
        <Route 
          path="/supervisor/dashboard" 
          element={
            <ProtectedRoute requiredRole="supervisor">
              <SupervisorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* General User Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Other Protected Routes */}
        <Route path="/currentstatus" element={<ProtectedRoute><Currentstatus /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute><LogoutPage /></ProtectedRoute>} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;