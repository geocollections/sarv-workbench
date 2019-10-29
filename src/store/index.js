import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      currentUser: null,
      permissions: null,
      databaseId: null,
      createRelationWith: { object: null, data: null, info: null, edit: null },
      activeObject: null,
      sidebarList: [],
      activeSearchParams: null,
      tableSearchParameters: {},
      sidebarUserAction: null,
      activeLibrary: null,
      activeProject: null,
      activeSample: null,
      activeSite: null,
      shortcuts: [],
      activeRelatedDataTab: {},
      drawerState: null,
      drawerRightState: null
    },
    actions,
    mutations,
    getters
  });
}
