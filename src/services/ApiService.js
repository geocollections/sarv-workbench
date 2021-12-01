import { isEmpty } from "lodash";
import Vue from "vue";
import { testProp } from "leaflet/src/dom/DomUtil";

class ApiService {
  constructor() {}

  getPaginationParams = (options) => {
    const page = options?.page ?? 1;
    const itemsPerPage = options?.itemsPerPage || options?.paginateBy;
    if (page && itemsPerPage) {
      return {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
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

  buildSearchFields = (searchFields) => {
    if (searchFields?.byIds) {
      const query = Object.keys(searchFields.byIds).reduce((prev, curr) => {
        let value = searchFields.byIds[curr].value;
        if (value) {
          const lookUpType =
            searchFields.byIds[curr]?.lookUpType ?? "icontains";
          const type = searchFields.byIds[curr]?.type ?? "text";
          const fields = searchFields.byIds[curr]?.fields ?? [curr];

          if (type === "text")
            fields.forEach(
              (field) => (prev[`${field}__${lookUpType}`] = value)
            );
          else if (type === "multi") {
            const or_search = fields.map(
              (field) => `${field}__${lookUpType}:${value}`
            );
            prev["or_search"] = or_search.join(" OR ");
          } else if (type === "datetime") {
            fields.forEach(
              (field) =>
                (prev[`${field}__${lookUpType}`] = `${value} ${
                  lookUpType === "lt" ? "23:59" : "00:00"
                }`)
            );
          } else if (type === "multi_checkbox") {
            fields.forEach(
              (field) =>
                (prev[`${field}__${lookUpType}`] = `${
                  value.length > 0 ? value : 0
                }`)
            );
          }
        }
        return prev;
      }, {});
      return query;
    }
    return null;
  };

  handleError(error, url) {
    const status = error.response.status;
    const detail = error?.response?.data?.detail ?? "";
    const outputMessage = `${detail} URL: ${url}`;
    if (status === 403) return `<b>Forbidden!</b> ${outputMessage}`;
    if (status === 404) return `<b>Page not Found!</b> ${outputMessage}`;
    if (status === 405) return `<b>Method not Allowed!</b> ${outputMessage}`;
    if (status === 500) return `<b>Server Error!</b> ${outputMessage}`;
    else
      return `<b>Something went wrong!</b> Status: ${status} ${outputMessage}`;
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

  toastSuccess(text) {
    Vue.prototype.toast.success(text, "OK", {
      position: "topCenter",
      timeout: 3000,
      closeOnEscape: true,
      pauseOnHover: false,
      displayMode: "replace",
    });
  }
}

export default ApiService;
