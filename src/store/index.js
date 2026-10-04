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

  return `${key}-${version}`;
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

// Every tab writes its whole in-memory state to localStorage on each mutation,
// so a tab holding a stale token would overwrite a newer login from another tab.
// Pick up auth changes made in other tabs so all tabs share the same token.
function syncAuthUserAcrossTabs(store) {
  window.addEventListener("storage", (event) => {
    if (
      event.key !== vuexLocal.key ||
      event.storageArea !== window.localStorage
    )
      return;

    let authUser = null;
    try {
      authUser = JSON.parse(event.newValue)?.user?.authUser ?? null;
    } catch {
      return;
    }

    if (JSON.stringify(authUser) !== JSON.stringify(store.state.user.authUser))
      store.commit("user/SET_AUTH_USER", authUser);
  });
}

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
  plugins: [vuexLocal.plugin, syncAuthUserAcrossTabs],
  strict: import.meta.env.NODE_ENV !== "production",
});
