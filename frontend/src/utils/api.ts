import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type Method = "get" | "post" | "put" | "delete";

async function request(
  method: Method,
  path: string,
  data?: any,
  token?: string | null
) {
  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await axios({ method, url, data, headers });
  // backend sometimes nests response under data; normalize
  return res.data;
}

export const api = {
  get: (path: string, token?: string | null) =>
    request("get", path, undefined, token),
  post: (path: string, data?: any, token?: string | null) =>
    request("post", path, data, token),
  put: (path: string, data?: any, token?: string | null) =>
    request("put", path, data, token),
  delete: (path: string, token?: string | null) =>
    request("delete", path, undefined, token)
};
