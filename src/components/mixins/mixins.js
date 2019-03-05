
import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
import {autocompleSearch} from "@/assets/js/api/apiCalls";

const formManipulation = {
  data(){
    return {
      apiUrl: 'https://rwapi.geocollections.info/',
      loadingPercent: 0,
      sendingData: false,
    }
  },
  methods: {
    isDefinedAndNotNullAndNotEmptyString(value) {return !!value && value !== null && value.trim().length > 0},
    isDefinedAndNotNull(value) {return !!value && value !== null},
    isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
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

        let formData = new FormData()

        const dataToUpload = this.formatDataForUpload(this[object]);
        console.log(dataToUpload)
        formData.append('data', dataToUpload)

        this.$http.post(this.apiUrl + 'add/'+object+'/', formData, {
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
    getAutocompleteQueryParameters(type,val) {
      let query = '';
      switch (type) {
        case 'locality': query = `locality/?multi_search=value:${val};fields:id,locality,locality_en;lookuptype:icontains&fields=id,locality,locality_en`; break;
        case 'stratigraphy_top':
        case 'stratigraphy_base':
          query = `stratigraphy/?multi_search=value:${val};fields:id,stratigraphy,stratigraphy_en;lookuptype:icontains&fields=id,stratigraphy,stratigraphy_en`; break;
        case 'agent': query = `agent/?multi_search=value:${val};fields:id,agent,forename,surename;lookuptype:icontains&fields=id,agent`; break;
        default:
          break;
      }
      return query
    },

    autcompleteLocalitySearch(value){
      this.autocompliteSearch(value,'locality','parent')
    },
    autcompleteStratigraphyTopSearch(value){
      this.autocompliteSearch(value,'stratigraphy_top','stratigraphy_top')
    },
    autcompleteStratigraphyBaseSearch(value){
      this.autocompliteSearch(value,'stratigraphy_base','stratigraphy_base')
    },
    autcompleteAgentSearch(value){
      this.autocompliteSearch(value,'agent','coord_det_agent')
    },
    autocompliteSearch(value,type, options) {
      if(value.length < 3)  this.autocomplete[options] = [];
      if(value.length > 2) {
        let query = this.getAutocompleteQueryParameters(type,value)
        if(query.length === 0) return
        this.autocomplete.loaders[type] = true;
        autocompleSearch(query).then((response) => {
          this.autocomplete.loaders[type] = false;
          this.autocomplete[options] = this.handleResponse(response)
        });
      }
    },
  }
}

export default formManipulation
