import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import { createStore } from "vuex-extensions";
import actions from "@/store/actions";
import getters from "@/store/getters";
import state from "@/store/state";
import mutations from "@/store/mutations";
import detail from "./modules/detail";
import map from "./modules/map";
import search from "./modules/search";
import settings from "./modules/settings";
import user from "./modules/user";
import admin from "./modules/admin";
import tableHeaders from "./modules/tableHeaders";
import journal from "./modules/journal";
import keyword from "./modules/keyword";
import project from "./modules/project";
import locality from "./modules/locality";
import drillcore from "./modules/drillcore";
import drillcore_box from "./modules/drillcore_box";
import site from "./modules/site";
import site_groundwater from "./modules/site_groundwater";
import area from "./modules/area";
import library from "./modules/library";
import reference from "./modules/reference";
import imageset from "./modules/imageset";
import attachment from "./modules/attachment";

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

export default createStore(Vuex.Store, {
  modules: {
    detail,
    map,
    search,
    settings,
    user,
    admin,
    tableHeaders,
    journal,
    keyword,
    project,
    locality,
    drillcore,
    drillcore_box,
    site,
    site_groundwater,
    area,
    library,
    reference,
    imageset,
    attachment,
  },
  actions,
  state,
  getters,
  mutations,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production",
});
