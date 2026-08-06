import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const AssignTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data.filter(t => t.status === 'open'));
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);



  if (loading) {
    return <div className="text-slate-500 text-sm text-left">Loading unassigned queue...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 text-left w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Resource Allocation Queue</h2>
        <p className="text-sm text-slate-500">Tickets in the queue pending PM assignment and hour estimation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500 col-span-2 text-sm">
            No tickets currently require assignment.
          </div>
        ) : (
          tickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200 rounded-lg flex overflow-hidden hover:border-primary hover:bg-primary-tint transition-all duration-150 text-left"
            >


              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="font-mono text-xs font-bold text-primary bg-primary-tint/50 px-2 py-0.5 rounded-sm">
                      {ticket.ticket_id || `TCK-OLD-${ticket.id}`}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 truncate">{ticket.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-normal">{ticket.description}</p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>Reported By: {ticket.creator?.name}</span>
                  <Link
                    to={`/tickets/${ticket.ticket_id || ticket.id}`}
                    className="py-1.5 px-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Allocate Resource
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
