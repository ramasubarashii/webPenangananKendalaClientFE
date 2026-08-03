import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to load dashboard index", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStats = () => {
    const stats = { total: 0, open: 0, active: 0, resolved: 0, closed: 0 };
    tickets.forEach(ticket => {
      stats.total++;
      if (ticket.status === 'open') stats.open++;
      else if (ticket.status === 'assigned' || ticket.status === 'in_progress') stats.active++;
      else if (ticket.status === 'resolved') stats.resolved++;
      else if (ticket.status === 'closed') stats.closed++;
    });
    return stats;
  };

  const stats = getStats();
  const getGreeting = () => {
    switch (user?.role) {
      case 'service_desk': return 'Service Desk Console';
      case 'project_manager': return 'PM Project Control Center';
      case 'programmer': return 'Developer Backlog Control';
      case 'owner': return 'Executive Surveillance Desk';
      default: return 'Ticketing Dashboard';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'high': return 'bg-red-50 text-red-700 border border-red-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return 'bg-sky-50 text-sky-700 border border-sky-100';
      case 'assigned': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'closed': return 'bg-slate-100 text-slate-600 border border-slate-200';
      case 'rejected': return 'bg-red-50 text-red-700 border border-red-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  if (loading) {
    return <div className="text-slate-500 text-sm text-left">Initializing dashboard console...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 text-left w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{getGreeting()}</h2>
        <p className="text-sm text-slate-500">Welcome back, {user?.name}. Operational workflow indexes are up to date.</p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {user.role === 'service_desk' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 hover:border-primary transition-all duration-150 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Create Support Ticket</h4>
              <p className="text-xs text-slate-500 leading-normal">Report and file new client concerns or issues to the queue.</p>
            </div>
            <Link to="/tickets/create" className="py-2 text-center bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-sm transition-all">
              + File New Ticket
            </Link>
          </div>
        )}

        {user.role === 'project_manager' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 hover:border-primary transition-all duration-150 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Resource Allocation</h4>
              <p className="text-xs text-slate-500 leading-normal">Review open tickets and assign programmers with hourly estimations.</p>
            </div>
            <Link to="/tickets/assign" className="py-2 text-center bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-sm transition-all">
              Go to Resource Allocation
            </Link>
          </div>
        )}

        {user.role === 'programmer' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 hover:border-primary transition-all duration-150 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">My Sprint Tasks</h4>
              <p className="text-xs text-slate-500 leading-normal">You have {tickets.filter(t => t.status === 'assigned' || t.status === 'in_progress').length} active tasks assigned.</p>
            </div>
            <Link to="/tickets/tasks" className="py-2 text-center bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-sm transition-all">
              Open My Worklist
            </Link>
          </div>
        )}

        {user.role === 'owner' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 hover:border-primary transition-all duration-150 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Analytical Audit Reports</h4>
              <p className="text-xs text-slate-500 leading-normal">Review overall statistics, charts, and log activity streams.</p>
            </div>
            <Link to="/reports" className="py-2 text-center bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-sm transition-all">
              Open Audit Reports
            </Link>
          </div>
        )}

        {/* Counter cards */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 shadow-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Backlog</h4>
            <p className="text-[11px] text-slate-400 mt-1">Sum of all tickets registered.</p>
          </div>
          <span className="text-3xl font-extrabold text-primary">{stats.total}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 shadow-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Tasks</h4>
            <p className="text-[11px] text-slate-400 mt-1">In progress or assigned state.</p>
          </div>
          <span className="text-3xl font-extrabold text-amber-500">{stats.active}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-40 shadow-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolved & Closed</h4>
            <p className="text-[11px] text-slate-400 mt-1">Verification finished.</p>
          </div>
          <span className="text-3xl font-extrabold text-emerald-600">{stats.closed + stats.resolved}</span>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-slate-900">Recent Active Tickets</h3>
          <Link to="/tickets" className="text-primary text-xs font-bold hover:underline">
            View All Tickets &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-900 border-collapse">
            <thead className="bg-[#F1F3F4] border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Creator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.slice(0, 5).map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-primary">{ticket.ticket_id || `TCK-OLD-${ticket.id}`}</td>
                  <td className="px-4 py-3 font-semibold truncate max-w-xs">
                    <Link to={`/tickets/${ticket.ticket_id || ticket.id}`} className="hover:underline text-slate-900">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{ticket.creator?.name}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-400 text-xs">No registered tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
