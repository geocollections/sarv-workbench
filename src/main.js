import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource' // VueResource for HTTP requests
import VueLocalStorage from 'vue-localstorage' // VueLocalStorage for using local storage
import BootstrapVue from 'bootstrap-vue' // Bootstrap
import VueIziToast from 'vue-izitoast' // Pop-up messages
import VueI18n from 'vue-i18n' // Translations
import VueMoment from 'vue-moment'
import VueCookies from 'vue-cookies'
import { createStore } from './store'
import Vuesax from 'vuesax'
import VueScrollTo from 'vue-scrollto'
import Vue2TocuhEvents from 'vue2-touch-events'
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use( CKEditor );

// Leaflet START
import { L } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css' // Leaflet css

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// Leaflet END


// Bootstrap css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'izitoast/dist/css/iziToast.min.css' // Pop-up messages style
import 'vue-multiselect/dist/vue-multiselect.min.css' // Select input
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';
// Custom css
import '@/assets/css/styles.css'

Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)
Vue.use(VueIziToast)
Vue.use(VueI18n)
Vue.use(VueMoment)
Vue.use(VueCookies)
Vue.use(Vuesax)
Vue.use(VueScrollTo, {
  container: "body",
  duration: 100,
  easing: "ease",
  offset: -76,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})
Vue.use(Vue2TocuhEvents)

Vue.config.productionTip = false



/******************************
 *** TRANSLATION CODE START ***
 ******************************/

// Gets translations from json files
const messages = {
  en: require('@/assets/locales/en.json'),
  ee: require('@/assets/locales/ee.json'),
};

// Gets preferred language from localStorage (fallback is ee)
const lang = Vue.localStorage.get('geocollectionsFileUploadLang', 'ee')

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  messages
})
/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/



// This adds csrf token to request | MUST BE BEFORE new Vue()
Vue.http.interceptors.push((request, next) => {
  // Only our rwapi needs csrftoken
  if (request.url.includes('rwapi')) {

    let csrftoken = Vue.cookies.get('csrftoken')

    request.credentials = true;
    request.headers.set('X-CSRFTOKEN', csrftoken)

    next(res => {
      if (res.status === 200) {

        if (res.body.error_permissions) {
          Vue.prototype.$toast.error(res.body.error_permissions, 'Missing permissions', {
            position: 'bottomRight',
            timeout: 5000,
            closeOnEscape: true,
            pauseOnHover: false,
          })
        }

        /**
         * If user is not logged in then session is destroyed
         * and user is redirected to login view.
         */
        if (res.body.error_not_logged_in) {
          Vue.cookies.remove('csrftokenLocalhost', null , 'localhost');
          Vue.cookies.remove('csrftoken', null, 'geocollections.info');
          Vue.localStorage.remove('authUser')
          Vue.prototype.$toast.error('Please log back in', 'Session expired', {
            position: 'bottomRight',
            timeout: 5000,
            closeOnEscape: true,
            pauseOnHover: false,
            displayMode: 'replace'
          })
          router.push({path: '/'})
        }

        if (res.body.link_error) {
          Vue.prototype.$toast.error(res.body.link_error, 'Error', {
            position: 'bottomRight',
            timeout: 99999999999,
            pauseOnHover: false,
            displayMode: 'replace'
          })
        }
      }
    });
  }
});

Vue.directive('translate', function (el, binding) {
  let value = i18n.locale === 'ee' ? binding.value.et : binding.value.en
  el.innerHTML = value === undefined || value === null ? '' : value
});

const store = createStore();
new Vue({
  i18n,
  store,
  router,
  localStorage: {
    createRelationWith:{
      type: Object
    },
    sampleView:{
      type: Boolean,
      dafault: true
    },
    refreshForm:{
      type: Boolean,
      dafault: false
    },
    sidebar:{
      type: Boolean
    },
    mapComponent:{
      type: Boolean,
      default: false
    },
    activeProject:{
      type: Object
    },
    activeLibrary:{
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
      default: 'ee'
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
      default: 'table'
    },
    referenceSearchHistory: {
      type: Object
    },
    referenceViewType: {
      type: String,
      default: 'table'
    },
    localitySearchHistory: {
      type: Object
    },
    sampleSearchHistory: {
      type: Object
    },
    projectSearchHistory: {
      type: Object
    },
    siteSearchHistory: {
      type: Object
    },
    localityViewType: {
      type: String,
      default: 'table'
    },
    librarySearchHistory: {
      type: Object
    },
    libraryViewType: {
      type: String,
      default: 'table'
    },
    doiSearchHistory: {
      type: Object
    },
    doiViewType: {
      type: String,
      default: 'table'
    },
    analysisSearchHistory: {
      type: Object
    },
    analysisViewType: {
      type: String,
      default: 'table'
    },
    formSections: {
      type: Object
    },
    authUser: {
      type: Object
    },
    shortcuts: {
      type: Object
    }
  },
  render: h => h(App)
}).$mount('#app')
