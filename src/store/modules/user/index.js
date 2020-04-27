const state = {
  authUser: null
};

const getters = {
  getPermissions: state => {
    return state.authUser?.permissions;
  },

  getDatabaseId: state => {
    return state.authUser?.database_id;
  },

  getCurrentUser: state => {
    return {
      id: state.authUser?.agent_id,
      agent: state.authUser?.agent,
      forename: state.authUser?.name,
      surename: state.authUser?.surname,
      user: state.authUser?.user
    };
  },

  isUserAllowedTo: (state, getters) => (action, table) => {
    if (getters.getPermissions && getters.getPermissions[table]) {
      return getters.getPermissions[table].includes(action);
    } else return false;
  }
};

const actions = {
  setAuthUser({ commit }, userData) {
    commit("SET_AUTH_USER", userData);
  },

  removeAuthUser({ commit }) {
    commit("SET_AUTH_USER", null);
  }
};

const mutations = {
  SET_AUTH_USER(state, payload) {
    state.authUser = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
