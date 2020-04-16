import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
Vue.use(Vuex);

// import map from "./modules/map";
// import search from "./modules/search";
// import settings from "./modules/settings";
// import user from "./modules/user";

// Vue.use(Vuex);

function buildLocalStorageKey() {
  const hostname = window?.location?.hostname;
  const devVersion = "_v1.0";
  const liveVersion = "_v1.0";
  const localVersion = "_v1.0";

  if (hostname) {
    if (hostname.startsWith("edit2.")) {
      return hostname + devVersion;
    } else if (hostname.startsWith("edit.")) {
      return hostname + liveVersion;
    } else return hostname + localVersion;
  } else return "edit.geocollections.info" + liveVersion;
}

const vuexLocal = new VuexPersistence({
  key: buildLocalStorageKey(),
  storage: window.localStorage
  // reducer: state => ({ settings: state.settings })
});

// export default new Vuex.Store({
//   modules: {
//     map,
//     search,
//     settings,
//     user
//   },
//   plugins: [vuexLocal.plugin],
//   strict: process.env.NODE_ENV !== "production"
// });

export function createStore() {
  return new Vuex.Store({
    state: {
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
      activeRelatedDataTab: {},
      accessibility: {
        zoom: 1
      },

      // into settings module start
      recentUrls: [],
      recentUrlsState: false,
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
      drawerState: null,
      drawerRightState: null,
      shortcuts: [],
      // into settings module end



      // into search module start
      loadingState: false,
      loadingType: "fetch",
      loadingPercent: 0,
      // into search module end



      // into user module start
      currentUser: null,
      permissions: null,
      databaseId: null,
      // into user module end



      // into map module start
      mapSettings: {
        showMap: true,
        defaultLayer: "OpenStreetMap"
      }
      // into map module end



    },
    actions,
    mutations,
    getters,
    plugins: [vuexLocal.plugin],
    strict: process.env.NODE_ENV !== "production"
  });
}
