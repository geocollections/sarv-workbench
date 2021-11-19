import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import detail from "./modules/detail";
import map from "./modules/map";
import search from "./modules/search";
import settings from "./modules/settings";
import user from "./modules/user";
import admin from "./modules/admin";
import tableHeaders from "./modules/tableHeaders";
import journal from "./modules/journal";

Vue.use(Vuex);

function buildLocalStorageKey() {
  const hostname = window?.location?.hostname;
  const devVersion = "_v2.0.0";
  const liveVersion = "_v2.0.0";
  const localVersion = "_v2.0.0";

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
  reducer: (state) => ({
    ...state,
    search: { ...state.search, loadingState: false },
    settings: { ...state.settings, showGlobalNotification: true },
  }),
});

export default new Vuex.Store({
  modules: {
    detail,
    map,
    search,
    settings,
    user,
    admin,
    tableHeaders,
    journal,
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production",
});
