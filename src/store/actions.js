import {
  fetchSites,
  fetchProjects,

} from "../assets/js/api/apiCalls";
export default {
  FETCH_SITES: ({ commit, state }) => {
    return fetchSites(state.activeSearchParams.defaultSearch).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_PROJECTS: ({ commit, state }) => {
    console.log(state.currentUser)
    return fetchProjects(state.activeSearchParams.defaultSearch, state.currentUser.id).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

}
