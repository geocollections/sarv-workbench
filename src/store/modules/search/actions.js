import {
  fetchActiveLibraryList,
  fetchActiveSelectionSeriesList,
} from "@/assets/js/api/apiCalls";

import Vue from "vue";

const actions = {
  updateViewType({ commit }, payload) {
    commit("UPDATE_VIEW_TYPE", payload);
  },

  updateSearchParametersByField({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAMETERS_BY_FIELD", payload);
  },

  resetSearchParameters({ commit }, module) {
    commit("RESET_SEARCH_PARAMETERS", module);
  },

  setLoadingState({ commit }, boolVal) {
    commit("SET_LOADING_STATE", boolVal);
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

  async getUserLibraries({ commit }, payload) {
    const response = await Vue.prototype.$api.rw.get("library", {
      defaultParams: {
        or_search: `agents__id: ${payload.agent.id} OR author: ${payload.agent.id}`,
      },
      options: {
        itemsPerPage: 1000,
      },
    });
    commit("SET_USER_LIBRARIES", {
      count: response?.count ?? 0,
      items: response?.results ?? [],
    });
  },

  async getUserSelectionSeries({ commit }, payload) {
    const response = await Vue.prototype.$api.rw.get("selection_series", {
      defaultParams: {
        user_added: payload.username,
      },
      options: {
        itemsPerPage: 1000,
      },
    });
    commit("SET_USER_SELECTION_SERIES", {
      count: response?.count ?? 0,
      items: response?.results ?? [],
    });
  },
};

export default actions;
