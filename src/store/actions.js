import {
  fetchSites,
  fetchProjects,
  fetchReferences,
  fetchAnalysisMethod,
  fetchSamplePurpose,
  fetchFossilGroup,
  fetchAttachments,
  fetchLibraries,
  fetchLocalities,
  fetchSamples,
  fetchDois
} from "../assets/js/api/apiCalls";

export default {
  FETCH_PROJECTS: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchProjects(state.activeSearchParams.search, state.currentUser.id).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_SITES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchSites(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_ATTACHMENTS: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchAttachments(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_REFERENCES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchReferences(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_LIBRARIES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchLibraries(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_LOCALITIES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchLocalities(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_SAMPLES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchSamples(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_DOIS: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchDois(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  // TODO: Following 3 requests should be fixed, currently they run after each page refresh
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
