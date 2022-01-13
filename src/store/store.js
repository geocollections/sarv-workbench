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
import sample from "./modules/sample";
import sample_series from "./modules/sample_series";
import preparation from "./modules/preparation";
import analysis from "./modules/analysis";
import analysis_parameter from "./modules/analysis_parameter";
import analysis_method from "./modules/analysis_method";
import dataset from "./modules/dataset";
import doi from "./modules/doi";
import specimen from "./modules/specimen";
import collection from "./modules/collection";
import taxon from "./modules/taxon";
import rock from "./modules/rock";
import stratigraphy from "./modules/stratigraphy";
import selection_series from "./modules/selection_series";
import agent from "./modules/agent";
import location from "./modules/location";
import visit from "./modules/visit";
import loan from "./modules/loan";
import accession from "./modules/accession";
import deaccession from "./modules/deaccession";
import web_news from "./modules/web_news";
import web_pages from "./modules/web_pages";
import taxon_page from "./modules/taxon_page";
import sarv_issue from "./modules/sarv_issue";

Vue.use(Vuex);

function buildLocalStorageKey() {
  const hostname = window?.location?.hostname;
  const devVersion = "_v2.0.0";
  const liveVersion = "_v2.0.0";
  const localVersion = "_v2.0.2";

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
    sample,
    sample_series,
    preparation,
    analysis,
    analysis_parameter,
    analysis_method,
    dataset,
    doi,
    specimen,
    collection,
    taxon,
    rock,
    stratigraphy,
    selection_series,
    agent,
    location,
    visit,
    loan,
    accession,
    deaccession,
    web_news,
    web_pages,
    taxon_page,
    sarv_issue,
  },
  actions,
  state,
  getters,
  mutations,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production",
});
