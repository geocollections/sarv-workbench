import Vue from "vue";

const mutations = {
  UPDATE_VIEW_TYPE(state, payload) {
    state[`${payload.module}ViewType`] = payload.type;
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    state[`${payload.module}SearchParameters`] = payload.parameters;
  },

  UPDATE_SEARCH_PARAMETERS_BY_FIELD(state, payload) {
    Vue.set(
      state[`${payload.module}SearchParameters`],
      payload.field,
      payload.value
    );
    // state[`${payload.module}SearchParameters`][payload.field] = payload.value;
  },

  RESET_SEARCH_PARAMETERS(state, payload) {
    Object.keys(state[`${payload}SearchParameters`]).forEach((key) => {
      if (key === "page") state[`${payload}SearchParameters`][key] = 1;
      else if (key === "paginateBy")
        state[`${payload}SearchParameters`][key] = 50;
      else if (key === "sortBy")
        state[`${payload}SearchParameters`][key] = ["id"];
      else if (key === "sortDesc")
        state[`${payload}SearchParameters`][key] = [true];
      else if (key === "specimen_image_attachment")
        state[`${payload}SearchParameters`][key] = ["2", "1", "3", "4"];
      else if (key.endsWith("__lookuptype"))
        state[`${payload}SearchParameters`][key] = "icontains";
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
        : null,
    };
  },

  SET_ACTIVE_SARV_ISSUES(state, payload) {
    state.activeSarvIssues = payload.data;
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
  },

  RESET_ACTIVE_SELECTION_SERIES_LIST(state) {
    state.activeSelectionSeriesList = null;
  },

  RESET_ACTIVE_LIBRARY_LIST(state) {
    state.activeLibraryList = null;
  },

  SET_ACTIVE_SELECTION_SERIES_LIST(state, payload) {
    state.activeSelectionSeriesList = payload || null;
  },

  SET_ACTIVE_LIBRARY_LIST(state, payload) {
    state.activeLibraryList = payload || null;
  },
};

export default mutations;
