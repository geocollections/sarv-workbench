import { fetchCurrentlyActiveUsers } from "../../../assets/js/api/apiCalls";

const state = {
  activeUsers: null,
};

const getters = {};

const actions = {
  fetchActiveUsers({ commit }) {
    return fetchCurrentlyActiveUsers().then((resp) => {
      commit("SET_ACTIVE_USERS", resp);
    });
  },
};

const mutations = {
  SET_ACTIVE_USERS(state, payload) {
    if (payload?.data?.count > 0) {
      state.activeUsers = payload.data;
    } else {
      state.activeUsers = {
        count: 0,
        results: [],
      };
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
