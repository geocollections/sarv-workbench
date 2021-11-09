import { isEmpty } from "lodash";
import Vue from "vue";

class ApiService {
  constructor() {}

  getPaginationParams = (options) => {
    const page = options?.page ?? 1;
    if (page && options?.itemsPerPage) {
      return {
        limit: options.itemsPerPage,
        offset: (page - 1) * options.itemsPerPage,
      };
    }
    return null;
  };

  getSortByParams = (options) => {
    if (options?.sortBy && options?.sortDesc) {
      if (!isEmpty(options.sortBy)) {
        const orderBy = options.sortBy.map((value, i) => {
          if (options.sortDesc[i]) return `-${value}`;
          return value;
        });

        return { ordering: orderBy.join(",") };
      }
    }
    return null;
  };

  handleError(error, url) {
    const status = error.response.status;
    if (status === 500) return `<b>Server Error!</b> URL: ${url}`;
    if (status === 404) return `<b>Page not Found!</b> URL: ${url}`;
    if (status === 403) return `<b>Forbidden!</b> URL: ${url}`;
    else return `<b>Something went wrong!</b> Status: ${status} URL: ${url}`;
  }

  toastError(error, url) {
    Vue.prototype.toast.error(this.handleError(error, url), "Error", {
      position: "topCenter",
      timeout: 7000,
      closeOnEscape: true,
      pauseOnHover: false,
      displayMode: "replace",
    });
  }
}

export default ApiService;
