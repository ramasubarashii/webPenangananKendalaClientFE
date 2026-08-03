import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { ServiceDeskDashboard } from './components/ServiceDeskDashboard';
import { ProjectManagerDashboard } from './components/ProjectManagerDashboard';
import { ProgrammerDashboard } from './components/ProgrammerDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import axios from 'axios';

const DashboardRouter = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Auto-poll tickets every 10 seconds for real-time monitoring updates
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Synchronizing workspace tickets...</p>
      </div>
    );
  }

  // Route based on role
  switch (user.role) {
    case 'service_desk':
      return (
        <ServiceDeskDashboard
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          fetchTickets={fetchTickets}
        />
      );
    case 'project_manager':
      return (
        <ProjectManagerDashboard
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          fetchTickets={fetchTickets}
        />
      );
    case 'programmer':
      return (
        <ProgrammerDashboard
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          fetchTickets={fetchTickets}
        />
      );
    case 'owner':
      return (
        <OwnerDashboard
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
        />
      );
    default:
      return (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3>Unknown user role: {user.role}</h3>
          <p>Please contact system administrator.</p>
        </div>
      );
  }
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="glass-panel" style={{ padding: '30px 50px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Securing Workspace</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Restoring session tokens & mounting controllers...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Layout>
      <DashboardRouter />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
