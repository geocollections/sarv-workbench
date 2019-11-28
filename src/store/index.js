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
      activeSelectionSeries: null,
      shortcuts: [],
      activeRelatedDataTab: {},
      drawerState: null,
      drawerRightState: null,
      accessibility: {
        zoom: 1
      },
      appSettings: {
        bodyColor: "grey lighten-5",
        bodyDark: false,
        bodyActiveColor: "deep-orange",
        bodyActiveColorDark: true,
        navbarColor: "blue-grey",
        navbarDark: true,
        drawerLeftColor: "white",
        drawerLeftDark: false,
        drawerLeftActiveColor: "black",
        drawerRightColor: "white",
        drawerRightDark: false,
        drawerRightActiveColor: "deep-orange"
      },
      mapSettings: {
        showMap: true,
        defaultLayer: "OpenStreetMap"
      },
      recentUrls: [],
      recentUrlsState: false
    },
    actions,
    mutations,
    getters
  });
}
