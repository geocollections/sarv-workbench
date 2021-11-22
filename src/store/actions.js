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

  resetState({ commit }, { module }) {
    this.reset({
      self: false,
      modules: {
        [module]: { self: true },
      },
    });
  },
};

export default actions;
