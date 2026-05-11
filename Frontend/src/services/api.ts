import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export const apiRequest = async <T = unknown,>(
  path: string,
  token: string,
  options: ApiOptions = {},
): Promise<T> => {
  const response = await axios<T>({
    url: `${API_URL}${path}`,
    method: options.method || "GET",
    data: options.body ?? undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return response.data;
};
