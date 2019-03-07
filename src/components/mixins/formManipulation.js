
import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";

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

        formData.append('data', dataToUpload)
        let url = this[object].id === undefined ? 'add/'+object+'/'+ this[object].id : 'change'+object+'/';
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
  }
};

export default formManipulation
