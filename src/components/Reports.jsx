import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Reports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to load reporting data", err);
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

  const getAllLogs = () => {
    const logs = [];
    tickets.forEach(ticket => {
      if (ticket.progress_logs) {
        ticket.progress_logs.forEach(log => {
          logs.push({
            ...log,
            ticketTitle: ticket.title,
            ticketCustomId: ticket.ticket_id || `TCK-OLD-${ticket.id}`,
            ticketId: ticket.id
          });
        });
      }
    });
    return logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const logsFeed = getAllLogs();

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
    return <div className="text-slate-500 text-sm text-left">Loading statistical indexes...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 text-left w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Reports & Metrics</h2>
        <p className="text-sm text-slate-500">Business overview and progress logs audit feed</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Issues</h5>
          <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm border-b-4 border-b-sky-500">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Open Queue</h5>
          <span className="text-3xl font-extrabold text-sky-600">{stats.open}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm border-b-4 border-b-amber-500">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">In Development</h5>
          <span className="text-3xl font-extrabold text-amber-500">{stats.active}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm border-b-4 border-b-primary">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Verify</h5>
          <span className="text-3xl font-extrabold text-primary">{stats.resolved}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm border-b-4 border-b-emerald-500">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Closed (Resolved)</h5>
          <span className="text-3xl font-extrabold text-emerald-600">{stats.closed}</span>
        </div>
      </div>

      {/* Audit Log timeline feed */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-base font-bold text-slate-900 mb-6">Recent Operational Activity Feed</h3>
        
        {logsFeed.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No logged activity found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {logsFeed.map((log) => (
              <div key={log.id} className="flex gap-4 text-sm text-left">
                {/* Timeline node */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                </div>
                
                {/* Log details */}
                <div className="flex-1 pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <strong className="text-slate-900 font-bold">{log.user?.name}</strong>
                      <span className="text-[10px] font-bold uppercase text-slate-500 ml-2 bg-slate-100 py-0.5 px-2 rounded-sm border border-slate-200 tracking-wider">
                        {log.user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Ticket: <strong className="font-mono text-primary">{log.ticketCustomId}</strong> — <span className="font-semibold">{log.ticketTitle}</span>
                  </div>
                  <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
                    <span>Status transitioned:</span>
                    <span className="text-slate-400 font-semibold">{log.previous_status || 'null'}</span>
                    <span>&rarr;</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(log.new_status)}`}>
                      {log.new_status}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 border-dashed p-3 rounded-sm italic leading-relaxed">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
