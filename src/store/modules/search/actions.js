import {
  fetchAccessions,
  fetchActiveLibraryList,
  fetchActiveSarvIssues,
  fetchActiveSelectionSeriesList,
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
  fetchLoans,
  fetchLocalities,
  fetchLocations,
  fetchPreparations,
  fetchProjects,
  fetchReferences,
  fetchRocks,
  fetchSamples,
  fetchSampleSeries,
  fetchSarvIssues,
  fetchSelectionSeries,
  fetchSites,
  fetchSpecimens,
  fetchStratigraphies,
  fetchTaxa,
  fetchVisits,
  fetchWebNews,
  fetchWebPages,
  fetchAnalysisMethods,
  fetchAnalysisParameters,
  fetchTaxonPages,
  fetchLibraries,
  fetchAllFields,
  fetchImagesets,
} from "@/assets/js/api/apiCalls";

const actions = {
  updateViewType({ commit }, payload) {
    commit("UPDATE_VIEW_TYPE", payload);
  },

  updateSearchParameters({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAMETERS", payload);
  },

  updateSearchParametersByField({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAMETERS_BY_FIELD", payload);
  },

  resetSearchParameters({ commit }, module) {
    commit("RESET_SEARCH_PARAMETERS", module);
  },

  setActiveSearchParametersFilters({ commit }, filters) {
    commit("SET_ACTIVE_SEARCH_PARAMETERS_FILTERS", filters);
  },

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
    return fetchProjects(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_SITES({ commit, state }) {
    return fetchSites(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_ATTACHMENTS({ commit, state }) {
    return fetchAttachments(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_REFERENCES({ commit, state }) {
    return fetchReferences(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_LIBRARIES({ commit, state }) {
    return fetchLibraries(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_IMAGESETS({ commit, state, rootGetters }) {
    return fetchImagesets(
      state.activeSearchParams.search,
      rootGetters["user/getCurrentAgent"].id
    ).then((resp) => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_LOCALITIES({ commit, state }) {
    return fetchLocalities(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_ANALYSIS_PARAMETERS({ commit, state }) {
    return fetchAnalysisParameters(state.activeSearchParams.search).then(
      (resp) => commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_ANALYSIS_METHODS({ commit, state }) {
    return fetchAnalysisMethods(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_SAMPLES({ commit, state }) {
    return fetchSamples(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_ANALYSES({ commit, state }) {
    return fetchAnalyses(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_DOIS({ commit, state }) {
    return fetchDois(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_SPECIMENS({ commit, state }) {
    return fetchSpecimens(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_KEYWORDS({ commit, state }) {
    return fetchKeywords(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_JOURNALS({ commit, state }) {
    return fetchJournals(state.activeSearchParams.search).then((resp) =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_COLLECTIONS({ commit, state }) {
    return fetchCollections(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_TAXA({ commit, state }) {
    return fetchTaxa(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_SELECTION_SERIES({ commit, state }) {
    return fetchSelectionSeries(state.activeSearchParams.search).then(
      (resp) => {
        commit("SET_SIDEBAR_LIST", resp);
      }
    );
  },

  FETCH_AGENTS({ commit, state }) {
    return fetchAgents(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_PREPARATIONS({ commit, state }) {
    return fetchPreparations(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DRILLCORES({ commit, state }) {
    return fetchDrillcores(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DATASETS({ commit, state }) {
    return fetchDatasets(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_STRATIGRAPHY({ commit, state }) {
    return fetchStratigraphies(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_AREAS({ commit, state }) {
    return fetchAreas(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DRILLCORE_BOXES({ commit, state }) {
    return fetchDrillcoreBoxes(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_LOCATIONS({ commit, state }) {
    return fetchLocations(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_ROCKS({ commit, state }) {
    return fetchRocks(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DEACCESSIONS({ commit, state }) {
    return fetchDeaccessions(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_ACCESSIONS({ commit, state }) {
    return fetchAccessions(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_VISITS({ commit, state }) {
    return fetchVisits(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_LOANS({ commit, state }) {
    return fetchLoans(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_WEB_PAGES({ commit, state }) {
    return fetchWebPages(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_TAXON_PAGES({ commit, state }) {
    return fetchTaxonPages(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_WEB_NEWS({ commit, state }) {
    return fetchWebNews(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_SAMPLE_SERIES({ commit, state }) {
    return fetchSampleSeries(state.activeSearchParams.search).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_SARV_ISSUES({ commit, state, rootGetters }) {
    return fetchSarvIssues(
      state.activeSearchParams.search,
      rootGetters["user/getUserId"]
    ).then((resp) => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  fetchActiveSarvIssues({ commit, rootGetters }) {
    return fetchActiveSarvIssues(rootGetters["user/getUserId"]).then((resp) => {
      commit("SET_ACTIVE_SARV_ISSUES", resp);
    });
  },

  setActiveSarvIssues({ commit }, issues) {
    // Todo: Pointless line (should be removed after new api service is implemented)
    const data = issues?.data ?? issues;
    commit("SET_ACTIVE_SARV_ISSUES", data);
  },

  updateIsSampleSimpleView({ commit }, boolVal) {
    commit("UPDATE_IS_SAMPLE_SIMPLE_VIEW", boolVal);
  },

  setSidebarUserAction: ({ commit }, userAction) => {
    commit("SET_SIDEBAR_USER_ACTION", userAction);
  },

  setActiveSearchParameters({ commit }, params) {
    commit("SET_ACTIVE_SEARCH_PARAMETERS", params);
  },

  resetActiveSearchParameters({ commit }) {
    commit("RESET_ACTIVE_SEARCH_PARAMETERS");
  },

  activeSearchParamsNextPage({ commit }) {
    commit("UPDATE_ACTIVE_SEARCH_PARAMETERS_PAGE", 1);
  },

  activeSearchParamsPreviousPage({ commit }) {
    commit("UPDATE_ACTIVE_SEARCH_PARAMETERS_PAGE", -1);
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

  updateActiveTab({ commit }, payload) {
    commit("UPDATE_ACTIVE_TAB", payload);
  },

  getActiveSelectionSeriesList({ commit }, payload) {
    fetchActiveSelectionSeriesList(
      payload.routeObject,
      payload.selectionSeriesId
    ).then((response) => {
      let results = response?.data?.results || null;
      if (results && results.length > 0) {
        // results = results.map(item => item[payload.routeObject]);
        commit("SET_ACTIVE_SELECTION_SERIES_LIST", results);
      } else commit("SET_ACTIVE_SELECTION_SERIES_LIST", null);
    });
  },

  getActiveLibraryList({ commit }, payload) {
    fetchActiveLibraryList(payload.libraryId).then((response) => {
      let results = response?.data?.results || null;
      if (results && results.length > 0) {
        // results = results.map(item => item.reference);
        commit("SET_ACTIVE_LIBRARY_LIST", results);
      } else commit("SET_ACTIVE_LIBRARY_LIST", null);
    });
  },

  resetActiveSelectionSeriesList({ commit }) {
    commit("RESET_ACTIVE_SELECTION_SERIES_LIST");
  },

  resetActiveLibraryList({ commit }) {
    commit("RESET_ACTIVE_LIBRARY_LIST");
  },
};

export default actions;
