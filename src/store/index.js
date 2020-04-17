import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import map from "./modules/map";
import search from "./modules/search";
import settings from "./modules/settings";
import user from "./modules/user";

Vue.use(Vuex);

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

export default new Vuex.Store({
  modules: {
    map,
    search,
    settings,
    user
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production"
});
