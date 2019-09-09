import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
import VueMultiselect from 'vue-multiselect';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// Todo: Remove FontAwesomeIcon imports!!!

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
import moment from 'moment'
import {toastInfo, toastSuccess, toastError} from "../assets/js/iziToast/iziToast";
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
    }
  },
  components: {
    BFormInput,
    VueMultiselect,
    FontAwesomeIcon
  },
  mounted() {
    // Root event for confirmation modal which is emitted when user tries to leave the TAB without saving.
    // commented on 04.09.2019
    // this.$root.$on('user-choice', this.handleUserChoice);
    // this.$root.$on('sidebar-user-choice', this.handleSidebarUserChoice);

    this.$parent.$on('button-clicked', this.bottomOptionClicked);

  },
  beforeMount() {
    //localstorage settings
    let showCollapseMap = this.$localStorage.get('mapComponent', 'fallbackValue')
    if (typeof showCollapseMap === 'undefined' || showCollapseMap === 'fallbackValue') return
    this.showCollapseMap = showCollapseMap
  },
  beforeDestroy() {
    this.$parent.$off('button-clicked', this.bottomOptionClicked);
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    /**
     * Checks if variable is not empty and returns corresponding boolean.
     *
     * @param {*} value - This value will be checked
     * @returns {boolean} false:
     *                      undefined, null, "", [], {};
     *                    true:
     *                      true, false, 1, 0, -1, "foo", [1, 2, 3], { foo: 1 }
     */
    isNotEmpty(value) {
      return !(
        // null or undefined
        (value == null) ||

        // has length and it's zero
        (value.hasOwnProperty('length') && value.length === 0) ||

        //  is an Object and has no keys
        (value.constructor === Object && Object.keys(value).length === 0)
      )
    },

    /**
     * Returns date in string format
     * onlyDate = true --> API has DateField type in Models
     * onlyDate = false --> API has DateTimeField type in Models
     *
     * @param {object} date - Date object
     * @param {boolean} [onlyDate=true] - If set to true then returns only date part of datetime.
     * @returns {string} Date which can be only date part or full datetime
     */
    formatDateForUpload(date, onlyDate = true) {
      date = new Date(date);
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);

      if (onlyDate) return typeof date === 'string' ? date.split('T')[0] : localISOTime.split('T')[0];
      return localISOTime
    },

    /**
     * Cancels request which was just made, for example user tries uploading a large file
     * but decides to cancel it then this method gets called.
     */
    cancelRequest() {
      this.previousRequest.abort()
    },

    /**
     * Handles request's response by returning results list or empty list.
     *
     * @param {object} response - This comes straight from API and is handled here.
     * @returns {array} Results from API.
     */
    handleResponse(response) {
      if (response.status === 200) {
        return (response.body.count > 0) ? response.body.results : []
      }
    },

    /**
     * Checks if required fields are okay to upload (not undefined, null etc.).
     * Optional parameters example can be seen while adding attachment.
     *
     * @param {string} object - Current object which fields are validated e.g., 'doi', 'reference'.
     * @param {string} child - Used for validating if requiredFields is an object like in attachments.
     * @returns {boolean} True if required fields are OK and false if they are not.
     */
    validate(object, child) {
      let isValid = true;
      let isValidOptional = false;

      let fields = this.requiredFields;
      let optionalFields = this.optionalFields;

      // Exceptions
      if (object === 'imageset') isValid &= !this.imagesetNumberExists;
      if (object === 'attachment') child = this.$route.meta.child;

      if (child) {
        fields = fields[child];
        optionalFields = fields[child];
      }

      if (this.isNotEmpty(fields)) fields.forEach(el => isValid &= this.isNotEmpty(this[object][el]));

      if (this.isNotEmpty(optionalFields)) optionalFields.forEach(el => isValidOptional |= this.isNotEmpty(this[object][el]));
      else isValidOptional = true;

      return isValid && isValidOptional
    },

    add(addAnother, object, returnPromise = false) {
      return new Promise(resolve => {
        if (this.validate(object) && !this.sendingData) {

          let url = this[object].id === undefined ? 'add/' + object + '/' : 'change/' + object + '/' + this[object].id;

          let editableObject = cloneDeep(this[object]);
          if (this[object].id !== undefined) {
            delete this[object]['id']
          }

          const dataToUpload = this.formatDataForUpload(this[object]);
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
          related_data: {[attach_link]: [{id: this[relatedObject].id}]}
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

    getDoiUrl(doi) {
      return `https://doi.org/${doi}`
    },

    /**
     * Removes unnecessary fields from object.
     *
     * @param object - data object from api, for example doi, specimen etc.
     * @param copyFields - Array of fields which will be sent to API using add or change request.
     * @returns object, which has unnecessary fields removed.
     */
    removeUnnecessaryFields(object, copyFields) {
      //copy only certain fields
      Object.entries(object).forEach(entry => {
        if (copyFields.indexOf(entry[0]) < 0) {
          delete object[entry[0]]
        }
      });
      return object;
    },

    // Todo: Update TAB code
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
      if (isWarning && this.isNotEmpty(this.relatedData.insert[this.activeTab])) {
        this.$bvModal.show('confirm-tab-close')
      } else {
        // CLEAR PREVIOUS TAB DATA BECAUSE IT SHOULD BE SAVED
        this.relatedData.insert[this.activeTab] = {};
        // this.activeTab = type;
        this.$emit('tab-changed', type);
        this.loadRelatedData(type);
      }
    },


    /**************************
     *** RELATED DATA START ***
     **************************/

    /**
     * Adds related data. Changing related data in edit view will send an add request to API.
     * In add view and for DOI, data will be sent in related_data field.
     *
     * @param {string} tab - Current active tab which is being changed.
     */
    addRelatedData(tab) {
      if (!this.isNotEmpty(tab)) tab = this.activeTab;

      if (this.isNotEmpty(this.relatedData.insert[tab])) {

        if (this.$route.meta.isEdit) {
          let formData = new FormData();

          // Todo: CheckRequiredFields is not used anywhere, should change it to validate() and use requiredFields field in component data object.
          if (this.checkRequiredFields(tab, this.relatedData.insert[tab])) {
            toastError({text: this.$t('messages.checkForm')});
            return;
          }

          formData.append('data', this.formatRelatedData(this.relatedData.insert[tab]));
          this.saveData(tab, formData, 'add/' + tab + '/').then(isSuccessfullySaved => {
            console.log(isSuccessfullySaved)
            this.loadRelatedData(tab);
            this.$set(this.relatedData, 'insert', this.setDefaultInsertRelatedData());
          });


        } else {
          this.removeUnnecessaryFields(this.relatedData.insert[tab], this.relatedData.copyFields[tab]);
          this.relatedData[tab].push(this.unformatRelatedDataAutocompleteFields(this.relatedData.insert[tab]));
          this.$set(this.relatedData, 'insert', this.setDefaultInsertRelatedData());
        }

      } else {
        toastError({text: this.$t('messages.checkForm')});
      }
    },

    /**
     * Setting all insert values to default. Can implement so it would only set activeTab's insert
     * data to default, but this is can be done in the future if really needed.
     */
    setDefault() {
      this.$set(this.relatedData, 'insert', this.setDefaultInsertRelatedData());
    },

    /**
     * Main function is to edit related data. Firstly if allowRemove is enabled it disables it.
     * Secondly on click it enables editMode where user can edit data.
     * After data is changed user can click the button to send new data to API. API request is only done for edit views,
     * for add views data is always sent in related_data field.
     *
     * @param {object} entity - item from related data array.
     * @param {int} index -  item's index in array which is used to replace it with new one.
     */
    editRow(entity, index) {
      if (entity.allowRemove) {
        this.$set(entity, 'allowRemove', false);
      } else if (!entity.editMode) {
        this.$set(entity, 'editMode', true);
        this.$set(entity, 'new', this.fillRelatedDataAutocompleteFields(cloneDeep(entity)));
      } else {
        if (this.$route.meta.isEdit) {
          if (this.isNotEmpty(entity.new)) {
            let formData = new FormData();
            if (this.checkRequiredFields(this.activeTab, entity.new)) {
              toastError({text: this.$t('messages.checkForm')});
              return;
            }

            let editableObject = this.removeUnnecessaryFields(entity.new, this.relatedData.copyFields[this.activeTab]);
            formData.append('data', this.formatRelatedData(editableObject));

            // Todo: Check saveData method and maybe refactor
            this.saveData(this.activeTab, formData, 'change/' + this.activeTab + '/' + entity.id).then(isSuccessfullySaved => {
              console.log(isSuccessfullySaved)
              //  UPDATE ROW DATA
              this.$set(this.relatedData[this.activeTab], index, this.unformatRelatedDataAutocompleteFields(entity.new, entity.id));
              this.$set(entity, 'editMode', false);
              this.$set(entity, 'new', {});
            });

          }
        } else {
          if (this.isNotEmpty(entity.new)) {
            if (this.checkRequiredFields(this.activeTab, entity.new)) {
              toastError({text: this.$t('messages.checkForm')});
              return;
            }

            this.removeUnnecessaryFields(entity.new, this.relatedData.copyFields[this.activeTab]);
            this.$set(this.relatedData[this.activeTab], index, this.unformatRelatedDataAutocompleteFields(entity.new, entity.id))
            this.$set(entity, 'editMode', false);
            this.$set(entity, 'new', {});
          }
        }
      }
    },

    /**
     * Main function is to remove item from related data.
     * First of all if editMode is activated then it disables it.
     * Secondly if user presses delete button then allowRemove parameter is activated
     * and user can see which row can be deleted, this is because of accidental misclicks.
     * Lastly if isEdit then related data should be sent via API with DELETE request.
     * Add view must always send data via related_data field, because main object doesn't exist in database yet.
     *
     * @param {object} entity - item from related data array.
     * @param {int} index -  item's index in array which is used to remove it from array.
     */
    removeRow(entity, index) {
      if (entity.editMode) {
        this.$set(entity, 'editMode', false);
      } else if (!entity.allowRemove) {
        this.$set(entity, 'allowRemove', true);
      } else {
        if (this.$route.meta.isEdit) {
          // Todo: Else send remove request to api
          console.log('DELETE: ' + JSON.stringify(entity))
        } else {
          this.relatedData[this.activeTab].splice(index, 1);
          if (this.$route.meta.isEdit) toastSuccess({text: `Removed record with an ID: <b>${entity.id}</b> from <b>${this.activeTab}</b>`});
          else toastSuccess({text: `Removed record from <b>${this.activeTab}</b>`});
        }
      }
    },

    /**
     * Changes ordering.
     *
     * @param {object} entity - Contains active tab name and new orderBy field.
     */
    changeOrdering(entity) {
      if (this.$route.meta.isEdit) this.$set(this.relatedData.searchParameters[entity.tab], 'order_by', entity.orderBy);
    },

    /**************************
     ***  RELATED DATA END  ***
     **************************/



    /**
     * Handles user's bottom options button click by calling add method, route leave or resetting object.
     *
     * @param {string} choice - User's choice in String format e.g., 'SAVE', 'CLEAR', etc.
     * @param {string} object - Current object which user tries to edit or sth. ('specimen', 'doi', etc.)
     *
     * @example bottomOptionClicked('SAVE', 'doi')
     */
    bottomOptionClicked(choice, object) {
      if (choice === "SAVE") this.add(true, object);

      if (choice === "FINISH") {
        this[object].date_end = new Date();
        this.add(false, object);
      }

      if (choice === "SAVE_AND_LEAVE") {
        this.add(false, object);
      }

      if (choice === "CLEAR") {
        this[object] = {};
        if (this.isNotEmpty(this.relatedTabs)) {
          this.relatedTabs.forEach(tab => {
            if (this.isNotEmpty(this.relatedData[tab.name])) this.relatedData[tab.name] = {}
          });
        }
        toastInfo({text: this.$t('messages.fieldsCleared')})
      }

      if (choice === "CANCEL") this.$router.push({path: '/' + object})
    },

    /**
     * Returns file's url.
     *
     * @param filename - String value of file's name
     * @param size - can be small, medium, large or original.
     * @returns {string} - file's url
     */
    composeFileUrl(filename, size = 'small') {
      if (size === 'small' || size === 'medium' || size === 'large') {
        return this.fileUrl + '/' + size + '/' + filename.substring(0, 2) + '/' + filename.substring(2, 4) + '/' + filename
      } else {
        return this.fileUrl + '/' + filename.substring(0, 2) + '/' + filename.substring(2, 4) + '/' + filename
      }
    },

    /**
     * Calculates next name, for example 'Test site 1' --> 'Test site 2'
     *
     * @param {string} previousName - It will be used to calculate next name.
     * @returns {string} - next name
     */
    calculateNextName(previousName) {
      if (!this.isNotEmpty(previousName)) return
      let tokenize = previousName.split(/[^0-9]/g);
      let lastToken = tokenize[tokenize.length - 1]
      //last token is number
      return isNaN(parseInt(lastToken)) ? previousName + ' 1' : previousName.substring(0, (previousName.length - lastToken.length)) + (parseInt(lastToken) + 1)
    },

    getActiveProject() {
      let activeProject = this.$localStorage.get('activeProject', 'fallbackValue');
      if (this.isNotEmpty(activeProject) && activeProject !== 'fallbackValue') return activeProject[0];
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
