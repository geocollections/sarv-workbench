import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource' // VueResource for HTTP requests
import VueSession from 'vue-session' // VueSession for using session storage
import VueLocalStorage from 'vue-localstorage' // VueLocalStorage for using local storage
import BootstrapVue from 'bootstrap-vue' // Bootstrap
import VueIziToast from 'vue-izitoast' // Pop-up messages
import VueI18n from 'vue-i18n' // Translations
import VueMoment from 'vue-moment'
import VueCookie from 'vue-cookie'

// Leaflet START
import { L } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css' // Leaflet css


// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

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
// Custom css
import '@/assets/css/styles.css'

Vue.use(VueResource)
Vue.use(VueSession)
Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)
Vue.use(VueIziToast)
Vue.use(VueI18n)
Vue.use(VueMoment)
Vue.use(VueCookie)

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
  messages
})
/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/



// This adds session id and csrf to request | MUST BE BEFORE new Vue()
Vue.http.interceptors.push((request, next) => {
  let csrftoken = Vue.cookie.get('csrftoken')

  request.credentials = true;
  request.headers.set('X-CSRFTOKEN', csrftoken)

  next(res => {
    if (res.status === 200) {

      /**
       * If user is not logged in then session is destroyed
       * and user is redirected to login view.
       */
      if (res.body.error_not_logged_in) {
        Vue.prototype.$session.remove('authUser')
        Vue.prototype.$session.destroy()
        Vue.prototype.$toast.error('Please log back in', 'Session expired', {
          position: 'bottomRight',
          timeout: 5000,
          closeOnEscape: true,
          pauseOnHover: false
        })
        router.push({path: '/'})
      }

      if (res.body.link_error) {
        Vue.prototype.$toast.error(res.body.link_error, 'Error', {
          position: 'bottomRight',
          timeout: 99999999999,
          pauseOnHover: false
        })
      }
    }
  });
})

new Vue({
  i18n,
  router,
  localStorage: {
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
    referenceSearchHistory: {
      type: Object
    },
    referenceViewType: {
      type: Boolean,
      default: false
    },
    localitySearchHistory: {
      type: Object
    },
    localityViewType: {
      type: Boolean,
      default: false
    },
  },
  render: h => h(App)
}).$mount('#app')
