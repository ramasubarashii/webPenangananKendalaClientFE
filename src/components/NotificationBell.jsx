import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  Ticket,
  ArrowUpRight,
  ArrowRightCircle,
  UserCheck,
  AlertCircle,
  CheckCheck,
  Inbox,
} from 'lucide-react';
import { useNotifications } from '../NotificationContext';

const typeConfig = {
  new_ticket: {
    icon: Ticket,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    border: 'border-blue-100',
  },
  escalated: {
    icon: ArrowRightCircle,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    dot: 'bg-violet-500',
    border: 'border-violet-100',
  },
  assigned: {
    icon: UserCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
    border: 'border-amber-100',
  },
  escalated_owner: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    dot: 'bg-red-500',
    border: 'border-red-100',
  },
  client_update: {
    icon: ArrowUpRight,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    border: 'border-emerald-100',
  },
};

const NotificationItem = ({ notif, onNavigate }) => {
  const config = typeConfig[notif.type] || typeConfig.new_ticket;
  const Icon = config.icon;

  return (
    <button
      onClick={() => onNavigate(notif)}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150
        hover:bg-slate-50/80 border-b border-slate-100 last:border-0 group
        ${notif.read ? 'opacity-55' : 'bg-white'}`}
    >
      {/* Unread indicator stripe */}
      {!notif.read && (
        <span className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r ${config.dot}`} />
      )}

      {/* Type icon */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 border ${config.bg} ${config.border}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-xs font-bold leading-tight ${notif.read ? 'text-slate-500' : 'text-slate-800'}`}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className={`shrink-0 w-2 h-2 rounded-full mt-1 ${config.dot}`} />
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2 font-medium">
          {notif.body}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {notif.relativeTime}
        </p>
      </div>
    </button>
  );
};

export const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead, markOneRead, relativeTime } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleNavigate = (notif) => {
    markOneRead(notif.id);
    setOpen(false);
    navigate(notif.ticketPath);
  };

  // Enrich notifications with relativeTime string
  const enriched = notifications.map((n) => ({
    ...n,
    relativeTime: relativeTime(n.timestamp),
  }));

  const hasUnread = unreadCount > 0;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button — glass-style pill for fixed top-right */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((v) => !v)}
        title="Notifikasi"
        aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-full border
          shadow-sm backdrop-blur-sm transition-all duration-200 cursor-pointer text-sm font-semibold
          ${
            open
              ? 'bg-white border-primary/30 text-primary shadow-primary/10'
              : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:shadow-md'
          }`}
      >
        {hasUnread ? (
          <BellRing className="w-4.5 h-4.5 text-amber-500" style={{ animation: 'wiggle 0.6s ease-in-out' }} />
        ) : (
          <Bell className="w-4 h-4" />
        )}

        {/* Badge label if unread */}
        {hasUnread && (
          <span className="text-[11px] font-extrabold text-red-500 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Animated dot for new notifications */}
        {hasUnread && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
            style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
          />
        )}
      </button>

      {/* Dropdown Panel — opens to the LEFT since bell is at top-right */}
      {open && (
        <div
          id="notification-panel"
          className="absolute top-full right-0 mt-2.5 w-84 max-h-[480px]
            bg-white rounded-xl border border-slate-200/80
            shadow-2xl shadow-slate-300/30
            flex flex-col overflow-hidden"
          style={{
            width: '336px',
            animation: 'slide-in-from-top 150ms ease-out both',
          }}
        >
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold text-slate-800 font-display">Notifikasi</span>
              {hasUnread && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-extrabold rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            {hasUnread && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai Dibaca
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 relative">
            {enriched.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-14 px-4 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Inbox className="w-7 h-7 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">Semua terkini</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tidak ada notifikasi baru saat ini
                  </p>
                </div>
              </div>
            ) : (
              enriched.map((n) => (
                <NotificationItem key={n.id} notif={n} onNavigate={handleNavigate} />
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 shrink-0 bg-slate-50/40 flex items-center justify-between">
            <p className="text-[10px] text-slate-400">
              Diperbarui otomatis setiap 15 detik
            </p>
            {enriched.length > 0 && (
              <p className="text-[10px] text-slate-400 font-medium">
                {enriched.length} notifikasi
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
