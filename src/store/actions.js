import {
  fetchSites,
  fetchProjects,
  fetchReferences

} from "../assets/js/api/apiCalls";
export default {
  FETCH_SITES: ({ commit, state }) => {
    return fetchSites(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_PROJECTS: ({ commit, state }) => {
    return fetchProjects(state.activeSearchParams.search, state.currentUser.id).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_REFERENCES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchReferences(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  }
}
