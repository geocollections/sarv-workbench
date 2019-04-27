import {
  fetchSites,
  fetchProjects,
  fetchReferences,
  fetchAnalysisMethod,
  fetchSamplePurpose,
  fetchFossilGroup

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
  },

  FETCH_ANALYSIS_METHODS: ({ commit, state }) => {
    return state.analysisMethods !== null
      ? Promise.resolve(state.analysisMethods)
      : fetchAnalysisMethod().then(resp => commit('SET_ANALYSIS_METHODS', {resp}))
  },

  FETCH_SAMPLE_PURPOSES: ({ commit, state }) => {
    return state.samplePurposes !== null
      ? Promise.resolve(state.samplePurposes)
      : fetchSamplePurpose().then(resp => commit('SET_SAMPLE_PURPOSES', {resp}))
  },

  FETCH_FOSSIL_GROUPS: ({ commit, state }) => {
    return state.fossilGroups !== null
      ? Promise.resolve(state.fossilGroups)
      : fetchFossilGroup().then(resp => commit('SET_FOSSIL_GROUPS', {resp}))
  }




}
