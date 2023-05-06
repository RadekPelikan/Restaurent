import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  timeout: 1000,
  // headers: { "X-Custom-Header": "foobar" },
});
