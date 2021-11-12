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

  async getDetail(table, id, params) {
    const url = `${this.baseURL}/${table}/${id}/`;
    try {
      const res = await this.service.get(url, { params });
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async get(table, { defaultParams, options } = {}) {
    const url = `${this.baseURL}/${table}/`;
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

  async getLegacy(
    table,
    { defaultParams },
    legacyQueryString,
    searchParameters
  ) {
    const url = `${this.baseURL}/${table}/${legacyQueryString}`;
    const { page, paginateBy, sortBy, sortDesc } = searchParameters;
    const params = {
      ...defaultParams,
      ...this.getSortByParams({ sortBy, sortDesc }),
      ...this.getPaginationParams({ page, paginateBy }),
    };
    try {
      const res = await this.service.get(url, { params });
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async post(table, formData) {
    const url = `${this.baseURL}/${table}/`;
    try {
      const res = await this.service.post(url, formData);
      this.toastSuccess("Record added!");
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async put(table, id, formData) {
    const url = `${this.baseURL}/${table}/${id}/`;
    try {
      const res = await this.service.put(url, formData);
      this.toastSuccess("Record updated!");
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async getObjectPermissions(table, id) {
    const url = `${this.baseURL}/${table}/${id}/permissions/`;
    try {
      const res = await this.service.get(url);
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async rotateImages(data) {
    const url = `${this.baseURL}/image_processor/rotate/`;
    try {
      const res = await this.service.post(url, data);
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
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
