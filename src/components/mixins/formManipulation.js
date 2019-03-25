import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import VueMultiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {faTimes,faExternalLinkAlt, faUserLock, faLock, faCalendarAlt, faCommentAlt, faLink, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'

library.add(faTimes, faUserLock, faLock, faCalendarAlt, faExternalLinkAlt,faCommentAlt,faLink,faPencilAlt,faTrashAlt)

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

  mounted(){
    this.$root.$on('user-choice', this.handleUserChoice);
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
    formatDateForUpload(date){ return typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0];},
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
      });
      return isValid
    },

    add(addAnother, object, isCopy = false, copyOfRelatedData = []) {
      if (this.validate(object) && !this.sendingData) {

        if(isCopy === true) {
          delete this[object]['id']
        }

        let url = this[object].id === undefined ? 'add/'+object+'/' : 'change/'+object+'/'+ this[object].id;

        let editableObject = cloneDeep(this[object]);
        if(this[object].id !== undefined){
          delete this[object]['id']
        }

        const dataToUpload = this.formatDataForUpload(this[object]);
        let formData = new FormData();
        formData.append('data', dataToUpload);

        this.saveData(object,formData,url, isCopy).then(savedObjectId => {
          if(isCopy === true && savedObjectId) {
            this.addCopyOfRelatedData(copyOfRelatedData,savedObjectId);
            return true;
          } else if (isCopy === true && savedObjectId === undefined) return false;

          if (savedObjectId === undefined || savedObjectId === false) return;

          //before save object ID was removed
          this[object] = editableObject;
          this.$emit('data-loaded',editableObject);
          if (!addAnother) {
            this.$router.push({ path: '/'+object })
          }
        }, errResponse => {
          return false;
        });

      } else if (this.sendingData) {
        // This shouldn't run unless user deletes html elements and tries to press 'add' button again
        toastError({text: this.$t('messages.easterEggError')})
      } else {
        toastError({text: this.$t('messages.checkForm')})
      }

    },

    saveData(type,formData,url, isCopy = false) {
      return new Promise(resolve => {
        this.request(type,formData,url,resolve, isCopy)
      })
    },

    request(object,formData,url,resolve, isCopy) {
      this.sendingData = isCopy ? false : true;
      this.loadingPercent = 0;

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
        this.sendingData = false
        if (response.status === 200) {
          if (typeof response.body.message !== 'undefined') {
            if (this.$i18n.locale === 'ee' && typeof response.body.message_et !== 'undefined') {
              toastSuccess({text: response.body.message_et});
            } else {
              toastSuccess({text: response.body.message});
            }
            resolve(response.body.id)
          }
          if (typeof response.body.error !== 'undefined') {

            if (this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
              toastError({text: response.body.error_et});
            } else {
              toastError({text: response.body.error});
            }
            resolve(false)

          }
        }
      }, errResponse => {
        console.log(this.$t('messages.uploadError'))
        console.log('ERROR: ' + JSON.stringify(errResponse));
        this.sendingData = false
        toastError({text: this.$t('messages.uploadError')});
        resolve(undefined)
      })
    },
    addRelationBetweenAnyObjectAndAttachment(attachmentId, object){
      let formData = new FormData()
      let uploadableObject = {
        attachment:attachmentId
      };
      uploadableObject[this.$store.state['createRelationWith'].object] =  this.$store.state['createRelationWith'].data.id

      const dataToUpload = JSON.stringify(uploadableObject);
      formData.append('data', dataToUpload)

      let url = 'add/'+object+'/';

      this.saveData(object,formData,url).then(isSuccessfullySaved => {
          console.log("Relation created with locality id: "+ this.$store.state['createRelationWith'].id)
      });

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

    removeUnnecessaryFields(object,copyFields){
      //copy only certain fields
      Object.entries(object).forEach(entry => {
        if (copyFields.indexOf(entry[0]) < 0) {
          delete object[entry[0]]
        }
      });
      return object;
    },

    handleUserChoice(choice){
      this.$root.$emit('close-confirmation');
      if(choice === 'LEAVE') {
        this.setActiveTab(this.nextTab, false)
      } else if(choice === 'CONTINUE') {
        // NOTHING TO DO
      } else if(choice === 'SAVE') {
        this.addRelatedData(this.activeTab);
        this.setActiveTab(this.nextTab, false);
      }
    },

    setActiveTab(type, isWarning = true){
      this.nextTab = type;
      if(isWarning && !this.isEmptyObject(this.relatedData.insert[this.activeTab])) {
        this.$root.$emit('show-confirmation');
      } else {
        // CLEAR PREVIOUS TAB DATA BECAUSE IT SHOULD BE SAVED
        this.relatedData.insert[this.activeTab]={};
        // this.activeTab = type;
        this.$emit('tab-changed',type);
        this.loadRelatedData(type);
      }
    },


    /** RELATED DATA STARTS**/
    /** related data is child component for such classes as locality, sample... and all methods from those classes
     * should be called as $parent but you can listen event in parent classes ex. this.$root.$on('related-data-added',this.addRelatedData);**/

    editRelatedData(object) {
      if(this.isEmptyObject(object.new)) return;
      let formData = new FormData();

      //CHECK REQUIRED FIELDS !!!
      let type = this.activeTab;
      if(this.checkRequiredFields(type)) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }
      let editableObject = this.removeUnnecessaryFields(object.new,this.relatedData.copyFields[type]);
      formData.append('data', this.formatRelatedData(editableObject));

      this.saveData(type,formData,'change/'+type+'/'+ object.id).then(isSuccessfullySaved => {
        //  UPDATE ROW DATA
        object = cloneDeep(object.new)
        this.$set(object, 'new', {});
        this.$set(object, 'editMode', false)
      });
    },

    addRelatedData(type) {
      if(this.isEmptyObject(this.relatedData.insert[this.activeTab])) return;
      let formData = new FormData();
      if(type === undefined) type = this.activeTab;

      this.formatRelatedDataForUpload(type,formData);
      this.saveData(type,formData,'add/'+type+'/').then(isSuccessfullySaved => {
        // RELOAD RELATED DATA IN CURRENT TAB
        this.loadRelatedData(type);
        // CLEAR PREVIOUS INSERT DATA
        this.relatedData.insert[this.activeTab]={};
      });
    },

    formatRelatedDataForUpload(type,formData){
      if(this.checkRequiredFields(type)) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }

      formData.append('data', this.formatRelatedData(this.relatedData.insert[type]));
    },
    // ?
    loadRelatedData(){},
    fillRelatedDataAutocompleteFields(){},
    editRow(entity){
      // console.log("EDIT RECORD" + JSON.stringify(entity));
      this.$set(entity, 'new', this.fillRelatedDataAutocompleteFields(cloneDeep(entity)));
      this.$set(entity, 'editMode', !entity.editMode)
    },
    allowRemove(entity){
      this.$set(entity, 'allowRemove', true)
    },
    removeRow(entity){
      console.log("DELETE RECORD" + JSON.stringify(entity))
    }

    /** RELATED DATA ENDS**/

  },
  watch: {
    'relatedData.page': {
      handler: function (newVal) {
        this.setActiveTab(this.activeTab)
      },
      deep: true
    }
  }
};

export default formManipulation
