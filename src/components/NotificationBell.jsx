import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  Ticket,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
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
  },
  escalated: {
    icon: ArrowRightCircle,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    dot: 'bg-violet-500',
  },
  assigned: {
    icon: UserCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  escalated_owner: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    dot: 'bg-red-500',
  },
  client_update: {
    icon: ArrowUpRight,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
};

const NotificationItem = ({ notif, onNavigate }) => {
  const config = typeConfig[notif.type] || typeConfig.new_ticket;
  const Icon = config.icon;

  return (
    <button
      onClick={() => onNavigate(notif)}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 hover:bg-slate-50 border-b border-slate-100/80 last:border-0 group ${
        notif.read ? 'opacity-60' : ''
      }`}
    >
      {/* Type icon */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${config.bg}`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-slate-800 leading-tight truncate">
            {notif.title}
          </p>
          {!notif.read && (
            <span className={`shrink-0 w-2 h-2 rounded-full mt-1 ${config.dot}`} />
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
          {notif.body}
        </p>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">
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
    <div ref={panelRef} className="relative shrink-0">
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((v) => !v)}
        title="Notifikasi"
        aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
        className={`relative p-2 rounded-lg transition-all duration-200 cursor-pointer
          ${
            open
              ? 'bg-primary/10 text-primary'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
      >
        {hasUnread ? (
          <BellRing className="w-5 h-5 animate-[wiggle_0.5s_ease-in-out]" />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {/* Unread Badge */}
        {hasUnread && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1
              bg-red-500 text-white text-[9px] font-extrabold rounded-full
              flex items-center justify-center leading-none shadow-sm
              animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          id="notification-panel"
          className="absolute top-full right-0 mt-2 w-80 max-h-[420px]
            bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/60
            flex flex-col z-50 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ transform: 'translateX(0)' }}
        >
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-800">Notifikasi</span>
              {hasUnread && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>
            {hasUnread && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {enriched.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 px-4 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">Tidak ada notifikasi</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Semua tiket sudah terkini
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
          {enriched.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 shrink-0 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 text-center">
                Notifikasi otomatis diperbarui setiap 15 detik
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
