import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueLocalStorage from "vue-localstorage"; // VueLocalStorage for using local storage
import VueIziToast from "vue-izitoast"; // Pop-up messages
import VueI18n from "vue-i18n"; // Translations
import VueCookies from "vue-cookies";
import { createStore } from "./store";
import VueScrollTo from "vue-scrollto";
import animated from "animate.css";
import vuetify from "./plugins/vuetify";

// Bootstrap css
import "bootstrap/dist/css/bootstrap.css";

import "izitoast/dist/css/iziToast.min.css"; // Pop-up messages style
import "leaflet/dist/leaflet.css"; // Leaflet css
// Custom css
import "@/assets/css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

Vue.use(VueLocalStorage);
Vue.use(VueIziToast);
Vue.use(VueI18n);
Vue.use(VueCookies);
Vue.use(VueScrollTo, {
  container: "body",
  duration: 100,
  easing: "ease",
  offset: -48,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});
Vue.use(animated);
Vue.use(require("vue-moment"));

Vue.config.productionTip = false;

/******************************
 *** TRANSLATION CODE START ***
 ******************************/

// Gets translations from json files
const messages = {
  en: require("./translations/en"),
  ee: require("./translations/ee")
};

// Gets preferred language from localStorage (fallback is ee)
const lang = Vue.localStorage.get("geocollectionsFileUploadLang", "ee");

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: "en",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages
});
/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/

Vue.directive("translate", function(el, binding) {
  let value = i18n.locale === "ee" ? binding.value.et : binding.value.en;
  el.innerHTML = typeof value !== "undefined" && value !== null ? value : "";
});

const store = createStore();
new Vue({
  i18n,
  store,
  router,
  vuetify,
  localStorage: {
    createRelationWith: {
      type: Object
    },
    sampleView: {
      type: Boolean,
      default: true
    },
    refreshForm: {
      type: Boolean,
      default: false
    },
    sidebar: {
      type: Boolean
    },
    mapComponent: {
      type: Boolean,
      default: false
    },
    activeProject: {
      type: Object
    },
    activeLibrary: {
      type: Object
    },
    activeSelectionSeries: {
      type: Object
    },
    activeSample: {
      type: Object
    },
    activeSite: {
      type: Object
    },
    photoArchive: {
      type: Object
    },
    specimenImage: {
      type: Object
    },
    otherFiles: {
      type: Object
    },
    digitisedReference: {
      type: Object
    },
    geocollectionsFileUploadLang: {
      type: String,
      default: "ee"
    },
    photoArchiveKeywords: {
      type: Object
    },
    specimenImageKeywords: {
      type: Object
    },
    otherFilesKeywords: {
      type: Object
    },
    imageset: {
      type: Object
    },
    attachmentSearchHistory: {
      type: Object
    },
    attachmentViewType: {
      type: String,
      default: "table"
    },
    referenceSearchHistory: {
      type: Object
    },
    referenceViewType: {
      type: String,
      default: "table"
    },
    localitySearchHistory: {
      type: Object
    },
    localityViewType: {
      type: String,
      default: "table"
    },
    sampleSearchHistory: {
      type: Object
    },
    sampleViewType: {
      type: String,
      default: "table"
    },
    projectSearchHistory: {
      type: Object
    },
    projectViewType: {
      type: String,
      default: "table"
    },
    siteSearchHistory: {
      type: Object
    },
    siteViewType: {
      type: String,
      default: "table"
    },
    librarySearchHistory: {
      type: Object
    },
    libraryViewType: {
      type: String,
      default: "table"
    },
    doiSearchHistory: {
      type: Object
    },
    doiViewType: {
      type: String,
      default: "table"
    },
    analysisSearchHistory: {
      type: Object
    },
    analysisViewType: {
      type: String,
      default: "table"
    },
    specimenSearchHistory: {
      type: Object
    },
    specimenViewType: {
      type: String,
      default: "table"
    },
    journalSearchHistory: {
      type: Object
    },
    journalViewType: {
      type: String,
      default: "table"
    },
    keywordSearchHistory: {
      type: Object
    },
    keywordViewType: {
      type: String,
      default: "table"
    },
    collectionSearchHistory: {
      type: Object
    },
    collectionViewType: {
      type: String,
      default: "table"
    },
    taxonSearchHistory: {
      type: Object
    },
    taxonViewType: {
      type: String,
      default: "table"
    },
    selectionSeriesSearchHistory: {
      type: Object
    },
    selectionSeriesViewType: {
      type: String,
      default: "table"
    },
    agentSearchHistory: {
      type: Object
    },
    agentViewType: {
      type: String,
      default: "table"
    },
    drillcoreSearchHistory: {
      type: Object
    },
    drillcoreViewType: {
      type: String,
      default: "table"
    },
    preparationSearchHistory: {
      type: Object
    },
    preparationViewType: {
      type: String,
      default: "table"
    },
    datasetSearchHistory: {
      type: Object
    },
    datasetViewType: {
      type: String,
      default: "table"
    },
    stratigraphySearchHistory: {
      type: Object
    },
    stratigraphyViewType: {
      type: String,
      default: "table"
    },
    areaSearchHistory: {
      type: Object
    },
    areaViewType: {
      type: String,
      default: "table"
    },
    drillcoreBoxSearchHistory: {
      type: Object
    },
    drillcoreBoxViewType: {
      type: String,
      default: "table"
    },
    locationBoxSearchHistory: {
      type: Object
    },
    locationBoxViewType: {
      type: String,
      default: "table"
    },
    rockBoxSearchHistory: {
      type: Object
    },
    rockBoxViewType: {
      type: String,
      default: "table"
    },
    deaccessionSearchHistory: {
      type: Object
    },
    deaccessionViewType: {
      type: String,
      default: "table"
    },
    accessionSearchHistory: {
      type: Object
    },
    accessionViewType: {
      type: String,
      default: "table"
    },
    visitSearchHistory: {
      type: Object
    },
    visitViewType: {
      type: String,
      default: "table"
    },
    loanSearchHistory: {
      type: Object
    },
    loanViewType: {
      type: String,
      default: "table"
    },
    webNewsSearchHistory: {
      type: Object
    },
    webNewsViewType: {
      type: String,
      default: "table"
    },
    webPagesSearchHistory: {
      type: Object
    },
    webPagesViewType: {
      type: String,
      default: "table"
    },
    formSections: {
      type: Object
    },
    authUser: {
      type: Object
    },
    shortcuts: {
      type: Object
    },
    specimen: {
      type: Object
    },
    SARV_APP_ZOOM_LEVEL: {
      type: Number
    },
    SARV_APP_SETTINGS: {
      type: Object
    },
    SARV_MAP_SETTINGS: {
      type: Object
    },
    recentUrls: {
      type: Array
    },
    recentUrlsState: {
      type: Boolean
    }
  },
  render: h => h(App)
}).$mount("#app");
