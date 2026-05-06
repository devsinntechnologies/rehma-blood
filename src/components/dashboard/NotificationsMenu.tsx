"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { markAllNotificationsRead, markNotificationRead } from "@/store/notificationsSlice";
import { useAppDispatch } from "@/store/hooks";

const formatTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function NotificationsMenu() {
  const dispatch = useAppDispatch();
  const { items, unreadCount, status, error } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const notifications = useMemo(() => items, [items]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[color:var(--adm-border)] px-4 py-3">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--adm-fg)]">Notifications</h3>
              <p className="text-[11px] text-[var(--adm-fg-dim)]">Live updates from the notifications socket</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(markAllNotificationsRead())}
              className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--adm-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--adm-fg)] transition-colors hover:bg-[var(--adm-hover)]"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {status === "loading" && (
              <div className="flex items-center gap-2 px-4 py-5 text-sm text-[var(--adm-fg-dim)]">
                <Loader2 size={14} className="animate-spin" /> Loading notifications...
              </div>
            )}

            {status === "failed" && (
              <div className="px-4 py-5 text-sm text-red-500">{error ?? "Unable to load notifications."}</div>
            )}

            {status === "succeeded" && notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-[var(--adm-fg-dim)]">No notifications yet.</div>
            )}

            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => dispatch(markNotificationRead(notification.id))}
                className={`w-full border-b border-[color:var(--adm-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--adm-hover)] ${
                  notification.isRead ? "bg-transparent" : "bg-[var(--adm-surface-2)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.isRead ? "bg-[var(--adm-fg-faint)]" : "bg-red-500"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--adm-fg)]">{notification.title}</p>
                        <p className="mt-0.5 text-[12px] text-[var(--adm-fg-dim)]">{notification.message}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-[var(--adm-fg-faint)]">{formatTime(notification.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--adm-fg-faint)]">
                      {notification.type.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
