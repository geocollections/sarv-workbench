import {toastSuccess, toastError} from "@/assets/js/iziToast/iziToast";
import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import VueMultiselect from 'vue-multiselect';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import {
  faBan,
  faSave,
  faDoorOpen,
  faProjectDiagram,
  faTag,
  faGlobeAmericas,
  faFileVideo,
  faFileAudio,
  faDownload,
  faVial,
  faVideo,
  faMicrophone,
  faCameraRetro,
  faChevronDown,
  faChevronUp,
  faGlobe,
  faFile,
  faFileExcel,
  faFileImage,
  faEye,
  faFolderOpen,
  faUserFriends,
  faFileContract,
  faInfo,
  faPenFancy,
  faTimes,
  faExternalLinkAlt,
  faUserLock,
  faLock,
  faCalendarAlt,
  faCommentAlt,
  faLink,
  faPencilAlt,
  faTrashAlt,
  faListOl,
  faMapMarked,
  faFilePdf,
  faCheck,
  faTimesCircle,
  faDatabase,
  faSitemap
} from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex';
import moment from 'moment'
import {toastInfo} from "../assets/js/iziToast/iziToast";
import {mapState} from "vuex";

library.add(faBan, faSave, faDoorOpen, faProjectDiagram, faTag, faGlobeAmericas, faFileVideo, faFileAudio, faDownload, faVial, faVideo, faMicrophone, faCameraRetro, faChevronDown, faChevronUp, faGlobe, faFile, faFileExcel, faFileImage, faEye, faFolderOpen, faUserFriends, faFileContract, faInfo, faPenFancy, faTimes, faUserLock, faLock, faCalendarAlt, faExternalLinkAlt, faCommentAlt, faLink, faPencilAlt, faTrashAlt, faListOl, faMapMarked, faFilePdf, faCheck, faTimesCircle, faDatabase, faSitemap)

const formManipulation = {
  data() {
    return {
      fileUrl: 'https://files.geocollections.info',
      apiUrl: 'https://rwapi.geocollections.info/',
      loadingPercent: 0,
      sendingData: false,
      editMode: false,
      showCollapseMap: true,
      activeObject: null
    }
  },
  components: {
    BFormInput,
    VueMultiselect,
    FontAwesomeIcon
  },
  mounted() {
    // Root event for confirmation modal which is emitted when user tries to leave the TAB without saving.
    this.$root.$on('user-choice', this.handleUserChoice);
    // this.$root.$on('sidebar-user-choice', this.handleSidebarUserChoice);

    this.$parent.$on('button-clicked', this.hoverSaveOrCancelButtonClicked);

  },
  beforeMount() {
    //localstorage settings
    let showCollapseMap = this.$localStorage.get('mapComponent', 'fallbackValue')
    if (typeof showCollapseMap === 'undefined' || showCollapseMap === 'fallbackValue') return
    this.showCollapseMap = showCollapseMap
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    isDefinedAndNotNullAndNotEmptyString(value) {
      return !!value && value !== null && (value + '').trim().length > 0
    },
    isDefinedAndNotNull(value) {
      return !!value && value !== null
    },
    isDefinedAndNotEmpty(value) {
      return !!value && value.length > 0
    },
    isEmptyObject(value) {
      for (var prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          return false;
        }
      }
      return true;
    },
    formatDateForUpload(date, onlyDate = true) {
      date = new Date(date)
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);

      if (onlyDate) return typeof date === 'string' ? date.split('T')[0] : localISOTime.split('T')[0];
      return localISOTime
    },

    cancelRequest() {
      this.previousRequest.abort()
    },
    handleResponse(response) {
      if (response.status === 200) {
        return (response.body.count > 0) ? response.body.results : []
      }
    },

    /**
     * Checks if required fields are okay to upload (not empty, null etc.)
     * @param object, String value of, e.g., 'doi', 'reference'.
     * @returns {boolean}
     */
    validate(object) {
      let vm = this, isValid = true;
      // console.log(vm[object])
      this.requiredFields.forEach(function (el) {
        isValid &= vm.isDefinedAndNotNullAndNotEmptyString(vm[object][el])
      });
      return isValid
    },

    add(addAnother, object, saveRelatedData = false, returnPromise = false) {

      return new Promise(resolve => {
        if (this.validate(object) && !this.sendingData) {

          let url = this[object].id === undefined ? 'add/' + object + '/' : 'change/' + object + '/' + this[object].id;

          let editableObject = cloneDeep(this[object]);
          if (this[object].id !== undefined) {
            delete this[object]['id']
          }

          const dataToUpload = this.formatDataForUpload(this[object], saveRelatedData);
          let formData = new FormData();
          formData.append('data', dataToUpload);

          this.saveData(object, formData, url).then(savedObjectId => {
            console.log(savedObjectId)
            //before save object ID was removed
            this[object] = editableObject;
            // if (savedObjectId === undefined || savedObjectId === false) return;
            this.$emit('data-loaded', editableObject);
            this.$emit('data-saved', true);

            if (!returnPromise) {
              if (savedObjectId && (savedObjectId === true || savedObjectId !== undefined)) {
                if (!addAnother) this.$router.push({path: '/' + object})
                else this.$router.push({path: '/' + object + '/' + savedObjectId})
              } else resolve(false)
            } else {
              resolve(true)

            }
          }, errResponse => {
            resolve(false)
            return false;
          });

        } else if (this.sendingData) {
          // This runs only if user deletes html elements and tries to press 'add' button again
          toastError({text: this.$t('messages.easterEggError')})
          resolve(false)
        } else {
          toastError({text: this.$t('messages.checkForm')})
          resolve(false)
        }
      });
    },

    saveData(type, formData, url, isCopy = false) {
      return new Promise(resolve => {
        this.request(type, formData, url, resolve, isCopy)
      })
    },

    request(object, formData, url, resolve, isCopy) {
      if (!isCopy) this.sendingData = true;
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
              resolve(response.body.id)
            } else {
              toastSuccess({text: response.body.message});
              resolve(response.body.id)
            }
            if (object === 'attachment' && response.body.attachments_ids) {
              if (response.body.attachments_ids.length > 1) resolve(response.body.attachments_ids)
              resolve(response.body.attachments_ids[0])
            } else
              resolve(response.body.id)
          }
          if (typeof response.body.error !== 'undefined') {
            resolve(false)
            if (this.$i18n && this.$i18n.locale === 'ee' && typeof response.body.error_et !== 'undefined') {
              toastError({text: response.body.error_et});
            } else {
              toastError({text: response.body.error});
            }
          }
        }
      }, errResponse => {
        console.log('ERROR: ' + JSON.stringify(errResponse));
        this.sendingData = false
        toastError({text: this.$t('messages.uploadError')});
        resolve(false)
      })
    },

    addFileAsObject(files, relatedObject) {
      let formData = new FormData();

      files.forEach((file, index) => {
        formData.append('data', JSON.stringify({
          description: file.type.includes('pdf') ? null : file.type + ' for ' + relatedObject + ': ' + this[relatedObject].id,
          author: file.type.includes('pdf') ? null : this.currentUser.id,
          date_created: file.type.includes('pdf') ? null : this.formatDateForUpload(new Date()),
          is_private: this[relatedObject].is_oa === true ? 0 : 1,
          specimen_image_attachment: relatedObject === 'reference' ? 4 : 3,
          [relatedObject]: this[relatedObject].id
        }));

        formData.append('file' + [index], file);
      });

      try {
        this.saveData('attachment', formData, 'add/attachment/', false).then(savedObjectId => {
          console.log(savedObjectId)
        });
      } catch (e) {
        console.log('Attachment cannot be added');
        console.log(e)
      }
    },

    addFileAsRelatedDataNew(files, relatedObject) {
      let attach_link = 'attach_link__' + relatedObject;

      let formData = new FormData();
      files.forEach((file, index) => {
        formData.append('data', JSON.stringify({
          description: file.type + ' for ' + relatedObject + ': ' + this[relatedObject].id,
          description_en: file.type + ' for ' + relatedObject + ': ' + this[relatedObject].id,
          author: this.currentUser.id,
          date_created: this.formatDateForUpload(new Date()),
          is_private: 1,
          related_data: { [attach_link]: [{ id: this[relatedObject].id }] }
        }));

        formData.append('file' + [index], file);
      });

      try {
        this.saveData('attachment', formData, 'add/attachment/', false).then(savedObjectId => {
          console.log(savedObjectId);
        });
      } catch (e) {
        console.log('Attachment cannot be added');
        console.log(e)
      }
    },

    addFileAsRelatedData(data, object) {
      let formData = new FormData();
      data.forEach((file, index) => {
        formData.append('data', JSON.stringify({
          description: file.type + ' for ' + object + ': ' + this[object].id,
          author: this.currentUser.id,
          date_created: this.formatDateForUpload(new Date()),
          is_private: 1,
        }));

        formData.append('file' + [index], file);
      });


      try {
        this.saveData('attachment', formData, 'add/attachment/', false).then(savedObjectId => {
          console.log(savedObjectId)
          if (savedObjectId === undefined || savedObjectId === false) return;
          let vm = this
          this.attachmentLinkSaved = savedObjectId.length > 0 ? savedObjectId.length : 1

          function createRelation(vm, object, file) {
            vm.addRelationBetweenAnyObjectAndAttachment(file, 'attachment_link', {
              object: object,
              id: vm[object].id
            }).then(response => {
              vm.attachmentLinkSaved -= 1;
            });
          }

          if (this.attachmentLinkSaved === 1)
            createRelation(vm, object, savedObjectId)
          else {
            savedObjectId.forEach(file => {
              createRelation(vm, object, file)
            })
          }
        });
      } catch (e) {
        console.log('Attachment cannot not be added')
        console.log(e)
      }

    },
    addRelationBetweenAnyObjectAndAttachment(attachmentId, object, createRelationWith = null) {
      let formData = new FormData()
      let uploadableObject = {
        attachment: attachmentId
      };
      if (createRelationWith !== null) {
        uploadableObject[createRelationWith.object] = createRelationWith.id
      } else
        uploadableObject[this.$store.state['createRelationWith'].object] = this.$store.state['createRelationWith'].data.id

      const dataToUpload = JSON.stringify(uploadableObject);
      formData.append('data', dataToUpload)

      let url = 'add/' + object + '/';
      return new Promise((resolve) => {
        this.saveData(object, formData, url).then(isSuccessfullySaved => {
          console.log("Relation created with locality id: " + this.$store.state['createRelationWith'].id)
          resolve(true)
        });
      })

    },

    reset(object, isEdit) {
      console.log('reset')
      if (typeof this.createRelationWith !== 'undefined' && this.createRelationWith.object !== null) window.close();
      else if (isEdit) this.$router.push({path: '/' + object})
      else {
        this[object] = {}
        toastInfo({text: this.$t('messages.fieldsCleared')})
      }
      // isEdit ? this.$router.push({ path: '/' + object }) : this[object] = {};
    },

    leaveFromEditView(object) {
      console.log(this.createRelationWith)
      if (this.createRelationWith.object !== null) {
        window.close()
      }
      this.$router.push({path: '/' + object})
    },

    windowOpenNewTab(name, path, query = {}, meta) {
      let routeData = this.$router.resolve({path: path, query: query, meta: meta});
      window.open(routeData.href, '_blank');
    },

    openGeoInNewWindow(params) {
      let width = 600;
      switch (params.object) {
        case "attachment":
        case "specimen":
          width = 1050;
          break;
        case "locality":
          width = 1025;
          break;
        case "doi":
          width = 1000;
          break;
      }
      window.open('https://geocollections.info/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750')
    },

    openUrlInNewWindow(params) {
      if (typeof (params.width) === 'undefined') {
        params.width = 800;
      }
      if (typeof (params.height) === 'undefined') {
        params.height = 750;
      }
      window.open(params.url, '', 'width=' + params.width + ',height=' + params.height);
    },

    openDOI(params) {
      window.open('https://doi.org/' + params.doi, '', 'width=1000,height=900')
    },

    openPdf(params) {
      window.open('https://files.geocollections.info/' + params.pdf.substring(0, 2) + '/' + params.pdf.substring(2, 4) + '/' + params.pdf, '', 'width=1000,height=900')
    },

    removeUnnecessaryFields(object, copyFields) {
      //copy only certain fields
      Object.entries(object).forEach(entry => {
        if (copyFields.indexOf(entry[0]) < 0) {
          delete object[entry[0]]
        }
      });
      return object;
    },

    handleUserChoice(choice) {
      this.$bvModal.hide('confirm-tab-close')

      if (choice === 'LEAVE') {
        this.setActiveTab(this.nextTab, false)
      } else if (choice === 'SAVE') {
        console.log(this)
        this.addRelatedData(this.activeTab, true);
        this.setActiveTab(this.nextTab, false);
      }
    },

    setActiveTab(type, isWarning = true) {
      // If user clicks on currently active tab then do nothing
      if (this.activeTab === type) return

      this.nextTab = type;
      if (isWarning && !this.isEmptyObject(this.relatedData.insert[this.activeTab])) {
        this.$bvModal.show('confirm-tab-close')
      } else {
        // CLEAR PREVIOUS TAB DATA BECAUSE IT SHOULD BE SAVED
        this.relatedData.insert[this.activeTab] = {};
        // this.activeTab = type;
        this.$emit('tab-changed', type);
        this.loadRelatedData(type);
      }
    },


    /** RELATED DATA STARTS**/
    /** related data is child component for such classes as locality, sample... and all methods from those classes
     * should be called as $parent but you can listen event in parent classes ex. this.$root.$on('related-data-added',this.addRelatedData);**/

    editRelatedData(object) {
      console.log(object)
      if (this.isEmptyObject(object.new)) return;
      let formData = new FormData();

      //CHECK REQUIRED FIELDS !!!
      let type = this.activeTab;
      if (this.checkRequiredFields(type, object.new)) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }

      let editableObject = this.removeUnnecessaryFields(object.new, this.relatedData.copyFields[type]);
      formData.append('data', this.formatRelatedData(editableObject));
      this.loadRelatedData(type).then(response => {
        // this allows to set edit mode for multiple row
        this.$set(object, 'editMode', false)
        // it is required to edit only one record
        this.editMode = false;
      });
      this.saveData(type, formData, 'change/' + type + '/' + object.id).then(isSuccessfullySaved => {
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

    addRelatedData(type, isTab = false) {
      if (this.isEmptyObject(this.relatedData.insert[this.activeTab])) return;
      let formData = new FormData();
      if (type === undefined) type = this.activeTab;

      // TypeError on TAB modal emit (because it gets triggered multiple times (shouldn't use root emitting and stuff, better use vuex for theese kinds of events))
      if (this.checkRequiredFields(type, this.relatedData.insert[type])) {
        toastError({text: this.$t('messages.checkForm')});
        return
      }

      formData.append('data', this.formatRelatedData(this.relatedData.insert[type]));
      this.saveData(type, formData, 'add/' + type + '/').then(isSuccessfullySaved => {
        // RELOAD RELATED DATA IN CURRENT TAB
        this.loadRelatedData(type);
        // CLEAR PREVIOUS INSERT DATA
        this.relatedData.insert[this.activeTab] = {};
      });
    },


    // ?
    loadRelatedData() {
    },
    fillRelatedDataAutocompleteFields() {
    },
    editRow(entity) {
      if (this.editMode === true) return;
      // console.log("EDIT RECORD" + JSON.stringify(entity));
      this.$set(entity, 'new', this.fillRelatedDataAutocompleteFields(cloneDeep(entity)));
      this.$set(entity, 'editMode', !entity.editMode)
      this.editMode = true;
    },
    allowRemove(entity) {
      this.$set(entity, 'allowRemove', true)
    },
    removeRow(entity) {
      console.log("DELETE RECORD" + JSON.stringify(entity))
    },

    changeOrdering(entity) {
      this.$set(this.relatedData.orderBy, entity.tab, entity.orderBy)
    },

    /** RELATED DATA ENDS**/

    /** SHOW NEXT OR PREVIOUS RECORD STARTS**/
    findCurrentRecord(list, id) {
      return findIndex(list, function (item) {
        return item.id === id
      })
    },
    getListRecords(object) {
      const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');

      this.listSearch(searchHistory).then(results => {
        if (results.length === 0) {
          this.$root.$emit('disable-previous', true);
          this.$root.$emit('disable-next', true);
          return
        }

        let currentRecordId = this.findCurrentRecord(cloneDeep(results), this[object].id)

        if (currentRecordId === -1) {
          if (this[object].id === 1) {
            this.nextRecord = this[object].id + 1;
            this.$root.$emit('disable-previous', true);
            this.$root.$emit('disable-next', false);
          } else {
            this.previousRecord = this[object].id - 1;
            this.nextRecord = this[object].id + 1;
            this.$root.$emit('disable-previous', false);
            this.$root.$emit('disable-next', false);
          }
          return
        }

        if (currentRecordId === 0) {
          this.$root.$emit('disable-previous', true)
        } else {
          this.previousRecord = results[currentRecordId - 1].id;
          this.$root.$emit('disable-previous', false)
        }
        if (currentRecordId === results.length - 1) {
          this.$root.$emit('disable-next', true)
        } else {
          this.nextRecord = results[currentRecordId + 1].id;
          this.$root.$emit('disable-next', false)
        }

      })
    },

    listSearch(searchParams) {
      this.sendingData = true;
      return new Promise((resolve) => {
        this.fetchList(searchParams).then(response => {
          if (response.status === 200) {
            if (response.body.count === 0) resolve([]);
            if (response.body.count > 0) resolve(response.body.results)
          }
          this.sendingData = false
        }, errResponse => {
          this.sendingData = false
        })
      });
    },

    hoverSaveOrCancelButtonClicked(choice, object, isRelationSavedSeparately = false) {
      if (this.isDefinedAndNotNull(this.activeObject)) object = this.activeObject

      if (choice === "SAVE") this.add(true, object, isRelationSavedSeparately)

      if (choice === "FINISH") {
        this[object].date_end = new Date()

        this.add(false, object, isRelationSavedSeparately);
      }

      if (choice === "SAVE_AND_LEAVE") {
        this.add(false, object, isRelationSavedSeparately);
      }

      if (choice === "CLEAR") {
        this[object] = {}
        toastInfo({text: this.$t('messages.fieldsCleared')})
      }
      if (choice === "CANCEL") this.$router.push({path: '/' + object})

      if (choice === "PREVIOUS") this.$router.push({path: '/' + object + '/' + this.previousRecord});
      if (choice === "NEXT") this.$router.push({path: '/' + object + '/' + this.nextRecord});
    },

    /** SHOW NEXT OR PREVIOUS RECORD ENDS**/

    composeFileUrl(file, size = 'small') {
      if (size === 'small' || size === 'medium' || size === 'large') {
        return this.fileUrl + '/' + size + '/' + file.substring(0, 2) + '/' + file.substring(2, 4) + '/' + file
      } else {
        return this.fileUrl + '/' + file.substring(0, 2) + '/' + file.substring(2, 4) + '/' + file
      }
    },

    calculateNextName(previousName) {
      if (!this.isDefinedAndNotNull(previousName)) return
      let tokenize = previousName.split(/[^0-9]/g);
      let lastToken = tokenize[tokenize.length - 1]
      //last token is number
      return isNaN(parseInt(lastToken)) ? previousName + ' 1' : previousName.substring(0, (previousName.length - lastToken.length)) + (parseInt(lastToken) + 1)
    },

    getActiveProject() {
      let activeProject = this.$localStorage.get('activeProject', 'fallbackValue');
      if (this.isDefinedAndNotEmpty(activeProject) && activeProject !== 'fallbackValue') return activeProject[0];
      return null
    },

    parseDate(date) {
      if (date) {
        return moment(String(date)).format('DD-MM-YYYY HH:mm')
      }
    },

    toastResponseMessages(response) {
      if (typeof response.body.message !== 'undefined') {
        toastSuccess({text: response.body.message});
      }
      if (typeof response.body.error !== 'undefined') {
        toastError({text: response.body.error});
      }
    }
  },

  watch: {
    'relatedData.page': {
      handler: function () {
        this.setActiveTab(this.activeTab)
      },
      deep: true
    },
    'showCollapseMap'(newval) {
      this.$localStorage.set('mapComponent', newval)
    },
    'attachmentLinkSaved': {
      handler: function (newval) {
        if (newval === 0) {
          this.$root.$emit('attachment-loading-status', true)
          this.loadRelatedData('attachment_link');
          this.attachmentLinkSaved = -1
        }

      },
      deep: true
    }
  }
};

export default formManipulation
