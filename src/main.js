import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueIziToast from "vue-izitoast"; // Pop-up messages
import VueI18n from "vue-i18n"; // Translations
import VueCookies from "vue-cookies";
import store from "./store";
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

// Gets preferred language from store (fallback is ee)
const lang = store?.state?.settings?.lang || "ee";

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

new Vue({
  i18n,
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
