import { fetchCurrentlyActiveUsers } from "../../../assets/js/api/apiCalls";

const state = {
  activeUsers: null
};

const getters = {
  // getPermissions: state => {
  //   return state.authUser?.permissions;
  // },
  //
  // getDatabaseId: state => {
  //   return state.authUser?.database_id;
  // },
  //
  // getCurrentUser: state => {
  //   return {
  //     id: state.authUser?.agent_id,
  //     agent: state.authUser?.agent,
  //     forename: state.authUser?.name,
  //     surename: state.authUser?.surname,
  //     user: state.authUser?.user
  //   };
  // },
  //
  // getUserId: state => {
  //   return state.authUser?.user_id;
  // },
  //
  // isUserAllowedTo: (state, getters) => (action, table) => {
  //   if (getters.getPermissions && getters.getPermissions[table]) {
  //     return getters.getPermissions[table].includes(action);
  //   } else return false;
  // },
  //
  // isUserSuperuser: state => {
  //   return state.authUser?.is_superuser;
  // },
  //
  // isUserStaff: staff => {
  //   return state.authUser?.is_staff;
  // },
  //
  // getLastLoginDate: state => {
  //   return state.lastLogin?.session_start;
  // }
};

const actions = {
  fetchActiveUsers({ commit }) {
    return fetchCurrentlyActiveUsers().then(resp => {
      commit("SET_ACTIVE_USERS", resp);
    });
  }
};

const mutations = {
  SET_ACTIVE_USERS(state, payload) {
    if (payload?.data?.count > 0) {
      state.activeUsers = payload.data;
    } else {
      state.activeUsers = {
        count: 0,
        results: []
      };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
