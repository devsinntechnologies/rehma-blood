"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { BASE_URL } from "@/contant";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  fetchUnreadCount,
  setUnreadCount,
  upsertNotification,
  type NotificationItem,
} from "@/store/notificationsSlice";

type SocketUnreadCountPayload = { unreadCount: number };

const notificationsUrl = `${BASE_URL.replace(/\/$/, "")}/notifications`;

export function useNotifications() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const notificationsState = useAppSelector((state) => state.notifications);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (notificationsState.status === "idle") {
      dispatch(fetchNotifications());
    }

    if (notificationsState.countStatus === "idle") {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, notificationsState.countStatus, notificationsState.status, token]);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(notificationsUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { token: `Bearer ${token}` });
    });

    socket.on("notification:new", (notification: NotificationItem) => {
      dispatch(upsertNotification(notification));
    });

    socket.on("notification:updated", (notification: NotificationItem) => {
      dispatch(upsertNotification(notification));
      dispatch(fetchUnreadCount());
    });

    socket.on("notification:unread-count", (payload: SocketUnreadCountPayload | number) => {
      if (typeof payload === "number") {
        dispatch(setUnreadCount(payload));
        return;
      }

      dispatch(setUnreadCount(payload.unreadCount));
    });

    socket.on("disconnect", () => {
      socketRef.current = null;
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, token]);

  return notificationsState;
}
