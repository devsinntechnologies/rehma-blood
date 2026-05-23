const defaultBaseUrl = "https://rehma.devsinntechnologies.com";
const localBaseUrl = "http://localhost:7676";

export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ??
	(typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
		? localBaseUrl
		: defaultBaseUrl);

export const AUTH_STORAGE_KEY = "rehma-blood-auth";