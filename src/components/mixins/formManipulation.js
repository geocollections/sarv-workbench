import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import VueMultiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash/cloneDeep'
library.add(faTimes, faExternalLinkAlt)

const formManipulation = {
  data(){
    return {
      apiUrl: 'https://rwapi.geocollections.info/',
      loadingPercent: 0,
      sendingData: false,
    }
  },
  components: {
    BFormInput,
    VueMultiselect,
    FontAwesomeIcon
  },
  methods: {
    isDefinedAndNotNullAndNotEmptyString(value) {return !!value && value !== null && value.trim().length > 0},
    isDefinedAndNotNull(value) {return !!value && value !== null},
    isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
    isEmptyObject(value) {
      for(var prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          return false;
        }
      }
      return true;
    },
    cancelRequest() {this.previousRequest.abort()},
    handleResponse(response){
      if (response.status === 200) {
        return (response.body.count > 0) ? response.body.results : []
      }
    },


    validate(object){
      let vm = this, isValid = true;
      this.requiredFields.forEach(function (el) {
        isValid &= vm.isDefinedAndNotNullAndNotEmptyString(vm[object][el])
      })
      return isValid
    },

    add(addAnother, object) {
      if (this.validate(object) && !this.sendingData) {

        this.sendingData = true;
        this.loadingPercent = 0;

        console.log(this)
        let url = this[object].id === undefined ? 'add/'+object+'/' : 'change/'+object+'/'+ this[object].id;

        let editableObject = cloneDeep(this[object]);
        if(this[object].id !== undefined){
          delete this[object]['id']
        }

        const dataToUpload = this.formatDataForUpload(this[object]);
        let formData = new FormData();
        formData.append('data', dataToUpload);

        this.$http.post(this.apiUrl + url, formData, {
          before(request) {
            this.previousRequest = request
          },
          progress: (e) => {
            if (e.lengthComputable) {
              // console.log("e.loaded: %o, e.total: %o, percent: %o", e.loaded, e.total, (e.loaded / e.total ) * 100);
              this.loadingPercent = Math.round((e.loaded / e.total) * 100)
            }
          }
        }).then(response => {
          console.log(response)
          this.sendingData = false
          if (response.status === 200) {
            if (typeof response.body.message !== 'undefined') {

              if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
                toastSuccess({text: response.body.message_et});
              } else {
                toastSuccess({text: response.body.message});
              }
              //before save object ID was removed
              this[object] = editableObject;
              //Reload logs is not working TODO
              this.$emit('data-loaded',this[object])
              if (!addAnother) {
                this.$router.push({ path: '/'+object })
              }
            }
            if (typeof response.body.error !== 'undefined') {

              if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
                toastError({text: response.body.error_et});
              } else {
                toastError({text: response.body.error});
              }

            }
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse))
          this.sendingData = false
          toastError({text: this.$t('messages.uploadError')})
        })

      } else if (this.sendingData) {
        // This shouldn't run unless user deletes html elements and tries to press 'add' button again
        toastError({text: this.$t('messages.easterEggError')})
      } else {
        toastError({text: this.$t('messages.checkForm')})
      }

    },
    reset(object) {
      this[object] = {}
    },
    windowOpenNewTab(name, path,query = {}, meta) {
      let routeData = this.$router.resolve({path: path, query: query, meta: meta});
      window.open(routeData.href, '_blank');
    },
    openGeoInNewWindow(params) {
      let width = 600;
      switch (params.object) {
        case "specimen":
          width = 1050;
          break;
        case "locality":
          width = 1025;
          break;
        case "doi":
          width = 1000;
      }
      window.open('https://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
    },
  }
};

export default formManipulation
