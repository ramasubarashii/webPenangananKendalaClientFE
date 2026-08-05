import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const OwnerDashboard = ({
  tickets,
  selectedTicket,
  setSelectedTicket
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const getStats = () => {
    const stats = {
      awaitingDecision: 0,
      awaitingApproval: 0,
      resolved: 0
    };

    tickets.forEach(ticket => {
      const status = (ticket.status || '').toLowerCase();

      if (['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation'].includes(status) || /escalation|decision/.test(status)) {
        stats.awaitingDecision++;
      }

      if (['pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(status) || /approval|persetujuan|review/.test(status)) {
        stats.awaitingApproval++;
      }

      if (status === 'closed' || status === 'resolved') {
        stats.resolved++;
      }
    });

    return stats;
  };

  const stats = getStats();

  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) {
        setSelectedTicket(updated);
      }
    }
  }, [tickets, selectedTicket, setSelectedTicket]);

  const getStatusCategory = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower === 'open') return 'Open';
    if (lower === 'assigned' || lower === 'in_progress') return 'In Progress';
    if (['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation', 'pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(lower) || /escalation|approval|review|decision/.test(lower)) {
      return 'Escalated';
    }
    if (lower === 'closed' || lower === 'resolved') return 'Closed';
    return 'Other';
  };

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tickets.filter(ticket => {
      const matchesQuery = [ticket.ticket_id, ticket.title, ticket.creator?.name]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'All' || getStatusCategory(ticket.status) === statusFilter;
      return (!query || matchesQuery) && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / rowsPerPage));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const hasAttentionIndicator = (ticket) => {
    const lower = (ticket.status || '').toLowerCase();
    return ['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation', 'pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(lower) || /escalation|approval|decision/.test(lower);
  };

  const getStatusBadgeClass = (status) => {
    const lower = (status || '').toLowerCase();
    if (['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation'].includes(lower) || /escalation|decision/.test(lower)) {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    }
    if (['pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(lower) || /approval|persetujuan|review/.test(lower)) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
    if (lower === 'in_progress' || lower === 'assigned') return 'bg-sky-50 text-sky-700 border border-sky-100';
    if (lower === 'closed' || lower === 'resolved') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (lower === 'open') return 'bg-slate-100 text-slate-700 border border-slate-200';
    return 'bg-slate-50 text-slate-700 border border-slate-100';
  };

  const renderActionButtons = (ticket) => {
    const status = (ticket.status || '').toLowerCase();
    const isEscalation = ['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation'].includes(status) || /escalation|decision/.test(status);
    const isApproval = ['pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(status) || /approval|persetujuan|review/.test(status);

    if (isEscalation) {
      return (
        <button
          onClick={() => setSelectedTicket(ticket)}
          className="rounded-full bg-amber-500 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-amber-600"
        >
          Decide
        </button>
      );
    }

    if (isApproval) {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTicket(ticket)}
            className="rounded-full bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-700"
          >
            Approve
          </button>
          <button
            onClick={() => setSelectedTicket(ticket)}
            className="rounded-full bg-rose-500 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-rose-600"
          >
            Reject
          </button>
        </div>
      );
    }

    return <span className="text-xs text-slate-500">No action</span>;
  };

  const renderStatusLabel = (status) => {
    const lower = (status || '').toLowerCase();
    if (['pending_escalation', 'need_owner_decision', 'awaiting_owner_decision', 'needs_escalation'].includes(lower)) {
      return 'Escalated';
    }
    if (['pending_approval', 'awaiting_final_approval', 'awaiting_approval'].includes(lower)) {
      return 'Pending Approval';
    }
    if (lower === 'in_progress' || lower === 'assigned') return 'In Progress';
    if (lower === 'closed' || lower === 'resolved') return 'Closed';
    return status?.replace('_', ' ') || 'Unknown';
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Owner System Hub</p>
            <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
            <p className="text-sm text-slate-500">Manage escalations, approvals, and ticket flow from one centralized dashboard.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
            <Bell className="h-5 w-5" />
            <span className="text-sm font-semibold">Notifications</span>
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-amber-500">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Awaiting Owner Decision</span>
            </div>
            <p className="mt-6 text-4xl font-extrabold text-amber-600">{stats.awaitingDecision}</p>
            <p className="mt-3 text-sm text-slate-500">Tickets requiring escalation review.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-500">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Awaiting Final Approval</span>
            </div>
            <p className="mt-6 text-4xl font-extrabold text-emerald-600">{stats.awaitingApproval}</p>
            <p className="mt-3 text-sm text-slate-500">Tickets pending your final approval.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-teal-600">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Resolved Tickets</span>
            </div>
            <p className="mt-6 text-4xl font-extrabold text-slate-900">{stats.resolved}</p>
            <p className="mt-3 text-sm text-slate-500">Successfully closed issues across the system.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All System Tickets</h2>
            <p className="text-sm text-slate-500">Search, filter, and act on tickets that require owner attention.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ticket ID, Title, or Client"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Escalated</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-900">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Ticket ID</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Title</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Date Filed</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 align-top font-mono text-xs text-teal-700">
                    <div className="flex items-center gap-2">
                      <span>{ticket.ticket_id || `TCK-${ticket.id}`}</span>
                      {hasAttentionIndicator(ticket) && (
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900 truncate max-w-[280px]">{ticket.title}</td>
                  <td className="px-4 py-4 text-slate-600">{ticket.category || 'General'}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusBadgeClass(ticket.status)}`}>
                      {renderStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-4">{renderActionButtons(ticket)}</td>
                </tr>
              ))}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400">No tickets match the current filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Showing {paginatedTickets.length} of {filteredTickets.length} tickets</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${currentPage === index + 1 ? 'bg-teal-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        {selectedTicket ? (
          <div>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
              <div className="space-y-2">
                <span className={`badge badge-${selectedTicket.priority}`}>{selectedTicket.priority} Priority</span>
                <h2 className="text-2xl font-bold text-slate-900">{selectedTicket.title}</h2>
                <p className="text-sm text-slate-500">Reported by {selectedTicket.creator?.name} on {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : '—'}</p>
              </div>
              <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(selectedTicket.status)}`}>
                {renderStatusLabel(selectedTicket.status)}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
                <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {selectedTicket.attachment_path && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Attachment</h4>
                  <a
                    href={`http://127.0.0.1:8000/storage/${selectedTicket.attachment_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    View Attached File
                  </a>
                </div>
              )}

              {selectedTicket.assignments && selectedTicket.assignments.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Assignment & Resources</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                    <div><strong>Project Manager:</strong> {selectedTicket.assignments[0].pm?.name}</div>
                    <div><strong>Programmer Assigned:</strong> {selectedTicket.assignments[0].programmer?.name}</div>
                    <div><strong>Estimated Allocation:</strong> {selectedTicket.assignments[0].estimated_hours} Hours</div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-4">Operational Progress Logs</h4>
                <div className="space-y-4">
                  {selectedTicket.progress_logs?.map((log, idx) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="block h-2.5 w-2.5 rounded-full bg-teal-600" />
                        {idx !== selectedTicket.progress_logs.length - 1 && <span className="block h-full w-px bg-slate-200 my-2" />}
                      </div>
                      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-800">
                          <strong>{log.user?.name}</strong>
                          <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">
                          Changed status to{' '}
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(log.new_status)}`}>
                            {log.new_status}
                          </span>
                        </p>
                        {log.notes && <p className="mt-3 text-xs text-slate-600 italic">{log.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <span className="text-5xl mb-4">👑</span>
            <p>Select any ticket to audit its historical process logs and assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};
