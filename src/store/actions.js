import {
  fetchSites,
  fetchProjects,

} from "../assets/js/api/apiCalls";
export default {
  FETCH_SITES: ({ commit, state }) => {
    return fetchSites(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_PROJECTS: ({ commit, state }) => {
    console.log(state.activeSearchParams)
    return fetchProjects(state.activeSearchParams.search, state.currentUser.id).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

}
