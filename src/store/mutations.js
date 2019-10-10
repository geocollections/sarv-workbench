import Vue from "vue";
import isEmpty from "lodash/isEmpty";

export default {
  SET_ACTIVE_OBJECTS: state => {
    const activeLibrary = Vue.localStorage.get("activeLibrary", null);
    const activeProject = Vue.localStorage.get("activeProject", null);

    if (activeLibrary && !isEmpty(activeLibrary))
      Vue.set(state, "activeLibrary", activeLibrary);
    if (activeProject && !isEmpty(activeProject))
      Vue.set(state, "activeProject", activeProject);
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

  SET_ACTIVE_PROJECT: (state, object) => {
    Vue.localStorage.set("activeProject", object);
    Vue.set(state, "activeProject", object);
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
  }
};
