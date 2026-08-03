import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(roleEmail, 'password');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '800' }}>
          <span className="text-gradient"></span> Ticketing
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
          Process-Driven Client Ticket Handling System
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. servicedesk@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '25px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginBottom: '25px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ position: 'relative', margin: '20px 0', textAlign: 'center' }}>
          <hr style={{ border: '0', borderTop: '1px solid var(--border-glass)' }} />
          <span style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0e0f1d',
            padding: '0 10px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>DEMO QUICK ACCESS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => handleQuickLogin('servicedesk@example.com')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px' }}
            disabled={loading}
          >
            Service Desk
          </button>
          <button
            onClick={() => handleQuickLogin('pm@example.com')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px' }}
            disabled={loading}
          >
            Project Manager
          </button>
          <button
            onClick={() => handleQuickLogin('programmer@example.com')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px' }}
            disabled={loading}
          >
            Programmer
          </button>
          <button
            onClick={() => handleQuickLogin('owner@example.com')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px' }}
            disabled={loading}
          >
            Owner
          </button>
        </div>
      </div>
    </div>
  );
};
