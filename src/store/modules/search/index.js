import {
  fetchAccessions,
  fetchAgents,
  fetchAnalyses,
  fetchAreas,
  fetchAttachments,
  fetchCollections,
  fetchDatasets,
  fetchDeaccessions,
  fetchDois,
  fetchDrillcoreBoxes,
  fetchDrillcores,
  fetchJournals,
  fetchKeywords,
  fetchLibrariesFromLibraryAgent,
  fetchLoans,
  fetchLocalities,
  fetchLocations,
  fetchPreparations,
  fetchProjects,
  fetchReferences,
  fetchRocks,
  fetchSamples,
  fetchSampleSeries,
  fetchSelectionSeries,
  fetchSites,
  fetchSpecimens,
  fetchStratigraphies,
  fetchTaxa,
  fetchVisits,
  fetchWebNews,
  fetchWebPages
} from "../../../assets/js/api/apiCalls";
import Vue from "vue";

const state = {
  loadingState: false,
  loadingType: "fetch",
  loadingPercent: 0,
  sidebarList: [],
  activeObject: null,
  tableSearchParameters: {},
  sidebarUserAction: null,
  activeLibrary: null,
  activeProject: null,
  activeSample: null,
  activeSite: null,
  activeSelectionSeries: null,
  activeRelatedDataTab: {}
};

const getters = {};

const actions = {
  setLoadingState({ commit }, boolVal) {
    commit("SET_LOADING_STATE", boolVal);
  },

  setLoadingType({ commit }, type) {
    commit("SET_LOADING_TYPE", type);
  },

  setLoadingPercent({ commit }, percent) {
    commit("SET_LOADING_PERCENT", percent);
  },

  FETCH_PROJECTS({ commit, state }) {
    return fetchProjects(
      state.activeSearchParams.search,
      state.currentUser.id
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_SITES({ commit, state }) {
    return fetchSites(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_ATTACHMENTS({ commit, state }) {
    return fetchAttachments(
      state.activeSearchParams.search,
      state.currentUser
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_REFERENCES({ commit, state }) {
    return fetchReferences(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_LIBRARIES({ commit, state }) {
    return fetchLibrariesFromLibraryAgent(
      state.activeSearchParams.search,
      state.activeSearchParams.agent
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_LOCALITIES({ commit, state }) {
    return fetchLocalities(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_SAMPLES({ commit, state }) {
    return fetchSamples(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_ANALYSES({ commit, state }) {
    return fetchAnalyses(
      state.activeSearchParams.search,
      state.activeSearchParams.agent,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_DOIS({ commit, state }) {
    return fetchDois(
      state.activeSearchParams.search,
      state.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_SPECIMENS({ commit, state }) {
    return fetchSpecimens(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => commit("SET_SIDEBAR_LIST", { resp }));
  },

  FETCH_KEYWORDS({ commit, state }) {
    return fetchKeywords(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_JOURNALS({ commit, state }) {
    return fetchJournals(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", { resp })
    );
  },

  FETCH_COLLECTIONS({ commit, state }) {
    return fetchCollections(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_TAXA({ commit, state }) {
    return fetchTaxa(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_SELECTION_SERIES({ commit, state }) {
    return fetchSelectionSeries(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_AGENTS({ commit, state }) {
    return fetchAgents(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_PREPARATIONS({ commit, state }) {
    return fetchPreparations(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DRILLCORES({ commit, state }) {
    return fetchDrillcores(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DATASETS({ commit, state }) {
    return fetchDatasets(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_STRATIGRAPHY({ commit, state }) {
    return fetchStratigraphies(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_AREAS({ commit, state }) {
    return fetchAreas(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DRILLCORE_BOXES({ commit, state }) {
    return fetchDrillcoreBoxes(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_LOCATIONS({ commit, state }) {
    return fetchLocations(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_ROCKS({ commit, state }) {
    return fetchRocks(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_DEACCESSIONS({ commit, state }) {
    return fetchDeaccessions(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_ACCESSIONS({ commit, state }) {
    return fetchAccessions(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_VISITS({ commit, state }) {
    return fetchVisits(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_LOANS({ commit, state }) {
    return fetchLoans(
      state.activeSearchParams.search,
      state.activeSearchParams.databaseId
    ).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_WEB_PAGES({ commit, state }) {
    return fetchWebPages(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_WEB_NEWS({ commit, state }) {
    return fetchWebNews(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  FETCH_SAMPLE_SERIES({ commit, state }) {
    return fetchSampleSeries(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", { resp });
    });
  },

  SIDEBAR_USER_ACTION: ({ commit }, userAction) => {
    commit("SET_SIDEBAR_USER_ACTION", userAction);
  },

  updateSearchParameters({ commit }, params) {
    commit("UPDATE_SEARCH_PARAMETERS", params);
  },

  updateActiveTab({ commit }, payload) {
    commit("UPDATE_ACTIVE_TAB", payload);
  }
};

const mutations = {
  SET_LOADING_STATE(state, payload) {
    state.loadingState = payload;
  },

  SET_LOADING_TYPE(state, payload) {
    state.loadingType = payload;
  },

  SET_LOADING_PERCENT(state, payload) {
    state.loadingPercent = payload;
  },

  SET_SIDEBAR_LIST(state, payload) {
    /* false means page not found */
    state.sidebarList = {
      results: payload?.data?.results || false,
      page: payload?.data?.page,
      totalPages: payload?.data?.page
        ? payload.data.page.split(" of ")[1]
        : undefined
    };
  },

  SET_ACTIVE_SEARCH_PARAMS(state, params) {
    state.activeSearchParams = params;
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    state.tableSearchParameters[payload.module] = {
      searchParameters: payload.params,
      filters: payload.filters
    };
  },

  UPDATE_ACTIVE_TAB(state, payload) {
    Vue.set(state.activeRelatedDataTab, payload.object, payload.tab);
  },

  SET_SIDEBAR_USER_ACTION(state, payload) {
    state.sidebarUserAction = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
