import { toastSuccess, toastError } from "@/assets/js/iziToast/iziToast";
import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import VueMultiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {faProjectDiagram,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes,faExternalLinkAlt, faUserLock, faLock, faCalendarAlt, faCommentAlt, faLink, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex';

library.add(faProjectDiagram,faGlobe,faFile,faFileExcel,faFileImage,faEye,faFolderOpen,faUserFriends,faFileContract,faInfo,faPenFancy,faTimes, faUserLock, faLock, faCalendarAlt, faExternalLinkAlt,faCommentAlt,faLink,faPencilAlt,faTrashAlt)

const formManipulation = {
  data(){
    return {
      fileUrl:'https://files.geocollections.info',
      apiUrl: 'https://rwapi.geocollections.info/',
      loadingPercent: 0,
      sendingData: false,
      editMode: false,
    }
  },
  components: {
    BFormInput,
    VueMultiselect,
    FontAwesomeIcon
  },
  created: function () {
    // Gets user data from session storage
    if (this.$session.exists() && this.$session.get('authUser') !== null) {
      const user = this.$session.get('authUser')
      this.currentUser = {
        id: user.agent_id,
        agent: null,
        forename: user.user,
        surename: null,
        user: user.user,
      }
      //console.log(this.agent);
    }
  },
  mounted(){
    this.$root.$on('user-choice', this.handleUserChoice);
    this.$parent.$on('button-clicked', this.hoverSaveOrCancelButtonClicked);
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
    formatDateForUpload(date){
      date = new Date(date)
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
      return typeof date === 'string' ? date.split('T')[0] : localISOTime.split('T')[0];
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
        console.log(vm[object][el])
        isValid &= vm.isDefinedAndNotNullAndNotEmptyString(vm[object][el])
      });
      return isValid
    },

    add(addAnother, object) {
      if (this.validate(object) && !this.sendingData) {

        let url = this[object].id === undefined ? 'add/'+object+'/' : 'change/'+object+'/'+ this[object].id;

        let editableObject = cloneDeep(this[object]);
        if(this[object].id !== undefined){
          delete this[object]['id']
        }

        const dataToUpload = this.formatDataForUpload(this[object]);
        let formData = new FormData();
        formData.append('data', dataToUpload);

        this.saveData(object,formData,url).then(savedObjectId => {
          //before save object ID was removed
          this[object] = editableObject;
          if (savedObjectId === undefined || savedObjectId === false) return;

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
      console.log(isCopy)
      if(!isCopy) this.sendingData = true;
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

    leaveFromEditView(object) {
      this.$router.push({ path: '/' + object })
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
      // If user clicks on currently active tab then do nothing
      if (this.activeTab === type) return

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
      if(this.checkRequiredFields(type,object.new)) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }

      let editableObject = this.removeUnnecessaryFields(object.new,this.relatedData.copyFields[type]);
      formData.append('data', this.formatRelatedData(editableObject));
      this.loadRelatedData(type).then(response => {
        // this allows to set edit mode for multiple row
        this.$set(object, 'editMode', false)
        // it is required to edit only one record
        this.editMode = false;
      });
      this.saveData(type,formData,'change/'+type+'/'+ object.id).then(isSuccessfullySaved => {
        //  UPDATE ROW DATA
        // object = cloneDeep(object.new)
        // this.$set(object, 'new', {});
        // RELOAD RELATED DATA IN CURRENT TAB
        this.loadRelatedData(type).then(response => {
          console.log(response)
          this.$set(object, 'editMode', false)
        });
      });
    },

    addRelatedData(type) {
      if(this.isEmptyObject(this.relatedData.insert[this.activeTab])) return;
      let formData = new FormData();
      if(type === undefined) type = this.activeTab;

      if(this.checkRequiredFields(type,this.relatedData.insert[type])) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }

      formData.append('data', this.formatRelatedData(this.relatedData.insert[type]));
      this.saveData(type,formData,'add/'+type+'/').then(isSuccessfullySaved => {
        // RELOAD RELATED DATA IN CURRENT TAB
        this.loadRelatedData(type);
        // CLEAR PREVIOUS INSERT DATA
        this.relatedData.insert[this.activeTab]={};
      });
    },


    // ?
    loadRelatedData(){},
    fillRelatedDataAutocompleteFields(){},
    editRow(entity){
      if(this.editMode === true) return;
      // console.log("EDIT RECORD" + JSON.stringify(entity));
      this.$set(entity, 'new', this.fillRelatedDataAutocompleteFields(cloneDeep(entity)));
      this.$set(entity, 'editMode', !entity.editMode)
      this.editMode = true;
    },
    allowRemove(entity){
      this.$set(entity, 'allowRemove', true)
    },
    removeRow(entity){
      console.log("DELETE RECORD" + JSON.stringify(entity))
    },

    /** RELATED DATA ENDS**/

    /** SHOW NEXT OR PREVIOUS RECORD STARTS**/
    findCurrentRecord(list,id) {
      return findIndex(list, function(item) { return item.id === id })
    },
    getListRecords(object) {
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');

      this.listSearch(searchHistory).then( results => {
        if(results.length === 0) {
          this.$root.$emit('disable-previous',true);
          this.$root.$emit('disable-next',true);
          return
        }

        let currentRecordId = this.findCurrentRecord(cloneDeep(results),this[object].id)

        if(currentRecordId === -1){
          this.previousRecord = this[object].id - 1;
          this.nextRecord = this[object].id + 1;
          this.$root.$emit('disable-previous',false);
          this.$root.$emit('disable-next',false);
          return
        }

        if(currentRecordId === 0) {
          this.$root.$emit('disable-previous',true)
        } else {
          this.previousRecord = results[currentRecordId-1].id;
          this.$root.$emit('disable-previous',false)
        }
        if(currentRecordId === results.length-1) {
          this.$root.$emit('disable-next',true)
        } else {
          this.nextRecord = results[currentRecordId+1].id;
          this.$root.$emit('disable-next',false)
        }

      })
    },

    listSearch(searchParams) {
      this.sendingData = true;
      return new Promise((resolve) => {
      this.fetchList(searchParams).then(response => {
        if (response.status === 200) {
          if (response.body.count === 0) resolve([]);
          if (response.body.count > 0)  resolve(response.body.results)
        }
        this.sendingData = false
        }, errResponse => {
          this.sendingData = false
        })
      });
    },

    hoverSaveOrCancelButtonClicked(choice, object) {
      if (choice === "SAVE") this.add(true, object)
      if (choice === "CANCEL") this.$router.push({ path: '/' + object })
      if (choice === "PREVIOUS") this.$router.push({ path: '/' + object + '/' + this.previousRecord });
      if (choice === "NEXT") this.$router.push({ path: '/' + object + '/' + this.nextRecord });
    },

    /** SHOW NEXT OR PREVIOUS RECORD ENDS**/

    composeFileUrl(file) {
      return this.fileUrl + '/small/' + file.substring(0, 2) + '/' + file.substring(2, 4) + '/' + file
    },


    getFormatIcon(fileName){
      let format = fileName.split('.')[1];
      if(['xlsx','xls'].indexOf(format) > -1 ) return 'file-excel';
      if(['jpg','png'].indexOf(format) > -1 ) return 'file-image';
      else return 'file'
    },

    // GET CURRENT LOCATION FROM GPS
    getGPSLocation() {
      let this_ = this;

      if (navigator.geolocation) {
        return new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(function (position) {

            resolve( {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          }, function (error) {
            if (error.code == error.PERMISSION_DENIED)
              this_.errorMessege = "Geolocation is not supported by this browser.";
            resolve (null)
          });
        });
      }
    },
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
