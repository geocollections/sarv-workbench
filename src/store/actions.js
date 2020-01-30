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
  fetchJournals,
  fetchCollections,
  fetchTaxa,
  fetchSelectionSeries,
  fetchAgents,
  fetchPreparations,
  fetchDrillcores,
  fetchDatasets,
  fetchStratigraphies,
  fetchAreas,
  fetchDrillcoreBoxes
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
    return fetchDois(
      state.activeSearchParams.search,
      state.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
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

  FETCH_COLLECTIONS: ({ commit, state }) => {
    return fetchCollections(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_TAXA: ({ commit, state }) => {
    return fetchTaxa(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_SELECTION_SERIES: ({ commit, state }) => {
    return fetchSelectionSeries(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_AGENTS: ({ commit, state }) => {
    return fetchAgents(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_PREPARATIONS: ({ commit, state }) => {
    return fetchPreparations(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DRILLCORES: ({ commit, state }) => {
    return fetchDrillcores(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DATASETS: ({ commit, state }) => {
    return fetchDatasets(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_STRATIGRAPHY: ({ commit, state }) => {
    return fetchStratigraphies(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_AREAS: ({ commit, state }) => {
    return fetchAreas(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DRILLCORE_BOXES: ({ commit, state }) => {
    return fetchDrillcoreBoxes(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  SAVE_SHORTCUTS: ({ commit }, shortcuts) => {
    commit("SET_SHORTCUTS", { shortcuts });
  },

  GET_SHORTCUTS: ({ commit }) => {
    commit("GET_SHORTCUTS");
  },

  setActiveLibrary: ({ commit }, library) => {
    commit("SET_ACTIVE_LIBRARY", library);
  },

  setActiveSelectionSeries: ({ commit }, selection_series) => {
    commit("SET_ACTIVE_SELECTION_SERIES", selection_series);
  },

  setActiveProject: ({ commit }, project) => {
    commit("SET_ACTIVE_PROJECT", project);
  },

  setActiveSite: ({ commit }, site) => {
    commit("SET_ACTIVE_SITE", site);
  },

  setActiveSample: ({ commit }, sample) => {
    commit("SET_ACTIVE_SAMPLE", sample);
  },

  INITIALISE_ACTIVE_OBJECTS: ({ commit }) => {
    commit("SET_ACTIVE_OBJECTS");
  },

  INITIALISE_USER_DATA: ({ commit }) => {
    commit("SET_CURRENT_USER");
  },

  initialiseRecentUrls: ({ commit }) => {
    commit("SET_RECENT_URLS");
  },

  appendRecentUrls: ({ commit }, urlObject) => {
    commit("UPDATE_RECENT_URLS", urlObject);
  },

  updateRecentUrlsState({ commit }, recentUrlsState) {
    commit("UPDATE_RECENT_URLS_STATE", recentUrlsState);
  },

  SIDEBAR_USER_ACTION: ({ commit }, userAction) => {
    commit("SET_SIDEBAR_USER_ACTION", userAction);
  },

  updateSearchParameters({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAMETERS", payload);
  },

  updateActiveTab({ commit }, payload) {
    commit("UPDATE_ACTIVE_TAB", payload);
  },

  updateDrawerState({ commit }, payload) {
    commit("UPDATE_DRAWER_STATE", payload);
  },

  updateDrawerRightState({ commit }, payload) {
    commit("UPDATE_DRAWER_RIGHT_STATE", payload);
  },

  updateAppZoom({ commit }, zoomLevel) {
    commit("UPDATE_APP_ZOOM", zoomLevel);
  },

  updateSettings({ commit }, settings) {
    commit("UPDATE_APP_SETTINGS", settings);
  },

  initialiseAppSettings({ commit }) {
    commit("INITIALISE_APP_SETTINGS");
  },

  updateMapState({ commit }, mapState) {
    commit("UPDATE_MAP_STATE", mapState);
  },

  updateMapDefaultLayer({ commit }, layerName) {
    commit("UPDATE_MAP_DEFAULT_LAYER", layerName);
  },

  initialiseMapSettings({ commit }) {
    commit("INITIALISE_MAP_SETTINGS");
  }
};
