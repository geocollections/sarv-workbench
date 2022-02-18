const actions = {
  updateSearchFields({ commit }, payload) {
    commit("UPDATE_SEARCH_FIELDS", payload);
  },

  updateViewType({ commit }, payload) {
    commit("UPDATE_VIEW_TYPE", payload);
  },

  updateOptions({ commit }, payload) {
    commit("UPDATE_OPTIONS", payload);
  },

  updateHeaders({ commit }, payload) {
    commit("UPDATE_HEADERS", payload);
  },
  async resetHeaders({ commit }, payload) {
    const module = await import(`./modules/${payload.module}/index.js`);

    const initHeaders = module.default.getDefaultState().headers;

    commit("RESET_HEADERS", { ...payload, headers: initHeaders });

    this.reset({
      self: false,
      modules: {
        [payload.module]: {
          self: false,
          modules: { searchFields: { self: true } },
        },
      },
    });
  },

  resetState({ commit }, { module }) {
    this.reset({
      self: false,
      modules: {
        [module]: { self: true },
      },
    });
  },

  setItems({ commit }, payload) {
    commit("SET_ITEMS", payload)
  },
};

export default actions;
