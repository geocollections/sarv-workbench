import Vue from "vue";
import ApiService from "@/services/ApiService";

class RWApiService extends ApiService {
  constructor({ axios, url }) {
    super();
    this.baseURL = url || process.env.VUE_APP_RWAPI_URL;
    this.service = axios.create({
      withCredentials: true,
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken",
    });
  }

  async getDetail(table, id) {
    const url = `${this.baseURL}/${table}/${id}/`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      return err?.response?.data ?? `URL: '${url}' MESSAGE: ${err.message}`;
    }
  }

  async get(table, { defaultParams, options }) {
    const url = `${this.baseURL}/${table}`;
    const params = {
      ...defaultParams,
      ...this.getSortByParams(options),
      ...this.getPaginationParams(options),
    };
    try {
      const res = await this.service.get(url, { params });
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  static async post(table) {
    // Todo
  }

  static async put(table, id) {
    // Todo
  }

  // Works similarly to put + seems our backend (drf) doesn't have any differences between put and patch
  static async patch(table, id) {
    // Todo
  }

  static async delete(table, id) {
    // Todo
  }
}

export default RWApiService;
