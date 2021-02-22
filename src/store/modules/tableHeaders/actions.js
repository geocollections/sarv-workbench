import { fetchAllFields } from "@/assets/js/api/apiCalls";

const actions = {
  async getAllFieldNames({ commit }, table) {
    try {
      let response = await fetchAllFields(table, { show_all: true });

      if (response?.data?.results?.fields) {
        let fields = response.data.results.fields;
        commit("SET_ALL_TABLE_HEADERS", { fields: fields, table: table });
      }
    } catch (err) {
      console.error(`Fetching fields failed: ${err}`);
    }
  },

  updateTableHeaders({ commit }, payload) {
    commit("UPDATE_TABLE_HEADERS", payload);
  },

  setDefaultTableHeaders({ commit }, table) {
    commit("SET_DEFAULT_TABLE_HEADERS", { table: table });
  }
};

export default actions;
