import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const CreateTicketForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('description', description);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await axios.post('/client/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Support ticket successfully filed!');
      const createdTicket = response.data;
      setTimeout(() => {
        navigate(`/client/tickets/${createdTicket.ticket_id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 w-full text-left">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-primary-hover text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">File Support Ticket</h2>
        <p className="text-sm text-slate-500">Log your system concern and our technical staff will coordinate resolution.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-sm text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Issue Title
            </label>
            <input
              type="text"
              className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              placeholder="e.g. Cannot connect to database portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Issue Category
              </label>
              <select
                className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 bg-white cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Jaringan">Jaringan</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Akun">Akun</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Priority
              </label>
              <select
                className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 bg-white cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Detailed Description
            </label>
            <textarea
              className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              rows="5"
              placeholder="State what went wrong, steps to reproduce, or other context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Upload Screenshot / Log file (Optional)
            </label>
            <input
              type="file"
              className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-4 border-t border-slate-100 pt-6 mt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-sm transition-colors cursor-pointer"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'File Ticket'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
