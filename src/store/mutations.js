import Vue from "vue";
import isEmpty from "lodash/isEmpty";

export default {
  SET_ACTIVE_OBJECTS: state => {
    const activeLibrary = Vue.localStorage.get("activeLibrary", null);
    const activeProject = Vue.localStorage.get("activeProject", null);
    const activeSite = Vue.localStorage.get("activeSite", null);
    const activeSample = Vue.localStorage.get("activeSample", null);
    const activeSelectionSeries = Vue.localStorage.get(
      "activeSelectionSeries",
      null
    );

    if (activeLibrary && !isEmpty(activeLibrary))
      Vue.set(state, "activeLibrary", activeLibrary);
    if (activeProject && !isEmpty(activeProject))
      Vue.set(state, "activeProject", activeProject);
    if (activeSite && !isEmpty(activeSite))
      Vue.set(state, "activeSite", activeSite);
    if (activeSample && !isEmpty(activeSample))
      Vue.set(state, "activeSample", activeSample);
    if (activeSelectionSeries && !isEmpty(activeSelectionSeries))
      Vue.set(state, "activeSelectionSeries", activeSelectionSeries);
  },

  SET_CURRENT_USER: state => {
    const authUser = Vue.localStorage.get("authUser", null);

    let currentUser = {
      id: authUser.agent_id,
      agent: authUser.agent,
      forename: authUser.name,
      surename: authUser.surname,
      user: authUser.user
    };
    let permissions = authUser.permissions;
    let databaseId = authUser.database_id;

    if (authUser && !isEmpty(authUser)) {
      Vue.set(state, "currentUser", currentUser);
      Vue.set(state, "permissions", permissions);
      Vue.set(state, "databaseId", databaseId);
    }
  },

  SET_RECENT_URLS: state => {
    const recentUrls = Vue.localStorage.get("recentUrls", null);

    if (recentUrls && !isEmpty(recentUrls))
      Vue.set(state, "recentUrls", recentUrls);
  },

  UPDATE_RECENT_URLS: (state, urlObject) => {
    let recentUrls = Vue.localStorage.get("recentUrls", null);

    if (recentUrls && !isEmpty(recentUrls)) {
      recentUrls.push(urlObject);
      if (recentUrls.length > 10) recentUrls.shift();

      // If after removing is still over 10 then empty that (I don't want to use loop here);
      if (recentUrls.length > 10) recentUrls = [];
    } else {
      recentUrls = [];
      recentUrls.push(urlObject);
    }

    Vue.localStorage.set("recentUrls", recentUrls);
    Vue.set(state, "recentUrls", recentUrls);
  },

  TOGGLE_RECENT_URLS: (state, boolValue) => {
    Vue.set(state, "showRecentUrls", boolValue);
  },

  CREATE_RELATION_OBJECT: (state, { createRelationWith }) => {
    Vue.set(state, "createRelationWith", createRelationWith);
  },

  REMOVE_RELATION_OBJECT: state => {
    Vue.set(state, "createRelationWith", {
      object: null,
      data: null,
      info: null,
      edit: null
    });
  },

  SET_ACTIVE_SEARCH_PARAMS: (state, params) => {
    Vue.set(state, "activeSearchParams", params);
  },

  SET_SIDEBAR_LIST: (state, { resp }) => {
    /* false means page not found */
    Vue.set(state, "sidebarList", {
      results: resp.body.results || false,
      page: resp.body.page,
      totalPages: resp.body.page ? resp.body.page.split(" of ")[1] : undefined
    });
  },

  SET_SIDEBAR_USER_ACTION: (state, userAction) => {
    Vue.set(state, "sidebarUserAction", userAction);
  },

  SET_ACTIVE_LIBRARY: (state, object) => {
    Vue.localStorage.set("activeLibrary", object);
    Vue.set(state, "activeLibrary", object);
  },

  SET_ACTIVE_SELECTION_SERIES: (state, object) => {
    Vue.localStorage.set("activeSelectionSeries", object);
    Vue.set(state, "activeSelectionSeries", object);
  },

  SET_ACTIVE_PROJECT: (state, object) => {
    Vue.localStorage.set("activeProject", object);
    Vue.set(state, "activeProject", object);
  },

  SET_ACTIVE_SAMPLE: (state, object) => {
    Vue.localStorage.set("activeSample", object);
    Vue.set(state, "activeSample", object);
  },

  SET_ACTIVE_SITE: (state, object) => {
    Vue.localStorage.set("activeSite", object);
    Vue.set(state, "activeSite", object);
  },

  SET_SHORTCUTS: (state, { shortcuts }) => {
    Vue.localStorage.set("shortcuts", JSON.stringify(shortcuts));
    Vue.set(state, "shortcuts", shortcuts);
  },

  GET_SHORTCUTS: state => {
    const shortcuts = Vue.localStorage.get("shortcuts", null);

    if (
      typeof shortcuts !== "undefined" &&
      shortcuts !== null &&
      !isEmpty(shortcuts)
    ) {
      Vue.set(state, "shortcuts", JSON.parse(shortcuts));
    } else {
      Vue.set(state, "shortcuts", []);
    }
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    Vue.set(state.tableSearchParameters, payload.module, {
      searchParameters: payload.params,
      filters: payload.filters
    });
  },

  UPDATE_ACTIVE_TAB(state, payload) {
    Vue.set(state.activeRelatedDataTab, payload.object, payload.tab);
  },

  UPDATE_DRAWER_STATE(state, payload) {
    Vue.set(state, "drawerState", payload);
  },

  UPDATE_DRAWER_RIGHT_STATE(state, payload) {
    Vue.set(state, "drawerRightState", payload);
  },

  UPDATE_APP_ZOOM(state, zoomLevel) {
    Vue.set(state.accessibility, "zoom", zoomLevel);
  },

  UPDATE_APP_SETTINGS(state, settings) {
    this.$localStorage.set("SARV_APP_SETTINGS", settings);
    Vue.set(state, "appSettings", settings);
  },

  INITIALISE_APP_SETTINGS(state) {
    let settings = Vue.localStorage.get("SARV_APP_SETTINGS");
    if (
      settings &&
      Object.entries(settings).length > 0 &&
      settings.constructor === Object
    ) {
      Vue.set(state, "appSettings", settings);
    }
  },

  UPDATE_MAP_STATE(state, mapState) {
    let mapSettings = Vue.localStorage.get("SARV_MAP_SETTINGS", null);

    if (mapSettings && !isEmpty(mapSettings)) {
      mapSettings.showMap = mapState;
    } else {
      mapSettings = {};
      mapSettings.showMap = mapState;
    }
    Vue.localStorage.set("SARV_MAP_SETTINGS", mapSettings);

    Vue.set(state.mapSettings, "showMap", mapState);
  },

  UPDATE_MAP_DEFAULT_LAYER(state, layerName) {
    let mapSettings = Vue.localStorage.get("SARV_MAP_SETTINGS", null);

    if (mapSettings && !isEmpty(mapSettings)) {
      mapSettings.defaultLayer = layerName;
    } else {
      mapSettings = {};
      mapSettings.defaultLayer = layerName;
    }
    Vue.localStorage.set("SARV_MAP_SETTINGS", mapSettings);

    Vue.set(state.mapSettings, "defaultLayer", layerName);
  },

  INITIALISE_MAP_SETTINGS(state) {
    let mapSettings = Vue.localStorage.get("SARV_MAP_SETTINGS");
    if (
      mapSettings &&
      Object.entries(mapSettings).length > 0 &&
      mapSettings.constructor === Object
    ) {
      Vue.set(state, "mapSettings", mapSettings);
    }
  }
};
