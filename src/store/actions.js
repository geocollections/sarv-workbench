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
  fetchDois, fetchLibrariesFromLibraryAgent, fetchAnalyses, fetchSpecimens
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
    return fetchLibrariesFromLibraryAgent(state.activeSearchParams.search, state.activeSearchParams.agent).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_LOCALITIES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchLocalities(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_SAMPLES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchSamples(state.activeSearchParams.search, state.activeSearchParams.agent, state.activeSearchParams.databaseId).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_ANALYSES: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchAnalyses(state.activeSearchParams.search, state.activeSearchParams.agent, state.activeSearchParams.databaseId).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_DOIS: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchDois(state.activeSearchParams.search).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  FETCH_SPECIMENS: ({ commit, state }) => {
    state.activeSearchParams.search.paginateBy = 10
    return fetchSpecimens(state.activeSearchParams.search, state.activeSearchParams.databaseId).then(resp => commit('SET_SIDEBAR_LIST', {resp}))
  },

  SAVE_SHORTCUTS: ({ commit, state }, shortcuts) => {
    commit('SET_SHORTCUTS', { shortcuts })
  },

  GET_SHORTCUTS: ({ commit, state }) => {
    commit('GET_SHORTCUTS')
  },

  ACTIVE_LIBRARY: ({commit, state}, library) => {
    commit('SET_ACTIVE_LIBRARY', library)
  },

  ACTIVE_PROJECT: ({commit, state}, project) => {
    commit('SET_ACTIVE_PROJECT', project)
  },

  INITIALISE_ACTIVE_OBJECTS: ({commit}) => {
    commit('SET_ACTIVE_OBJECTS')
  }
}
