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

Vue.use(Vuex);

function buildLocalStorageKey() {
  let key = "sarv-wb";
  const version = "1";
  const isDev = window?.location?.hostname?.startsWith("edit-dev");
  if (isDev) key += "-dev";

  return `sarv-wb-${version}`;
}

const vuexLocal = new VuexPersistence({
  key: buildLocalStorageKey(),
  storage: window.localStorage,
  reducer: (state) => ({
    ...state,
    search: { ...state.search, loadingState: false, loadingPercent: 0 },
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
  },
  plugins: [vuexLocal.plugin],
  strict: import.meta.env.NODE_ENV !== "production",
});
