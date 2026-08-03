import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CreateTicket = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await axios.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const createdTicket = response.data;
      navigate(`/tickets/${createdTicket.ticket_id || createdTicket.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 w-full text-left">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Support Ticket</h2>
        <p className="text-sm text-slate-500">Report technical issues or client requests to the development queue</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm text-xs">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Ticket Title / Client Summary
            </label>
            <input
              type="text"
              className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              placeholder="Brief summary of the issue (e.g. Printer offline in Room 204)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Detailed Description
            </label>
            <textarea
              className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              rows="6"
              placeholder="Provide context, reproduction steps, client logs, error messages..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Priority Rating
              </label>
              <select
                className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 bg-white"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Attach File (Log/Screenshot)
              </label>
              <input
                type="file"
                className="w-full text-sm border border-slate-300 rounded-sm px-3.5 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                onChange={handleFileChange}
              />
            </div>
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
              onClick={() => navigate('/tickets')}
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
