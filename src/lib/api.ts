import { BASE_URL } from "@/contant";

/**
 * Calls the backend with the admin's bearer token and unwraps the `{ success, message, data }`
 * envelope. Throws an Error carrying the server's message when the request fails.
 */
export async function apiRequest<T>(
  path: string,
  token: string,
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: init.method ?? "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Check your connection and try again.");
  }

  const raw = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(raw?.message ?? `Request failed (${response.status}).`);
  }
  return (raw && "data" in raw ? raw.data : raw) as T;
}
