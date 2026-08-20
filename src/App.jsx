import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { LoginScreen } from './components/LoginScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { TicketList } from './components/TicketList';
import { CreateTicket } from './components/CreateTicket';
import { WalkInTicket } from './components/WalkInTicket';
import { AssignTicket } from './components/AssignTicket';
import { MyTasks } from './components/MyTasks';
import { Reports } from './components/Reports';
import { OwnerIssues } from './components/OwnerIssues';
import { Profile } from './components/Profile';
import { TicketDetail } from './components/TicketDetail';

// Client Imports
import { ClientDashboard } from './components/Client/ClientDashboard';
import { CreateTicketForm } from './components/Client/CreateTicketForm';
import { ClientTicketDetail } from './components/Client/ClientTicketDetail';

// Route Guard Component for Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-canvas">
        <div className="glass-panel p-8 text-center border border-border">
          <p className="text-sm text-text-muted">Securing operational console session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route Guard for Login Page (Redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Dynamic Dashboard Index Resolver based on User Role
const DashboardIndex = () => {
  const { user } = useAuth();
  if (user?.role === 'client') {
    return <ClientDashboard />;
  }
  return <DashboardOverview />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
        <Routes>
          {/* Public Auth Route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
          />

          {/* Protected Main Application Layout Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Overview landing page */}
            <Route index element={<DashboardIndex />} />

            {/* General Ticket List */}
            <Route path="tickets" element={<TicketList />} />

            {/* Client Ticketing Routes */}
            <Route
              path="client/create"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <CreateTicketForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="client/tickets/:ticketId"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientTicketDetail />
                </ProtectedRoute>
              }
            />

            {/* Route based specific pages (protected by role bounds) */}
            <Route
              path="tickets/create"
              element={
                <ProtectedRoute allowedRoles={['service_desk']}>
                  <CreateTicket />
                </ProtectedRoute>
              }
            />

            <Route
              path="tickets/walk-in"
              element={
                <ProtectedRoute allowedRoles={['service_desk']}>
                  <WalkInTicket />
                </ProtectedRoute>
              }
            />

            <Route
              path="tickets/assign"
              element={
                <ProtectedRoute allowedRoles={['project_manager']}>
                  <AssignTicket />
                </ProtectedRoute>
              }
            />

            <Route
              path="tickets/tasks"
              element={
                <ProtectedRoute allowedRoles={['programmer']}>
                  <MyTasks />
                </ProtectedRoute>
              }
            />

            <Route
              path="owner/issues"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerIssues />
                </ProtectedRoute>
              }
            />

            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Profile Route — Accessible to all logged-in roles */}
            <Route path="profile" element={<Profile />} />

            {/* Ticket details routing lookup by ticket_id string */}
            <Route path="tickets/:ticketId" element={<TicketDetail />} />
          </Route>

          {/* Fallback Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
