import axios from "axios";
import store from "@/store";

export const rwapiClient = axios.create({
  baseURL: "https://rwapi-dev.geoloogia.info",
  headers: {
    Authorization: `Token ${store?.state?.user?.authUser?.token}`,
  },
});
