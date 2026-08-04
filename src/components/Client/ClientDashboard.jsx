import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Inbox
} from 'lucide-react';

export const ClientDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/client/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to load client dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => 
    t.status === 'open' || 
    t.status === 'assigned' || 
    t.status === 'in_progress' ||
    t.status === 'Open' ||
    t.status === 'In Progress'
  ).length;

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase();
    switch (p) {
      case 'low': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'high': return 'bg-red-50 text-red-700 border border-red-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'open': return 'bg-sky-50 text-sky-700 border border-sky-100';
      case 'assigned': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'in_progress': case 'in progress': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'closed': return 'bg-slate-100 text-slate-600 border border-slate-200';
      case 'rejected': return 'bg-red-50 text-red-700 border border-red-100';
      default: return 'bg-slate-50 text-slate-700 border border-slate-100';
    }
  };

  if (loading) {
    return <div className="text-slate-500 text-sm text-left">Initializing client workspace...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 text-left w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Client Support Hub</h2>
        <p className="text-sm text-slate-500">Report issues, track progress logs, and resolve technical concerns.</p>
      </div>

      {/* Grid: Stat Cards & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Action Card: Log New Ticket */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-36 hover:border-primary transition-all duration-150 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-primary" />
              <span>Log Support Ticket</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              File a new technical ticket detailing your system concern.
            </p>
          </div>
          <Link to="/client/create" className="py-2 text-center bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-sm transition-all">
            + File New Ticket
          </Link>
        </div>

        {/* Counter: Total Tickets */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-36 shadow-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Total Support Tickets</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Overall reported tickets history.</p>
          </div>
          <span className="text-3xl font-extrabold text-primary">{totalTickets}</span>
        </div>

        {/* Counter: Active Tickets */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-36 shadow-sm">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Active Issues</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Pending PM assign or developer sprint.</p>
          </div>
          <span className="text-3xl font-extrabold text-amber-500">{activeTickets}</span>
        </div>

      </div>

      {/* Ticket Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-slate-900">Your Support Tickets</h3>
          <span className="text-xs text-slate-400 font-semibold">{tickets.length} tickets filed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-900 border-collapse">
            <thead className="bg-[#F1F3F4] border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Filed</th>
                <th className="px-4 py-2.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                    {ticket.ticket_id || `TCK-OLD-${ticket.id}`}
                  </td>
                  <td className="px-4 py-3 font-semibold truncate max-w-xs">{ticket.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                      {ticket.category || 'N/A'}
                    </span>
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
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/client/tickets/${ticket.ticket_id}`}
                      className="text-primary hover:text-primary-hover font-bold text-xs underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-300" />
                      <span>You have not filed any support tickets yet.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
