const state = {
  loadingState: false,
  loadingType: "fetch",
  loadingPercent: 0,
  recentUrls: [],
  recentUrlsState: false,
};

const getters = {};

const actions = {
  setLoadingState({ commit }, boolVal) {
    commit("SET_LOADING_STATE", boolVal);
  },

  setLoadingType({ commit }, type) {
    commit("SET_LOADING_TYPE", type);
  },

  setLoadingPercent({ commit }, percent) {
    commit("SET_LOADING_PERCENT", percent);
  },

  updateRecentUrls: ({ commit }, recentUrls) => {
    commit("UPDATE_RECENT_URLS", recentUrls);
  },

  updateRecentUrlsState({ commit }, boolVal) {
    commit("UPDATE_RECENT_URLS_STATE", boolVal);
  },
};

const mutations = {
  SET_LOADING_STATE(state, payload) {
    state.loadingState = payload;
  },

  SET_LOADING_TYPE(state, payload) {
    state.loadingType = payload;
  },

  SET_LOADING_PERCENT(state, payload) {
    state.loadingPercent = payload;
  },

  UPDATE_RECENT_URLS: (state, payload) => {
    let recentUrls = [...payload];

    if (recentUrls && recentUrls.length > 0) {
      recentUrls.push(payload);
      if (recentUrls.length > 10) recentUrls.shift();

      // If after removing is still over 10 then empty that (I don't want to use loop here);
      if (recentUrls.length > 10) recentUrls = [];
    } else {
      recentUrls = [];
      recentUrls.push(payload);
    }

    state.recentUrls = recentUrls;
  },

  UPDATE_RECENT_URLS_STATE: (state, payload) => {
    state.recentUrlsState = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
