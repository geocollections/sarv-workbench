import axios from "axios";
import store from "@/store";

export const rwapiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

rwapiClient.interceptors.request.use((config) => {
  const token = store?.state?.user?.authUser?.token;
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
