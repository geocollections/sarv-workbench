const state = {
  authUser: null,
};

const getters = {
  getPermissions: (state) => {
    return state.authUser?.permissions;
  },

  getDatabaseId: (state) => {
    return state.authUser?.database_id;
  },

  getCurrentAgent: (state) => {
    return {
      id: state.authUser?.agent_id,
      agent: state.authUser?.agent,
      forename: state.authUser?.first_name,
      surename: state.authUser?.last_name,
      user: state.authUser?.username,
    };
  },

  getUserId: (state) => {
    return state.authUser?.user_id;
  },

  getUserName: (state) => {
    return state.authUser?.username;
  },

  isUserAllowedTo: (state, getters) => (action, table) => {
    if (getters.isUserSuperuser) return true;
    else
      return getters.getPermissions.some(
        (perm) => perm.codename === `${action}_${table}`
      );
  },

  isUserSuperuser: (state) => {
    return state.authUser?.is_superuser;
  },

  isUserStaff: (state) => {
    return state.authUser?.is_staff;
  },

  getLastLoginDate: (state) => {
    return state.authUser?.last_login;
  },
};

const actions = {
  setAuthUser({ commit }, userData) {
    commit("SET_AUTH_USER", userData);
  },

  removeAuthUser({ commit }) {
    commit("SET_AUTH_USER", null);
  },
};

const mutations = {
  SET_AUTH_USER(state, payload) {
    state.authUser = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
