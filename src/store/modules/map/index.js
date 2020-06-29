const state = {
  showMap: true,
  defaultLayer: "CartoDB"
};

const getters = {};

const actions = {
  updateShowMap({ commit }, boolVal) {
    commit("UPDATE_SHOW_MAP", boolVal);
  },

  updateDefaultLayer({ commit }, layerName) {
    commit("UPDATE_DEFAULT_LAYER", layerName);
  }
};

const mutations = {
  UPDATE_SHOW_MAP(state, payload) {
    state.showMap = payload;
  },

  UPDATE_DEFAULT_LAYER(state, layerName) {
    state.defaultLayer = layerName;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
