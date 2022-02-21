import Vue from "vue";
import ApiService from "@/services/ApiService";
import qs from "qs";

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

  async get(table, { defaultParams, options, searchFields } = {}) {
    const url = `${this.baseURL}/${table}/`;
    const params = {
      ...defaultParams,
      ...this.buildSearchFields(searchFields),
      ...this.getSortByParams(options),
      ...this.getPaginationParams(options),
    };
    try {
      const res = await this.service.get(url, {
        params,
        paramsSerializer: (par) => {
          return qs.stringify(par, { indices: false });
        },
      });
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

      // Special use case for attachment, becuase response is a little bit different
      if (table === "attachment") {
        if (res?.data?.uploaded_ids?.length > 0)
          this.toastSuccess("Record(s) added!");
        else this.toastInfo("Something went wrong!");
      } else this.toastSuccess("Record added!");

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
    const baseUrlWithoutApiPath = this.baseURL.substring(
      0,
      this.baseURL.length - 3
    );
    const url = `${baseUrlWithoutApiPath}image_processor/rotate/`;
    try {
      const res = await this.service.post(url, data);
      return res.data;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }

  async delete(table, id) {
    const url = `${this.baseURL}/${table}/${id}/`;
    try {
      const res = await this.service.delete(url);
      this.toastSuccess("Record deleted!");
      // Successful delete is 204 No Content
      return res?.status === 204 ? res.status : false;
    } catch (err) {
      this.toastError(err, url);
      return this.handleError(err, url);
    }
  }
}

export default RWApiService;
