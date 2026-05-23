import { BASE_URL } from "@/contant";

export type ChatRole = "superadmin" | "donor" | "user";

export type ChatParticipant = {
  role: ChatRole;
  userId: number;
  displayName: string;
  avatarUrl: string | null;
  unreadCount: number;
  lastReadMessageId: number | null;
  joinedAt: string;
  isTyping: boolean;
  archived: boolean;
  muted: boolean;
};

export type ChatConversation = {
  id: number;
  type: "direct" | "group" | "request" | "support";
  title: string | null;
  contextType: string | null;
  contextId: number | null;
  createdByRole: ChatRole;
  createdByUserId: number;
  participants: ChatParticipant[];
  lastMessageId: number | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  archived: boolean;
  muted: boolean;
  isTyping: boolean;
};

export type ChatAttachment = {
  id: number;
  messageId: number;
  originalName: string;
  fileName: string;
  mimeType: string;
  kind: "image" | "video" | "audio" | "file";
  size: number;
  url: string;
  previewUrl: string | null;
  durationMs: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderRole: ChatRole;
  senderUserId: number;
  senderName: string;
  body: string | null;
  messageType: "text" | "voice" | "image" | "video" | "file" | "mixed";
  replyToMessageId: number | null;
  status: string;
  attachments: ChatAttachment[];
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  readBy?: Array<{
    role: ChatRole;
    userId: number;
    displayName: string;
    readAt: string;
  }>;
};

export type ChatMessagesResponse = {
  items: ChatMessage[];
  total: number;
  hasMore: boolean;
  nextCursor: number | null;
};

export type CreateChatConversationInput = {
  type?: ChatConversation["type"];
  title?: string;
  contextType?: string;
  contextId?: number;
  participants: Array<{ role: ChatRole; userId: number }>;
};

export type SendChatMessageInput = {
  body?: string;
  replyToMessageId?: number | null;
};

export type UpdateChatConversationStateInput = {
  archived?: boolean;
  muted?: boolean;
};

const chatBaseUrl = BASE_URL.replace(/\/$/, "");

const unwrap = <T,>(raw: unknown): T => {
  if (raw && typeof raw === "object" && "data" in raw) {
    return (raw as { data: T }).data;
  }

  return raw as T;
};

const readJsonResponse = async <T,>(response: Response, fallbackError: string): Promise<T> => {
  const raw = await response.json().catch(() => null);
  const payload = unwrap<T>(raw);

  if (!response.ok) {
    const rawMessage = raw && typeof raw === "object" && "message" in raw ? String((raw as { message?: unknown }).message) : null;
    const payloadMessage = payload && typeof payload === "object" && "message" in payload ? String((payload as { message?: unknown }).message) : null;
    throw new Error(rawMessage ?? payloadMessage ?? fallbackError);
  }

  return payload;
};

const authHeaders = (token: string, extraHeaders: HeadersInit = {}): HeadersInit => ({
  accept: "*/*",
  Authorization: `Bearer ${token}`,
  ...extraHeaders,
});

export async function fetchChatConversations(token: string): Promise<ChatConversation[]> {
  const response = await fetch(`${chatBaseUrl}/chat/conversations`, {
    method: "GET",
    headers: authHeaders(token),
  });

  return readJsonResponse<ChatConversation[]>(response, "Unable to load chat conversations.");
}

export async function fetchChatUnreadCount(token: string): Promise<number> {
  const response = await fetch(`${chatBaseUrl}/chat/unread-count`, {
    method: "GET",
    headers: authHeaders(token),
  });

  const payload = await readJsonResponse<{ unreadCount: number }>(response, "Unable to load chat unread count.");
  return payload.unreadCount ?? 0;
}

export async function fetchChatMessages(token: string, conversationId: number, beforeMessageId?: number | null): Promise<ChatMessagesResponse> {
  const query = new URLSearchParams();
  query.set("limit", "50");

  if (beforeMessageId != null) {
    query.set("beforeMessageId", String(beforeMessageId));
  }

  const response = await fetch(`${chatBaseUrl}/chat/conversations/${conversationId}/messages?${query.toString()}`, {
    method: "GET",
    headers: authHeaders(token),
  });

  return readJsonResponse<ChatMessagesResponse>(response, "Unable to load chat messages.");
}

export async function createChatConversation(token: string, input: CreateChatConversationInput): Promise<ChatConversation> {
  const response = await fetch(`${chatBaseUrl}/chat/conversations`, {
    method: "POST",
    headers: authHeaders(token, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(input),
  });

  return readJsonResponse<ChatConversation>(response, "Unable to create the chat conversation.");
}

export async function sendChatMessage(
  token: string,
  conversationId: number,
  input: SendChatMessageInput,
  files: File[] = [],
): Promise<ChatMessage> {
  const formData = new FormData();

  if (input.body?.trim()) {
    formData.append("body", input.body.trim());
  }

  if (input.replyToMessageId != null) {
    formData.append("replyToMessageId", String(input.replyToMessageId));
  }

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${chatBaseUrl}/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  return readJsonResponse<ChatMessage>(response, "Unable to send the chat message.");
}

export async function markChatConversationRead(token: string, conversationId: number, lastReadMessageId?: number | null): Promise<{
  conversation: ChatConversation;
  unreadCount: number;
  lastReadMessageId: number | null;
}> {
  const response = await fetch(`${chatBaseUrl}/chat/conversations/${conversationId}/read`, {
    method: "PATCH",
    headers: authHeaders(token, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ lastReadMessageId }),
  });

  return readJsonResponse<{
    conversation: ChatConversation;
    unreadCount: number;
    lastReadMessageId: number | null;
  }>(response, "Unable to mark the conversation as read.");
}

export async function updateChatConversationState(
  token: string,
  conversationId: number,
  input: UpdateChatConversationStateInput,
): Promise<ChatConversation> {
  const response = await fetch(`${chatBaseUrl}/chat/conversations/${conversationId}/archive`, {
    method: "PATCH",
    headers: authHeaders(token, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(input),
  });

  return readJsonResponse<ChatConversation>(response, "Unable to update the conversation state.");
}