import { fetchLastLoggedInDate } from "../../../assets/js/api/apiCalls";

const state = {
  authUser: null,
  lastLogin: null,
};

const getters = {
  getPermissions: (state) => {
    return state.authUser?.permissions;
  },

  getDatabaseId: (state) => {
    return state.authUser?.database_id;
  },

  getCurrentUser: (state) => {
    return {
      id: state.authUser?.agent_id,
      agent: state.authUser?.agent,
      forename: state.authUser?.name,
      surename: state.authUser?.surname,
      user: state.authUser?.user,
    };
  },

  getUserId: (state) => {
    return state.authUser?.user_id;
  },

  isUserAllowedTo: (state, getters) => (action, table) => {
    if (getters.getPermissions && getters.getPermissions[table]) {
      return getters.getPermissions[table].includes(action);
    } else return false;
  },

  isUserSuperuser: (state) => {
    return state.authUser?.is_superuser;
  },

  isUserStaff: (staff) => {
    return state.authUser?.is_staff;
  },

  getLastLoginDate: (state) => {
    return state.lastLogin?.session_start;
  },
};

const actions = {
  setAuthUser({ commit }, userData) {
    commit("SET_AUTH_USER", userData);
  },

  removeAuthUser({ commit }) {
    commit("SET_AUTH_USER", null);
  },

  fetchLastLoggedInDate({ commit, rootGetters }) {
    return fetchLastLoggedInDate(rootGetters["user/getUserId"]).then((resp) => {
      commit("SET_LAST_LOGIN", resp);
    });
  },
};

const mutations = {
  SET_AUTH_USER(state, payload) {
    state.authUser = payload;
  },

  SET_LAST_LOGIN(state, payload) {
    if (payload?.data?.results && payload?.data?.results.length === 1) {
      state.lastLogin = payload.data.results[0];
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
