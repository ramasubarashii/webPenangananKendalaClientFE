import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

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
    return <div className="text-slate-500 text-sm text-left">Loading ticket directories...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 text-left w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">All Tickets</h2>
        <p className="text-sm text-slate-500">High-density operational ticketing registry</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Status</label>
          <select
            className="text-xs border border-slate-300 rounded-sm py-1.5 px-3 w-48 focus:outline-none focus:border-primary bg-white cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Priority</label>
          <select
            className="text-xs border border-slate-300 rounded-sm py-1.5 px-3 w-48 focus:outline-none focus:border-primary bg-white cursor-pointer"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-900">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Developer</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                    No tickets found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-xs text-primary">
                      {ticket.ticket_id || `TCK-OLD-${ticket.id}`}
                    </td>
                    <td className="px-6 py-3.5 font-semibold truncate max-w-xs">{ticket.title}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-xs">{ticket.creator?.name}</td>
                    <td className="px-6 py-3.5 text-slate-600 text-xs">
                      {ticket.assignments?.[0]?.programmer?.name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/tickets/${ticket.ticket_id || ticket.id}`}
                        className="text-primary hover:text-primary-hover font-bold text-xs underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
