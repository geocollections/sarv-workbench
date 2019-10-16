import {
  fetchSites,
  fetchProjects,
  fetchReferences,
  fetchAttachments,
  fetchLocalities,
  fetchSamples,
  fetchDois,
  fetchLibrariesFromLibraryAgent,
  fetchAnalyses,
  fetchSpecimens,
  fetchKeywords,
  fetchJournals
} from "../assets/js/api/apiCalls";

export default {
  FETCH_PROJECTS: ({ commit, state }) => {
    return fetchProjects(
      state.activeSearchParams.search,
      state.currentUser.id
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_SITES: ({ commit, state }) => {
    return fetchSites(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_ATTACHMENTS: ({ commit, state }) => {
    return fetchAttachments(
      state.activeSearchParams.search,
      state.currentUser
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_REFERENCES: ({ commit, state }) => {
    return fetchReferences(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_LIBRARIES: ({ commit, state }) => {
    return fetchLibrariesFromLibraryAgent(
      state.activeSearchParams.search,
      state.activeSearchParams.agent
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_LOCALITIES: ({ commit, state }) => {
    return fetchLocalities(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_SAMPLES: ({ commit, state }) => {
    return fetchSamples(
      state.activeSearchParams.search,
      state.activeSearchParams.agent,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_ANALYSES: ({ commit, state }) => {
    return fetchAnalyses(
      state.activeSearchParams.search,
      state.activeSearchParams.agent,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_DOIS: ({ commit, state }) => {
    return fetchDois(state.activeSearchParams.search, state.databaseId).then(
      resp => commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_SPECIMENS: ({ commit, state }) => {
    return fetchSpecimens(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_KEYWORDS: ({ commit, state }) => {
    return fetchKeywords(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_JOURNALS: ({ commit, state }) => {
    return fetchJournals(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  SAVE_SHORTCUTS: ({ commit }, shortcuts) => {
    commit("SET_SHORTCUTS", { shortcuts });
  },

  GET_SHORTCUTS: ({ commit }) => {
    commit("GET_SHORTCUTS");
  },

  ACTIVE_LIBRARY: ({ commit }, library) => {
    commit("SET_ACTIVE_LIBRARY", library);
  },

  ACTIVE_PROJECT: ({ commit }, project) => {
    commit("SET_ACTIVE_PROJECT", project);
  },

  INITIALISE_ACTIVE_OBJECTS: ({ commit }) => {
    commit("SET_ACTIVE_OBJECTS");
  },

  INITIALISE_USER_DATA: ({ commit }) => {
    commit("SET_CURRENT_USER");
  },

  SIDEBAR_USER_ACTION: ({ commit }, userAction) => {
    commit("SET_SIDEBAR_USER_ACTION", userAction);
  },

  updateSearchParameters({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAMETERS", payload);
  }
};
