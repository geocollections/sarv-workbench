import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import detail from "./modules/detail";
import map from "./modules/map";
import search from "./modules/search";
import settings from "./modules/settings";
import user from "./modules/user";
import admin from "./modules/admin";

Vue.use(Vuex);

function buildLocalStorageKey() {
  const hostname = window?.location?.hostname;
  const devVersion = "_v1.0.7";
  const liveVersion = "_v1.0.7";
  const localVersion = "_v1.0.13";

  if (hostname) {
    if (hostname.startsWith("edit2.") || hostname.startsWith("edit3.")) {
      return hostname + devVersion;
    } else if (hostname.startsWith("edit.")) {
      return hostname + liveVersion;
    } else return hostname + localVersion;
  } else return "edit.geocollections.info" + liveVersion;
}

const vuexLocal = new VuexPersistence({
  key: buildLocalStorageKey(),
  storage: window.localStorage,
  reducer: state => ({
    ...state,
    search: { ...state.search, loadingState: false, loadingPercent: 0 },
    settings: { ...state.settings, showGlobalNotification: true }
  })
});

export default new Vuex.Store({
  modules: {
    detail,
    map,
    search,
    settings,
    user,
    admin
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
