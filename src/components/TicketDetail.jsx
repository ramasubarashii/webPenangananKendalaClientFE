import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Clock, 
  Calendar,
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  FileDown
} from 'lucide-react';

export const TicketDetail = () => {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // PM States
  const [programmers, setProgrammers] = useState([]);
  const [selectedProgrammerId, setSelectedProgrammerId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  // Form action status states
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/tickets/${ticketId}`);
      setTicket(response.data);
    } catch (err) {
      console.error("Failed to load ticket details", err);
      setError(err.response?.data?.message || 'Gagal memuat detail tiket.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgrammers = async () => {
    if (user?.role === 'project_manager') {
      try {
        const response = await axios.get('/programmers');
        setProgrammers(response.data);
      } catch (err) {
        console.error('Failed to load developers list', err);
      }
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (ticket && user) {
      fetchProgrammers();
    }
  }, [ticket, user]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!selectedProgrammerId || !estimatedHours) {
      setActionError('Pilih programmer dan isi estimasi jam terlebih dahulu.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/tickets/${ticket.ticket_id}/assign`, {
        programmer_id: selectedProgrammerId,
        estimated_hours: parseFloat(estimatedHours)
      });
      setSelectedProgrammerId('');
      setEstimatedHours('');
      setActionSuccess('Berhasil menugaskan programmer.');
      await fetchTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal menugaskan programmer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionError('');
    setActionSuccess('');

    if (!actionNote.trim()) {
      setActionError('Harap berikan catatan penjelasan untuk pembaruan status.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/tickets/${ticket.ticket_id}/status`, {
        status: newStatus,
        notes: actionNote
      });
      setActionNote('');
      setActionSuccess('Status tiket berhasil diperbarui.');
      await fetchTicket();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal memperbarui status.');
    } finally {
      setSubmitting(false);
    }
  };

  // Action note states (For Programmer or Service Desk updates)
  const [actionNote, setActionNote] = useState('');

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
    return <div className="text-slate-500 text-sm text-left">Memuat detail tiket...</div>;
  }

  // Graceful 404 UI State Screen
  if (error && (error.toLowerCase().includes('tidak ditemukan') || error.toLowerCase().includes('not found') || error.toLowerCase().includes('query results'))) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center flex flex-col items-center gap-4 bg-white p-8 border border-slate-200 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 shrink-0" />
        <h2 className="text-xl font-bold text-slate-900">Tiket Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Tiket dengan ID "{ticketId}" tidak terdaftar di sistem kami.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="w-full py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
        >
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center flex flex-col items-center gap-4 bg-white p-8 border border-slate-200 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 shrink-0" />
        <h2 className="text-xl font-bold text-slate-900">Terjadi Kesalahan</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="w-full py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!ticket) return <div className="text-slate-500 text-sm text-left">Tiket tidak ditemukan.</div>;

  const currentAssignment = ticket.assignments?.[0];
  const isAssignedProgrammer = user?.role === 'programmer' && currentAssignment?.programmer_id === user.id;

  return (
    <div className="max-w-4xl mx-auto w-full text-left flex flex-col gap-6">
      
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-primary-hover text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke halaman sebelumnya</span>
        </button>
      </div>

      {/* Header Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex justify-between items-start shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs font-bold text-primary bg-primary-tint py-0.5 px-2 rounded-sm border border-primary/10">
              {ticket.ticket_id || `TCK-OLD-${ticket.id}`}
            </span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(ticket.priority)}`}>
              {ticket.priority} Priority
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">{ticket.title}</h2>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Dilaporkan oleh {ticket.creator?.name}</span>
            <span className="text-slate-300">|</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(ticket.created_at).toLocaleString()}</span>
          </p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
          {ticket.status.replace('_', ' ')}
        </span>
      </div>

      {/* Inline Forms Status Notifications */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-4 rounded-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Deskripsi Masalah</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 border border-slate-200 border-dashed p-4 rounded-sm">
              {ticket.description}
            </p>
            
            {ticket.attachment_path && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center">
                <a
                  href={`http://127.0.0.1:8000/storage/${ticket.attachment_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Unduh Lampiran Berkas</span>
                </a>
              </div>
            )}
          </div>

          {/* Timeline Logs */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Proses Log & Riwayat Audit</h3>
            <div className="flex flex-col gap-5">
              {ticket.progress_logs?.map((log, idx) => (
                <div key={log.id} className="flex gap-4 text-xs text-left">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                    {idx !== ticket.progress_logs.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 font-bold">{log.user?.name}</strong>
                      <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Role: {log.user?.role?.replace('_', ' ')}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span>Status berubah ke:</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(log.new_status)}`}>
                        {log.new_status}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-sm italic leading-relaxed">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Assignment Info */}
          {currentAssignment && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resource Allocation</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Project Manager
                  </span>
                  <span className="font-bold text-slate-800">{currentAssignment.pm?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Assigned Developer
                  </span>
                  <span className="font-bold text-slate-800">{currentAssignment.programmer?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Estimated Effort
                  </span>
                  <span className="font-bold text-slate-800">{currentAssignment.estimated_hours} Hours</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Sections */}
          
          {/* PM Resource Assignment */}
          {user?.role === 'project_manager' && ticket.status === 'open' && (
            <div className="bg-white border border-primary/20 bg-primary-tint/10 rounded-lg p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Allocate Resource (PM)</h3>
              
              <form onSubmit={handleAssign} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Developer
                  </label>
                  <select
                    className="w-full text-xs border border-slate-300 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-primary"
                    value={selectedProgrammerId}
                    onChange={(e) => setSelectedProgrammerId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Programmer --</option>
                    {programmers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="w-full text-xs border border-slate-300 rounded-sm px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="e.g. 8.0"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? 'Assigning...' : 'Assign Programmer'}
                </button>
              </form>
            </div>
          )}

          {/* Programmer Task Updates */}
          {user?.role === 'programmer' && isAssignedProgrammer && (ticket.status === 'assigned' || ticket.status === 'in_progress') && (
            <div className="bg-white border border-primary/10 bg-primary-tint/20 rounded-lg p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Update Sprint Task</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Task Logs / Notes
                </label>
                <textarea
                  className="w-full text-xs border border-slate-300 rounded-sm px-3 py-2 focus:outline-none focus:border-primary"
                  rows="3"
                  placeholder={ticket.status === 'assigned' ? "Tulis analisis awal..." : "Tulis progres pengerjaan kode & testing..."}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  required
                />
              </div>

              {ticket.status === 'assigned' ? (
                <button
                  onClick={() => handleStatusUpdate('in_progress')}
                  className="w-full py-2 bg-[#48626e] hover:bg-[#304a55] text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Start Work (In Progress)'}
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? 'Resolving...' : 'Mark as Resolved (Done)'}
                </button>
              )}
            </div>
          )}

          {/* Service Desk Close / Reject Actions */}
          {user?.role === 'service_desk' && ticket.status === 'resolved' && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Client Verification</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Programmer telah menyelesaikan tiket. Lakukan verifikasi ke klien dan perbarui status.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Verification Logs
                </label>
                <textarea
                  className="w-full text-xs border border-slate-300 rounded-sm px-3 py-2 focus:outline-none focus:border-primary"
                  rows="3"
                  placeholder="Catatan konfirmasi atau komplain penolakan dari client..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  Close Ticket
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Empty Actions Block */}
          {(!user || 
            (user.role === 'programmer' && !isAssignedProgrammer && (ticket.status === 'assigned' || ticket.status === 'in_progress')) ||
            (user.role === 'service_desk' && ticket.status !== 'resolved') ||
            (user.role === 'project_manager' && ticket.status !== 'open') ||
            (user.role === 'owner') ||
            (ticket.status === 'closed' || ticket.status === 'rejected')
          ) && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
              <span>Tidak ada tindakan tersedia.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
