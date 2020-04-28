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
  activeRelatedDataTab: {},
  activeSearchParams: null,
  activeSearchParametersFilters: [],
  attachmentSearchParameters: {
    image_number: null,
    filename: null,
    specimen: null,
    imageInfo: null,
    locality: null,
    selectionId: null,
    selection: null,
    keyword: null,
    specimen_image_attachment: ["2", "1", "3", "4"],
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  attachmentViewType: "table",
  referenceSearchParameters: {
    author: null,
    year: null,
    title: null,
    bookJournal: null,
    abstractRemarks: null,
    keywords: null,
    id: null,
    libraryAuthorIdTitle: null,
    userAdded: null,
    isEstonianReference: null,
    isEstonianAuthor: null,
    solrSearch: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  referenceViewType: "table",
  selection_seriesSearchParameters: {
    id: null,
    name: null,
    remarks: null,
    user_added: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  selection_seriesViewType: "table",
  librarySearchParameters: {
    author_txt: null,
    year: null,
    title: null,
    reference: null,
    id: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["library"],
    sortDesc: [true]
  },
  libraryViewType: "table",
  journalSearchParameters: {
    journal: null,
    publisher: null,
    remarks: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  journalViewType: "table",
  keywordSearchParameters: {
    id: null,
    term: null,
    language: null,
    keyword_category: null,
    is_primary: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["id"],
    sortDesc: [true]
  },
  keywordViewType: "table",
  doiSearchParameters: {
    identifier: null,
    creators: null,
    publication_year: null,
    title: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  doiViewType: "table",
  projectSearchParameters: {
    name: null,
    id: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  projectViewType: "table",
  siteSearchParameters: {
    id: null,
    name: null,
    number: null,
    project: null,
    date_start: null,
    date_end: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["id"],
    sortDesc: [true]
  },
  siteViewType: "table",
  site_groundwaterSearchParameters: {
    site: null,
    type_txt: null,
    aquifer_system: null,
    aquifer: null,
    well_depth: null,
    filter_type: null,
    filter_top: null,
    filter_top_z: null,
    filter_bottom: null,
    filter_bottom_z: null,
    url_veka: null,
    remarks: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  site_groundwaterViewType: "table",
  areaSearchParameters: {
    name: null,
    type: null,
    area_ha: null,
    maakond: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["name"],
    sortDesc: [true]
  },
  areaViewType: "table",
  localitySearchParameters: {
    locality: null,
    number: null,
    county: null,
    country: null,
    agent: null,
    id: null,
    selectionId: null,
    selection: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  localityViewType: "table",
  stratigraphySearchParameters: {
    id: null,
    stratigraphy: null,
    type: null,
    rank: null,
    scope: null,
    parent: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["id"],
    sortDesc: [true]
  },
  stratigraphyViewType: "table",
  sampleSearchParameters: {
    locality: null,
    number: null,
    depth: null,
    stratigraphy: null,
    agent: null,
    storage: null,
    site: null,
    selectionId: null,
    selection: null,
    id: null,
    loan: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  sampleViewType: "table",
  isSampleSimpleView: false,
  sample_seriesSearchParameters: {
    name: null,
    locality: null,
    agent_collected: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  sample_seriesViewType: "table",
  analysisSearchParameters: {
    id: null,
    analysis_method: null,
    agentAndLab: null,
    selectionId: null,
    selection: null,
    sample: null,
    datasetId: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  analysisViewType: "table",
  preparationSearchParameters: {
    preparation_number: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  preparationViewType: "table",
  taxonSearchParameters: {
    id: null,
    taxon: null,
    author_year: null,
    taxon_epithet: null,
    parent__taxon: null,
    selectionId: null,
    selection: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  taxonViewType: "table",
  rockSearchParameters: {
    name: null,
    name_en: null,
    formula: null,
    rock_type: null,
    rock_rank: null,
    in_portal: null,
    in_estonia: null,
    user_changed: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["name"],
    sortDesc: [true]
  },
  rockViewType: "table",
  specimenSearchParameters: {
    idSpecimen: null,
    specimenNr: null,
    collNumber: null,
    fossil: null,
    mineralRock: null,
    locality: null,
    stratigraphy: null,
    agent_collected: null,
    storage: null,
    selectionId: null,
    selection: null,
    loan: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  specimenViewType: "table",
  collectionSearchParameters: {
    id: null,
    number: null,
    name: null,
    agent: null,
    locality: null,
    reference: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["collection_id"],
    sortDesc: [true]
  },
  collectionViewType: "table",
  locationSearchParameters: {
    location: null,
    location_location: null,
    stratigraphy_free: null,
    agent: null,
    user_added: null,
    date_added: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["id"],
    sortDesc: [true]
  },
  locationViewType: "table",
  agentSearchParameters: {
    id: null,
    agent: null,
    forename: null,
    surename: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["agent"],
    sortDesc: [false]
  },
  agentViewType: "table",
  drillcoreSearchParameters: {
    drillcore: null,
    boxes: null,
    locality: null,
    storage: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  drillcoreViewType: "table",
  drillcore_boxSearchParameters: {
    storage: null,
    drillcore: null,
    page: 1,
    paginateBy: 10,
    sortBy: ["drillcore"],
    sortDesc: [true]
  },
  drillcore_boxViewType: "table",
  datasetSearchParameters: {
    name: null,
    owner: null,
    date: null,
    remarks: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  datasetViewType: "table",
  visitSearchParameters: {
    visitor: null,
    date_arrived: null,
    date_left: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  visitViewType: "table",
  loanSearchParameters: {
    loan_number: null,
    project: null,
    borrower: null,
    date_start: null,
    date_end: null,
    isActive: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  loanViewType: "table",
  accessionSearchParameters: {
    number: null,
    description: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["number"],
    sortDesc: [true]
  },
  accessionViewType: "table",
  deaccessionSearchParameters: {
    number: null,
    description: null,
    page: 1,
    paginateBy: 50,
    sortBy: ["number"],
    sortDesc: [true]
  },
  deaccessionViewType: "table",
  web_newsSearchParameters: {
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  web_newsViewType: "table",
  web_pagesSearchParameters: {
    page: 1,
    paginateBy: 50,
    sortBy: ["id"],
    sortDesc: [true]
  },
  web_pagesViewType: "table"
};

const getters = {};

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

  FETCH_PROJECTS({ commit, state, rootGetters }) {
    return fetchProjects(
      state.activeSearchParams.search,
      rootGetters["user/getCurrentUser"].id
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_SITES({ commit, state }) {
    return fetchSites(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_ATTACHMENTS({ commit, state, rootGetters }) {
    return fetchAttachments(
      state.activeSearchParams.search,
      rootGetters["user/getCurrentUser"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_REFERENCES({ commit, state }) {
    return fetchReferences(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_LIBRARIES({ commit, state, rootGetters }) {
    return fetchLibrariesFromLibraryAgent(
      state.activeSearchParams.search,
      rootGetters["user/getCurrentUser"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_LOCALITIES({ commit, state }) {
    return fetchLocalities(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_SAMPLES({ commit, state, rootGetters }) {
    return fetchSamples(
      state.activeSearchParams.search,
      rootGetters["user/getDatabaseId"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_ANALYSES({ commit, state, rootGetters }) {
    return fetchAnalyses(
      state.activeSearchParams.search,
      rootGetters["user/getCurrentUser"],
      rootGetters["user/getDatabaseId"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_DOIS({ commit, state, rootGetters }) {
    return fetchDois(
      state.activeSearchParams.search,
      rootGetters["user/getDatabaseId"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_SPECIMENS({ commit, state, rootGetters }) {
    return fetchSpecimens(
      state.activeSearchParams.search,
      rootGetters["user/getDatabaseId"]
    ).then(resp => commit("SET_SIDEBAR_LIST", resp));
  },

  FETCH_KEYWORDS({ commit, state }) {
    return fetchKeywords(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_JOURNALS({ commit, state }) {
    return fetchJournals(state.activeSearchParams.search).then(resp =>
      commit("SET_SIDEBAR_LIST", resp)
    );
  },

  FETCH_COLLECTIONS({ commit, state }) {
    return fetchCollections(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_TAXA({ commit, state }) {
    return fetchTaxa(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_SELECTION_SERIES({ commit, state }) {
    return fetchSelectionSeries(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_AGENTS({ commit, state }) {
    return fetchAgents(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_PREPARATIONS({ commit, state }) {
    return fetchPreparations(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DRILLCORES({ commit, state }) {
    return fetchDrillcores(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DATASETS({ commit, state, rootGetters }) {
    return fetchDatasets(
      state.activeSearchParams.search,
      rootGetters["user/getDatabaseId"]
    ).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_STRATIGRAPHY({ commit, state }) {
    return fetchStratigraphies(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_AREAS({ commit, state }) {
    return fetchAreas(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DRILLCORE_BOXES({ commit, state }) {
    return fetchDrillcoreBoxes(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_LOCATIONS({ commit, state }) {
    return fetchLocations(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_ROCKS({ commit, state }) {
    return fetchRocks(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_DEACCESSIONS({ commit, state }) {
    return fetchDeaccessions(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_ACCESSIONS({ commit, state }) {
    return fetchAccessions(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_VISITS({ commit, state }) {
    return fetchVisits(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_LOANS({ commit, state, rootGetters }) {
    return fetchLoans(
      state.activeSearchParams.search,
      rootGetters["user/getDatabaseId"]
    ).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_WEB_PAGES({ commit, state }) {
    return fetchWebPages(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_WEB_NEWS({ commit, state }) {
    return fetchWebNews(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
  },

  FETCH_SAMPLE_SERIES({ commit, state }) {
    return fetchSampleSeries(state.activeSearchParams.search).then(resp => {
      commit("SET_SIDEBAR_LIST", resp);
    });
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
  }
};

const mutations = {
  UPDATE_VIEW_TYPE(state, payload) {
    state[`${payload.module}ViewType`] = payload.type;
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    state[`${payload.module}SearchParameters`] = payload.parameters;
  },

  UPDATE_SEARCH_PARAMETERS_BY_FIELD(state, payload) {
    state[`${payload.module}SearchParameters`][payload.field] = payload.value;
    if (payload.isDate) {
      // state["activeSearchParametersFilters"].find(item => item.id === payload.field).calendarState = false;
      // state["activeSearchParametersFilters"].find(item => item.id === payload.field).calendarStateDrawer = false;
    }
  },

  RESET_SEARCH_PARAMETERS(state, payload) {
    Object.keys(state[`${payload}SearchParameters`]).forEach(key => {
      if (key === "page") state[`${payload}SearchParameters`][key] = 1;
      else if (key === "paginateBy")
        state[`${payload}SearchParameters`][key] = 50;
      else if (key === "sortBy")
        state[`${payload}SearchParameters`][key] = ["id"];
      else if (key === "sortDesc")
        state[`${payload}SearchParameters`][key] = [true];
      else if (key === "specimen_image_attachment")
        state[`${payload}SearchParameters`][key] = ["2", "1", "3", "4"];
      else state[`${payload}SearchParameters`][key] = null;
    });
  },

  SET_ACTIVE_SEARCH_PARAMETERS_FILTERS(state, payload) {
    state.activeSearchParametersFilters = payload;
  },

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
    state.sidebarList = {
      results: payload?.data?.results,
      page: payload?.data?.page,
      totalPages: payload?.data?.page
        ? payload.data.page.split(" of ")[1]
        : null
    };
  },

  SET_ACTIVE_SEARCH_PARAMETERS(state, payload) {
    state.activeSearchParams = payload;
  },

  RESET_ACTIVE_SEARCH_PARAMETERS(state) {
    state.activeSearchParams = null;
  },

  UPDATE_ACTIVE_SEARCH_PARAMETERS_PAGE(state, payload) {
    state.activeSearchParams.search.page += payload;
  },

  SET_ACTIVE_LIBRARY: (state, payload) => {
    state.activeLibrary = payload;
  },

  SET_ACTIVE_SELECTION_SERIES: (state, payload) => {
    state.activeSelectionSeries = payload;
  },

  SET_ACTIVE_PROJECT: (state, payload) => {
    state.activeProject = payload;
  },

  SET_ACTIVE_SAMPLE: (state, payload) => {
    state.activeSample = payload;
  },

  SET_ACTIVE_SITE: (state, payload) => {
    state.activeSite = payload;
  },

  UPDATE_ACTIVE_TAB(state, payload) {
    Vue.set(state.activeRelatedDataTab, payload.object, payload.tab);
  },

  UPDATE_IS_SAMPLE_SIMPLE_VIEW(state, payload) {
    state.isSampleSimpleView = payload;
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
