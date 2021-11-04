import { fetchAllFields } from "@/assets/js/api/apiCalls";

const actions = {
  async getDynamicFields({ commit }, table) {
    try {
      let response = await fetchAllFields(table, { show_all: true });

      if (response?.data?.tableHeaders) {
        let headers = response.data.tableHeaders;
        commit("SET_ALL_TABLE_HEADERS", { headers: headers, table: table });
      }
      if (response?.data?.searchFields) {
        let fields = response.data.searchFields;
        commit("SET_DYNAMIC_SEARCH_FIELDS", { fields: fields, table: table });
      }
    } catch (err) {
      console.error(`Fetching dynamic fields failed: ${err}`);
    }
  },

  updateTableHeaders({ commit }, payload) {
    commit("UPDATE_TABLE_HEADERS", payload);
  },

  setDefaultTableHeaders({ commit }, table) {
    commit("SET_DEFAULT_TABLE_HEADERS", { table: table });
  },

  updateDynamicSearchField({ commit }, payload) {
    commit("UPDATE_DYNAMIC_SEARCH_FIELD", payload);
  },

  resetDynamicSearchField({ commit }, table) {
    commit("RESET_DYNAMIC_SEARCH_FIELDS", { table: table });
  },
};

export default actions;
