"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Archive,
  CheckCheck,
  Loader2,
  MessageSquarePlus,
  Paperclip,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { BASE_URL } from "@/contant";
import { useAppSelector } from "@/store/hooks";
import {
  createChatConversation,
  fetchChatConversations,
  fetchChatMessages,
  fetchChatUnreadCount,
  markChatConversationRead,
  sendChatMessage,
  updateChatConversationState,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chatApi";

const chatSocketUrl = `${BASE_URL.replace(/\/$/, "")}/chat`;

const formatTime = (value: string | null | undefined) => {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatConversationTime = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();
  const day = 24 * 60 * 60 * 1000;

  if (diff < day) {
    return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
  }

  if (diff < 7 * day) {
    return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const buildInitials = (label: string) =>
  label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";

const getConversationLabel = (conversation: ChatConversation, adminId: number | null) => {
  if (conversation.title?.trim()) {
    return conversation.title.trim();
  }

  const otherParticipants = conversation.participants.filter((participant) => participant.role !== "superadmin" || participant.userId !== adminId);
  const names = otherParticipants.map((participant) => participant.displayName).filter(Boolean);

  if (names.length > 0) {
    return names.join(", ");
  }

  return `Conversation #${conversation.id}`;
};

const getConversationMeta = (conversation: ChatConversation) => {
  const parts: string[] = [conversation.type];

  if (conversation.contextType) {
    parts.push(conversation.contextType);
  }

  if (conversation.contextId != null) {
    parts.push(String(conversation.contextId));
  }

  return parts.filter(Boolean).join(" · ");
};

const mergeConversation = (items: ChatConversation[], incoming: ChatConversation) => {
  const index = items.findIndex((item) => item.id === incoming.id);

  if (index >= 0) {
    const next = [...items];
    next[index] = incoming;
    return next.sort((left, right) => {
      const leftAt = new Date(left.lastMessageAt ?? left.updatedAt).getTime();
      const rightAt = new Date(right.lastMessageAt ?? right.updatedAt).getTime();
      return rightAt - leftAt;
    });
  }

  return [incoming, ...items].sort((left, right) => {
    const leftAt = new Date(left.lastMessageAt ?? left.updatedAt).getTime();
    const rightAt = new Date(right.lastMessageAt ?? right.updatedAt).getTime();
    return rightAt - leftAt;
  });
};

const syncConversationWithMessage = (items: ChatConversation[], message: ChatMessage, currentAdminId: number | null) => {
  const existing = items.find((item) => item.id === message.conversationId);

  if (!existing) {
    return items;
  }

  const nextPreview = message.body?.trim() || message.attachments[0]?.originalName || "Attachment";
  const isCurrentAdminMessage = message.senderRole === "superadmin" && (currentAdminId == null || message.senderUserId === currentAdminId);

  return mergeConversation(items, {
    ...existing,
    lastMessageId: message.id,
    lastMessagePreview: nextPreview,
    lastMessageAt: message.createdAt,
    updatedAt: message.createdAt,
    unreadCount: isCurrentAdminMessage ? existing.unreadCount : existing.unreadCount + 1,
    isTyping: false,
  });
};

const upsertMessage = (items: ChatMessage[], incoming: ChatMessage) => {
  const index = items.findIndex((item) => item.id === incoming.id);

  if (index >= 0) {
    const next = [...items];
    next[index] = incoming;
    return next;
  }

  return [...items, incoming].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
};

export default function MessagesPage() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const adminId = useAppSelector((state) => state.auth.superAdmin?.id ?? null);

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [typingUserIds, setTypingUserIds] = useState<number[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationRole, setNewConversationRole] = useState<"donor" | "user">("donor");
  const [newConversationUserId, setNewConversationUserId] = useState("");
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [newConversationContextType, setNewConversationContextType] = useState("");
  const [newConversationContextId, setNewConversationContextId] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const selectedConversationRef = useRef<number | null>(null);
  const joinedConversationRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeConversationId = selectedConversationId && conversations.some((conversation) => conversation.id === selectedConversationId)
    ? selectedConversationId
    : conversations[0]?.id ?? null;
  const selectedConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const label = getConversationLabel(conversation, adminId).toLowerCase();
      const preview = (conversation.lastMessagePreview ?? "").toLowerCase();
      const meta = getConversationMeta(conversation).toLowerCase();

      return label.includes(query) || preview.includes(query) || meta.includes(query);
    });
  }, [adminId, conversations, search]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const applyConversationUpdate = (incoming: ChatConversation) => {
    setConversations((current) => mergeConversation(current, incoming));
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const loadConversations = async () => {
      setIsLoadingConversations(true);
      setConversationError(null);

      try {
        const [conversationItems, totalUnreadCount] = await Promise.all([fetchChatConversations(token), fetchChatUnreadCount(token)]);

        if (cancelled) {
          return;
        }

        setConversations(conversationItems);
        setUnreadCount(totalUnreadCount);

        if (conversationItems.length > 0) {
          setSelectedConversationId((current) => current ?? conversationItems[0].id);
        } else {
          setSelectedConversationId(null);
          setMessages([]);
        }
      } catch (error) {
        if (!cancelled) {
          setConversationError(error instanceof Error ? error.message : "Unable to load chat conversations.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConversations(false);
        }
      }
    };

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !activeConversationId) {
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      setMessageError(null);
      setTypingUserIds([]);

      try {
        const response = await fetchChatMessages(token, activeConversationId);

        if (cancelled) {
          return;
        }

        setMessages(response.items);

        const lastReadMessageId = response.items[response.items.length - 1]?.id ?? null;
        const readResult = await markChatConversationRead(token, activeConversationId, lastReadMessageId);

        if (cancelled) {
          return;
        }

        setUnreadCount(readResult.unreadCount);
        applyConversationUpdate(readResult.conversation);
      } catch (error) {
        if (!cancelled) {
          setMessageError(error instanceof Error ? error.message : "Unable to load messages for this conversation.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [activeConversationId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      joinedConversationRef.current = null;
      return;
    }

    const socket = io(chatSocketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const joinSelectedConversation = () => {
      const currentConversationId = selectedConversationRef.current;

      if (!socket.connected || !currentConversationId) {
        return;
      }

      if (joinedConversationRef.current && joinedConversationRef.current !== currentConversationId) {
        socket.emit("chat:leave", { conversationId: joinedConversationRef.current });
      }

      socket.emit("chat:join", { conversationId: currentConversationId });
      joinedConversationRef.current = currentConversationId;
    };

    socket.on("connect", () => {
      setSocketStatus("connected");
      joinSelectedConversation();
    });

    socket.on("disconnect", () => {
      setSocketStatus("disconnected");
      joinedConversationRef.current = null;
    });

    socket.on("chat:connected", (payload: { unreadCount: number }) => {
      setUnreadCount(payload.unreadCount ?? 0);
    });

    socket.on("chat:message", (incoming: ChatMessage) => {
      setConversations((current) => syncConversationWithMessage(current, incoming, adminId));

      if (incoming.conversationId === selectedConversationRef.current) {
        setMessages((current) => upsertMessage(current, incoming));
      }
    });

    socket.on("chat:conversation-updated", (incoming: ChatConversation) => {
      applyConversationUpdate(incoming);

      if (incoming.id === selectedConversationRef.current && incoming.isTyping === false) {
        setTypingUserIds([]);
      }
    });

    socket.on("chat:unread-count", (payload: number | { unreadCount: number }) => {
      if (typeof payload === "number") {
        setUnreadCount(payload);
        return;
      }

      setUnreadCount(payload.unreadCount ?? 0);
    });

    socket.on("chat:typing", (payload: { conversationId: number; userId: number; isTyping: boolean }) => {
      if (payload.conversationId !== selectedConversationRef.current) {
        return;
      }

      if (payload.userId === adminId) {
        return;
      }

      setTypingUserIds((current) => {
        if (payload.isTyping) {
          if (current.includes(payload.userId)) {
            return current;
          }

          return [...current, payload.userId];
        }

        return current.filter((userId) => userId !== payload.userId);
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      joinedConversationRef.current = null;
    };
  }, [adminId, token]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !socket.connected || !activeConversationId) {
      return;
    }

    if (joinedConversationRef.current && joinedConversationRef.current !== activeConversationId) {
      socket.emit("chat:leave", { conversationId: joinedConversationRef.current });
    }

    socket.emit("chat:join", { conversationId: activeConversationId });
    joinedConversationRef.current = activeConversationId;
  }, [activeConversationId, socketStatus]);

  const handleConversationSelect = (conversationId: number) => {
      setSelectedConversationId(conversationId);
    setMessageError(null);
    setTypingUserIds([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setAttachments((current) => [...current, ...nextFiles]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (fileIndex: number) => {
    setAttachments((current) => current.filter((_, index) => index !== fileIndex));
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !activeConversationId) {
      return;
    }

    const body = draft.trim();

    if (!body && attachments.length === 0) {
      return;
    }

    setIsSending(true);
    setMessageError(null);

    try {
      const createdMessage = await sendChatMessage(token, activeConversationId, { body }, attachments);
      setMessages((current) => upsertMessage(current, createdMessage));
      setConversations((current) => syncConversationWithMessage(current, createdMessage, adminId));
      setDraft("");
      setAttachments([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      scrollToBottom();
    } catch (error) {
      setMessageError(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateConversation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || adminId == null) {
      setConversationError("Sign in again to create a chat conversation.");
      return;
    }

    const participantUserId = Number(newConversationUserId);
    const contextId = newConversationContextId.trim() ? Number(newConversationContextId) : undefined;

    if (!Number.isInteger(participantUserId) || participantUserId <= 0) {
      setConversationError("Enter a valid donor or user ID.");
      return;
    }

    setIsLoadingConversations(true);
    setConversationError(null);

    try {
      const createdConversation = await createChatConversation(token, {
        type: "direct",
        title: newConversationTitle.trim() || undefined,
        contextType: newConversationContextType.trim() || undefined,
        contextId: Number.isFinite(contextId) ? contextId : undefined,
        participants: [
          { role: "superadmin", userId: adminId },
          { role: newConversationRole, userId: participantUserId },
        ],
      });

      setConversations((current) => mergeConversation(current, createdConversation));
      setSelectedConversationId(createdConversation.id);
      setShowNewConversation(false);
      setNewConversationTitle("");
      setNewConversationContextType("");
      setNewConversationContextId("");
      setNewConversationUserId("");
      setNewConversationRole("donor");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "Unable to create the conversation.");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleToggleArchive = async () => {
    if (!token || !selectedConversation) {
      return;
    }

    try {
      const updated = await updateChatConversationState(token, selectedConversation.id, {
        archived: !selectedConversation.archived,
      });

      applyConversationUpdate(updated);
    } catch (error) {
      setMessageError(error instanceof Error ? error.message : "Unable to update archive state.");
    }
  };

  const handleToggleMute = async () => {
    if (!token || !selectedConversation) {
      return;
    }

    try {
      const updated = await updateChatConversationState(token, selectedConversation.id, {
        muted: !selectedConversation.muted,
      });

      applyConversationUpdate(updated);
    } catch (error) {
      setMessageError(error instanceof Error ? error.message : "Unable to update mute state.");
    }
  };

  const handleMarkRead = async () => {
    if (!token || !activeConversationId) {
      return;
    }

    try {
      const result = await markChatConversationRead(token, activeConversationId, messages[messages.length - 1]?.id ?? null);
      setUnreadCount(result.unreadCount);
      applyConversationUpdate(result.conversation);
    } catch (error) {
      setMessageError(error instanceof Error ? error.message : "Unable to mark the conversation as read.");
    }
  };

  const conversationTypingLabel = selectedConversation
    ? typingUserIds.length > 0
      ? `${typingUserIds.length} participant${typingUserIds.length === 1 ? " is" : "s are"} typing...`
      : selectedConversation.isTyping
        ? "Someone is typing..."
        : selectedConversation.muted
          ? "Muted"
          : selectedConversation.archived
            ? "Archived"
            : "Online"
    : "No conversation selected";

  const selectedConversationLabel = selectedConversation ? getConversationLabel(selectedConversation, adminId) : "Select a conversation";

  return (
    <div className="flex h-full flex-col gap-5 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[24px] font-bold text-[var(--adm-fg)]">Messages</h1>
          <p className="text-[14px] text-[var(--adm-fg-faint)]">Live chat with donors and requesters through the backend chat module.</p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-4 py-2 text-[12px] text-[var(--adm-fg-dim)] shadow-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${socketStatus === "connected" ? "bg-emerald-500" : socketStatus === "connecting" ? "bg-amber-500" : "bg-slate-400"}`}
          />
          <span className="font-medium capitalize">{socketStatus}</span>
          <span className="text-[var(--adm-fg-faint)]">{unreadCount} unread</span>
        </div>
      </div>

      {(conversationError || messageError) && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-700">
          {conversationError ?? messageError}
        </div>
      )}

      <div className="grid min-h-[640px] flex-1 overflow-hidden rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex flex-col border-r border-[color:var(--adm-border)] bg-[var(--adm-surface)]">
          <div className="border-b border-[color:var(--adm-border)] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] py-2 pl-9 pr-3 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:border-[var(--adm-accent)] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNewConversation((current) => !current)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--adm-accent)] px-3 text-[13px] font-semibold text-white transition-all hover:opacity-90"
              >
                <MessageSquarePlus size={15} />
                New
              </button>
            </div>

            {showNewConversation ? (
              <form onSubmit={handleCreateConversation} className="space-y-3 rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] p-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-[12px] font-medium text-[var(--adm-fg-dim)]">
                    <span>Participant role</span>
                    <select
                      value={newConversationRole}
                      onChange={(event) => setNewConversationRole(event.target.value as "donor" | "user")}
                      className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[13px] text-[var(--adm-fg)] focus:border-[var(--adm-accent)] focus:outline-none"
                    >
                      <option value="donor">Donor</option>
                      <option value="user">User</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-[12px] font-medium text-[var(--adm-fg-dim)]">
                    <span>Participant ID</span>
                    <input
                      type="number"
                      value={newConversationUserId}
                      onChange={(event) => setNewConversationUserId(event.target.value)}
                      placeholder="45"
                      className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:border-[var(--adm-accent)] focus:outline-none"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-[12px] font-medium text-[var(--adm-fg-dim)]">
                    <span>Title</span>
                    <input
                      type="text"
                      value={newConversationTitle}
                      onChange={(event) => setNewConversationTitle(event.target.value)}
                      placeholder="Chat with donor"
                      className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:border-[var(--adm-accent)] focus:outline-none"
                    />
                  </label>

                  <label className="space-y-1 text-[12px] font-medium text-[var(--adm-fg-dim)]">
                    <span>Context ID</span>
                    <input
                      type="number"
                      value={newConversationContextId}
                      onChange={(event) => setNewConversationContextId(event.target.value)}
                      placeholder="42"
                      className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:border-[var(--adm-accent)] focus:outline-none"
                    />
                  </label>
                </div>

                <label className="space-y-1 text-[12px] font-medium text-[var(--adm-fg-dim)]">
                  <span>Context type</span>
                  <input
                    type="text"
                    value={newConversationContextType}
                    onChange={(event) => setNewConversationContextType(event.target.value)}
                    placeholder="blood_request"
                    className="w-full rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:border-[var(--adm-accent)] focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--adm-accent)] px-3 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoadingConversations}
                >
                  {isLoadingConversations ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  Create direct chat
                </button>
              </form>
            ) : null}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoadingConversations ? (
              <div className="flex h-full items-center justify-center p-8 text-[13px] text-[var(--adm-fg-dim)]">
                <Loader2 size={18} className="mr-2 animate-spin" />
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-[13px] text-[var(--adm-fg-dim)]">
                <MessageSquarePlus size={26} className="text-[var(--adm-fg-faint)]" />
                <p className="font-semibold text-[var(--adm-fg)]">No conversations yet</p>
                <p>Start one from the form above or wait for the first message to arrive.</p>
              </div>
            ) : (
              <div className="divide-y divide-[color:var(--adm-border)]">
                {filteredConversations.map((conversation) => {
                  const label = getConversationLabel(conversation, adminId);
                  const active = conversation.id === activeConversationId;
                  const avatar = buildInitials(label);

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => handleConversationSelect(conversation.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--adm-hover)] ${active ? "bg-[var(--adm-hover)]" : ""}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--adm-accent-soft-border)] bg-[var(--adm-accent-soft-bg)] text-[12px] font-bold text-[var(--adm-accent)]">
                        {avatar}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center justify-between gap-2">
                          <span className={`truncate text-[13px] font-semibold ${active ? "text-[var(--adm-accent)]" : "text-[var(--adm-fg)]"}`}>{label}</span>
                          <span className="shrink-0 text-[10px] text-[var(--adm-fg-dim)]">{formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt)}</span>
                        </div>

                        <p className="truncate text-[12px] text-[var(--adm-fg-dim)]">
                          {conversation.lastMessagePreview ?? (getConversationMeta(conversation) || "No messages yet")}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--adm-fg-faint)]">
                          <span className="rounded-full bg-[var(--adm-surface-2)] px-2 py-1 uppercase tracking-wide">{conversation.type}</span>
                          {conversation.archived ? <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-600">Archived</span> : null}
                          {conversation.muted ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Muted</span> : null}
                        </div>
                      </div>

                      {conversation.unreadCount > 0 ? (
                        <div className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--adm-accent)] px-1.5 text-[10px] font-bold text-white">
                          {conversation.unreadCount}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col bg-[var(--adm-bg)]">
          {selectedConversation ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--adm-border)] bg-[var(--adm-surface-2)]/40 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--adm-accent-soft-border)] bg-[var(--adm-accent-soft-bg)] text-[12px] font-bold text-[var(--adm-accent)]">
                    {buildInitials(selectedConversationLabel)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-[var(--adm-fg)]">{selectedConversationLabel}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--adm-fg-dim)]">
                      <span>{getConversationMeta(selectedConversation)}</span>
                      <span>·</span>
                      <span>{conversationTypingLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleArchive}
                    className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[12px] font-medium text-[var(--adm-fg)] transition-colors hover:bg-[var(--adm-hover)]"
                  >
                    <Archive size={14} />
                    {selectedConversation.archived ? "Unarchive" : "Archive"}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2 text-[12px] font-medium text-[var(--adm-fg)] transition-colors hover:bg-[var(--adm-hover)]"
                  >
                    {selectedConversation.muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    {selectedConversation.muted ? "Unmute" : "Mute"}
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkRead}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--adm-accent)] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:opacity-90"
                    disabled={!token || !activeConversationId}
                  >
                    <RefreshCcw size={14} />
                    Mark read
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5">
                {isLoadingMessages ? (
                  <div className="flex h-full items-center justify-center gap-2 py-20 text-[13px] text-[var(--adm-fg-dim)]">
                    <Loader2 size={18} className="animate-spin" />
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center text-[13px] text-[var(--adm-fg-dim)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--adm-surface)] text-[var(--adm-accent)] shadow-sm">
                      <MessageSquarePlus size={20} />
                    </div>
                    <p className="font-semibold text-[var(--adm-fg)]">No messages yet</p>
                    <p>Send the first message to start the conversation.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((message) => {
                      const isMine = message.senderRole === "superadmin" && (adminId == null || message.senderUserId === adminId);

                      return (
                        <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[min(720px,82%)] rounded-2xl px-4 py-3 shadow-sm ${isMine ? "rounded-tr-sm bg-[var(--adm-accent)] text-white" : "rounded-tl-sm border border-[color:var(--adm-border)] bg-[var(--adm-surface)] text-[var(--adm-fg)]"}`}>
                            <div className="mb-1 flex items-center justify-between gap-3 text-[11px] opacity-80">
                              <span className="font-semibold">{isMine ? "You" : message.senderName}</span>
                              <span>{formatTime(message.createdAt)}</span>
                            </div>

                            {message.body ? <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{message.body}</p> : null}

                            {message.attachments.length > 0 ? (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => {
                                  const attachmentUrl = attachment.url.startsWith("http") ? attachment.url : `${BASE_URL.replace(/\/$/, "")}${attachment.url}`;

                                  return (
                                    <a
                                      key={attachment.id}
                                      href={attachmentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] transition-colors ${isMine ? "border-white/20 bg-white/10 text-white hover:bg-white/15" : "border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] text-[var(--adm-fg)] hover:bg-[var(--adm-hover)]"}`}
                                    >
                                      <Paperclip size={13} />
                                      <span className="truncate">{attachment.originalName}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            ) : null}

                            {message.readBy && message.readBy.length > 0 ? (
                              <div className={`mt-2 flex items-center gap-1 text-[10px] ${isMine ? "text-white/70" : "text-[var(--adm-fg-dim)]"}`}>
                                <CheckCheck size={12} />
                                Seen by {message.readBy.length}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-[color:var(--adm-border)] bg-[var(--adm-surface)] px-4 py-4">
                {attachments.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <button
                        key={`${file.name}-${index}`}
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-3 py-1.5 text-[12px] text-[var(--adm-fg)] transition-colors hover:bg-[var(--adm-hover)]"
                      >
                        <Paperclip size={12} />
                        <span className="max-w-[220px] truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex-1 rounded-2xl border border-[color:var(--adm-border)] bg-[var(--adm-surface-2)] px-4 py-3">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Type a message..."
                      rows={2}
                      className="min-h-[56px] w-full resize-none bg-transparent text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none"
                    />

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--adm-fg-dim)]">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--adm-border)] px-3 py-1.5 transition-colors hover:bg-[var(--adm-hover)]"
                        >
                          <Paperclip size={12} />
                          Attach files
                        </button>
                        <span>Supports images, audio, video, and files.</span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || (!draft.trim() && attachments.length === 0)}
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--adm-accent)] text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-[13px] text-[var(--adm-fg-dim)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--adm-accent-soft-bg)] text-[var(--adm-accent)] shadow-sm">
                <MessageSquarePlus size={22} />
              </div>
              <p className="text-[15px] font-semibold text-[var(--adm-fg)]">No conversation selected</p>
              <p className="max-w-md">Open a thread from the left panel or create a new direct conversation using a donor or requester user ID.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}