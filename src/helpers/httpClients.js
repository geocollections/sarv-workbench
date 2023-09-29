import axios from "axios";
import store from "@/store";

export const rwapiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Token ${store?.state?.user?.authUser?.token}`,
  },
});
