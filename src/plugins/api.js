import axios from "axios";
import PublicApiService from "@/services/PublicApiService";
import RWApiService from "@/services/RWApiService";
import AuthService from "@/services/AuthService";

const defaultOptions = {
  axios,
};

const api = {
  install(Vue, options) {
    const userOptions = { ...defaultOptions, ...options };

    Vue.prototype.$api = {
      public: new PublicApiService(userOptions),
      rw: new RWApiService(userOptions),
      auth: new AuthService(userOptions),
    };
  },
};

export default api;
