import VueMultiselect from "vue-multiselect";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import {
  toastInfo,
  toastSuccess,
  toastError
} from "../assets/js/iziToast/iziToast";
import { mapState } from "vuex";

const formManipulation = {
  data() {
    return {
      fileUrl: "https://files.geocollections.info",
      apiUrl: "https://rwapi.geocollections.info/",
      loadingPercent: 0,
      previousRequest: null,
      sendingData: false,
      editMode: false,
      showCollapseMap: null,
      isFileAddedAsObject: null
    };
  },
  components: {
    VueMultiselect
  },
  mounted() {
    // Root event for confirmation modal which is emitted when user tries to leave the TAB without saving.
    // commented on 04.09.2019
    // this.$root.$on('user-choice', this.handleUserChoice);
    // this.$root.$on('sidebar-user-choice', this.handleSidebarUserChoice);

    this.$parent.$on("button-clicked", this.bottomOptionClicked);
  },
  beforeMount() {
    //localstorage settings
    let showCollapseMap = this.$localStorage.get(
      "mapComponent",
      "fallbackValue"
    );
    if (this.isNotEmpty(showCollapseMap) && showCollapseMap !== "fallbackValue")
      this.$set(this.$data, "showCollapseMap", showCollapseMap);
  },
  beforeDestroy() {
    this.$parent.$off("button-clicked", this.bottomOptionClicked);
  },
  computed: {
    ...mapState(["currentUser"])
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
        (
          value == null ||
          // has length and it's zero
          value.length === 0 ||
          //  is an Object and has no keys
          (value.constructor === Object && Object.keys(value).length === 0)
        )
      );
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
      let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime =
        new Date(date - tzoffset).toISOString().split(".")[0] + "Z"; // Without fractions
      // let localISOTime = (new Date(date - tzoffset)).toISOString();

      if (onlyDate)
        return typeof date === "string"
          ? date.split("T")[0]
          : localISOTime.split("T")[0];
      return localISOTime;
    },

    /**
     * Cancels request which was just made, for example user tries uploading a large file
     * but decides to cancel it then this method gets called.
     */
    cancelRequest() {
      this.previousRequest.abort();
    },

    /**
     * Handles request's response by returning results list or empty list.
     *
     * @param {object} response - This comes straight from API and is handled here.
     * @returns {array} Results from API.
     */
    handleResponse(response) {
      if (response.status === 200) {
        return response.body.count > 0 ? response.body.results : [];
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
    validate(object, child = null) {
      // Made for debugging
      // return true
      // REMOVE!!!!!!!!!!

      let isValid = true;
      let isValidOptional = false;

      let fields = this.requiredFields;
      let optionalFields = this.optionalFields;

      // Exceptions
      if (object === "imageset") isValid &= !this.imagesetNumberExists;
      if (object === "attachment") {
        if (!this.isNotEmpty(child)) {
          if (this.$route.meta.child) child = this.$route.meta.child;
          else if (this.isNotEmpty(this[object].specimen_image_attachment)) {
            let typeNumber = this[object].specimen_image_attachment;
            if (typeNumber === 1) child = "specimen_image";
            else if (typeNumber === 2) child = "photo_archive";
            else if (typeNumber === 3) child = "other_file";
            else if (typeNumber === 4) child = "digitised_reference";
            else return false; // This shouldn't run
          } else return false; // This shouldn't run
        }

        if (!this.isNotEmpty(this.files) && !this.$route.meta.isEdit)
          return false;
      }

      if (child) {
        fields = fields[child];
        optionalFields = optionalFields[child];
      }

      if (this.isNotEmpty(fields))
        fields.forEach(el => (isValid &= this.isNotEmpty(this[object][el])));

      if (this.isNotEmpty(optionalFields))
        optionalFields.forEach(
          el => (isValidOptional |= this.isNotEmpty(this[object][el]))
        );
      else isValidOptional = true;

      return !!(isValid && isValidOptional);
    },

    /**
     *
     * @param {string} object - Current object which is being checked e.g., 'attachemnt', 'reference'.
     * @returns {boolean} 'true' if is_locked field is true and 'false' if it is false.
     */
    isObjectLocked(object) {
      if (this.$route.meta.isEdit && object === "attachment") {
        return !!this.isAttachmentLocked;
      } else return false;
    },

    add(addAnother, object, returnPromise = false, saveAsNew = false, saveAsDifferentObject) {
      return new Promise(resolve => {
        if (
          this.validate(object) &&
          !this.sendingData &&
          !this.isObjectLocked(object)
        ) {
          let objectToUpload = cloneDeep(this[object]);

          if (saveAsNew) delete objectToUpload.id;

          if (saveAsDifferentObject) {
            delete objectToUpload.id;
            object = saveAsDifferentObject;
            this.updateNewObjectsFields(objectToUpload, saveAsDifferentObject);
          }

          let url = objectToUpload.id
            ? `change/${object}/${objectToUpload.id}`
            : `add/${object}/`;
          if (objectToUpload.id) delete objectToUpload.id;

          const dataToUpload = this.formatDataForUpload(objectToUpload);
          let formData = new FormData();
          formData.append("data", dataToUpload);

          if (object === "attachment" && this.files && this.files.length > 0) {
            for (let file in this.files) {
              if (file === "10" && this.files.length >= 10) break;
              else formData.append("file" + file, this.files[file]);
            }
          }

          this.saveData(object, formData, url).then(
            savedObjectId => {
              console.log(savedObjectId);
              console.log("^^^^^^ Saved object ID ^^^^^^ ");

              if (saveAsNew) {
                if (this.isNotEmpty(savedObjectId)) {
                  this.$router.push({
                    path: "/" + object + "/" + savedObjectId
                  });
                }
              } else {
                if (this.$route.meta.isEdit && !saveAsDifferentObject)
                  this.$emit("data-loaded", this[object]);

                if (!returnPromise) {
                  if (addAnother) {
                    // Save
                    if (
                      this.isNotEmpty(savedObjectId) &&
                      !this.$route.meta.isEdit
                    ) {
                      // savedObjectId exists and is add view
                      if (object === "imageset") {
                        this.$router.push({
                          name: "photo_archive add",
                          params: {
                            imageset: {
                              id: savedObjectId,
                              imageset_number: this[object].imageset_number
                            }
                          }
                        });
                      } else if (object === "journal") {
                        this.$router.push({
                          name: "reference add",
                          params: {
                            journal: {
                              id: savedObjectId,
                              journal_name: this[object].journal_name
                            }
                          }
                        });
                      } else
                        this.$router.push({
                          path: "/" + object + "/" + savedObjectId
                        });
                    }
                  } else {
                    // Save and leave
                    if (this.isNotEmpty(savedObjectId))
                      this.$router.push({ path: "/" + object });
                  }
                } else resolve(savedObjectId);
              }
            },
            () => resolve(false)
          );
        } else if (this.sendingData) {
          // This runs only if user deletes html elements and tries to press 'add' button again
          toastError({ text: this.$t("messages.easterEggError") });
          resolve(false);
        } else {
          if (object === "attachment" && this.isAttachmentLocked)
            toastError({ text: this.$t("messages.lockedForm") });
          else toastError({ text: this.$t("messages.checkForm") });
          resolve(false);
        }
      });
    },

    saveData(object, formData, url) {
      return new Promise(resolve => {
        this.request(object, formData, url, resolve);
      });
    },

    request(object, formData, url, resolve) {
      this.sendingData = true;
      this.loadingPercent = 0;

      this.$http
        .post(this.apiUrl + url, formData, {
          before(request) {
            this.previousRequest = request;
          },
          progress: e => {
            if (e.lengthComputable)
              this.loadingPercent = Math.round((e.loaded / e.total) * 100);
          }
        })
        .then(
          response => {
            this.sendingData = false;
            if (response.status === 200) {
              if (response.body) {
                if (this.$i18n.locale === "ee") {
                  if (response.body.message_et)
                    toastSuccess({ text: response.body.message_et });
                  else if (response.body.message)
                    toastSuccess({ text: response.body.message });
                  else if (response.body.error_et)
                    toastError({ text: response.body.error_et });
                  else if (response.body.error)
                    toastError({ text: response.body.error });
                } else {
                  if (response.body.message)
                    toastSuccess({ text: response.body.message });
                  else if (response.body.error)
                    toastError({ text: response.body.error });
                }

                if (object === "attachment" && response.body.attachments_ids) {
                  if (response.body.attachments_ids.length > 1)
                    resolve(response.body.attachments_ids);
                  resolve(response.body.attachments_ids[0]);
                } else if (response.body.id) resolve(response.body.id);
                else resolve(undefined);
              } else resolve(undefined);
            } else resolve(undefined);
          },
          errResponse => {
            this.sendingData = false;
            console.log("ERROR: " + JSON.stringify(errResponse));
            toastError({ text: this.$t("messages.uploadError") });
            resolve(undefined);
          }
        );
    },

    addFileAsObject(files, relatedObject) {
      let formData = new FormData();

      files.forEach((file, index) => {
        formData.append(
          "data",
          JSON.stringify({
            description: file.type.includes("pdf")
              ? null
              : file.type +
                " for " +
                relatedObject +
                ": " +
                this[relatedObject].id,
            author: file.type.includes("pdf") ? null : this.currentUser.id,
            date_created: file.type.includes("pdf")
              ? null
              : this.formatDateForUpload(new Date()),
            is_private: !this[relatedObject].is_oa,
            specimen_image_attachment: relatedObject === "reference" ? 4 : 3,
            [relatedObject]: this[relatedObject].id
          })
        );

        formData.append("file" + [index], file);
      });

      try {
        this.saveData("attachment", formData, "add/attachment/").then(
          savedObjectId => {
            if (this.isNotEmpty(savedObjectId))
              this.isFileAddedAsObject = savedObjectId;
          }
        );
      } catch (e) {
        console.log("Attachment cannot be added");
        console.log(e);
      }
    },

    addFileAsRelatedDataNew(files, relatedObject) {
      let attach_link = "attach_link__" + relatedObject;

      let formData = new FormData();
      files.forEach((file, index) => {
        formData.append(
          "data",
          JSON.stringify({
            description:
              file.type +
              " for " +
              relatedObject +
              ": " +
              this[relatedObject].id,
            description_en:
              file.type +
              " for " +
              relatedObject +
              ": " +
              this[relatedObject].id,
            author: this.currentUser.id,
            date_created: this.formatDateForUpload(new Date()),
            is_private: true,
            related_data: { [attach_link]: [{ id: this[relatedObject].id }] }
          })
        );

        formData.append("file" + [index], file);
      });

      try {
        this.saveData("attachment", formData, "add/attachment/").then(
          savedObjectId => {
            console.log(savedObjectId);
          }
        );
      } catch (e) {
        console.log("Attachment cannot be added");
        console.log(e);
      }
    },

    updateNewObjectsFields(currentData, object) {
      if (object === "locality") {
        let locality = cloneDeep(currentData);
        delete currentData.date_end;
        delete currentData.date_start;
        delete currentData.related_data;
        delete currentData.elevation_accuracy;
        delete currentData.location_accuracy;
        delete currentData.name;
        delete currentData.name_en;
        delete currentData.project;
        currentData.locality.id = locality.name;
      }
    },

    addFileAsRelatedData(data, object) {
      let formData = new FormData();
      data.forEach((file, index) => {
        formData.append(
          "data",
          JSON.stringify({
            description: file.type + " for " + object + ": " + this[object].id,
            author: this.currentUser.id,
            date_created: this.formatDateForUpload(new Date()),
            is_private: true
          })
        );

        formData.append("file" + [index], file);
      });

      try {
        this.saveData("attachment", formData, "add/attachment/").then(
          savedObjectId => {
            console.log(savedObjectId);
            if (savedObjectId === undefined || savedObjectId === false) return;
            let vm = this;
            this.attachmentLinkSaved =
              savedObjectId.length > 0 ? savedObjectId.length : 1;

            function createRelation(vm, object, file) {
              vm.addRelationBetweenAnyObjectAndAttachment(
                file,
                "attachment_link",
                {
                  object: object,
                  id: vm[object].id
                }
              ).then(() => {
                vm.attachmentLinkSaved -= 1;
              });
            }

            if (this.attachmentLinkSaved === 1)
              createRelation(vm, object, savedObjectId);
            else {
              savedObjectId.forEach(file => {
                createRelation(vm, object, file);
              });
            }
          }
        );
      } catch (e) {
        console.log("Attachment cannot not be added");
        console.log(e);
      }
    },

    addRelationBetweenAnyObjectAndAttachment(
      attachmentId,
      object,
      createRelationWith = null
    ) {
      let formData = new FormData();
      let uploadableObject = {
        attachment: attachmentId
      };
      if (createRelationWith !== null) {
        uploadableObject[createRelationWith.object] = createRelationWith.id;
      } else
        uploadableObject[
          this.$store.state["createRelationWith"].object
        ] = this.$store.state["createRelationWith"].data.id;

      const dataToUpload = JSON.stringify(uploadableObject);
      formData.append("data", dataToUpload);

      let url = "add/" + object + "/";
      return new Promise(resolve => {
        this.saveData(object, formData, url).then(() => {
          console.log(
            "Relation created with locality id: " +
              this.$store.state["createRelationWith"].id
          );
          resolve(true);
        });
      });
    },

    reset(object, isEdit) {
      console.log("reset");
      if (
        typeof this.createRelationWith !== "undefined" &&
        this.createRelationWith.object !== null
      )
        window.close();
      else if (isEdit) this.$router.push({ path: "/" + object });
      else {
        this[object] = {};
        toastInfo({ text: this.$t("messages.fieldsCleared") });
      }
      // isEdit ? this.$router.push({ path: '/' + object }) : this[object] = {};
    },

    leaveFromEditView(object) {
      console.log(this.createRelationWith);
      if (this.createRelationWith.object !== null) {
        window.close();
      }
      this.$router.push({ path: "/" + object });
    },

    windowOpenNewTab(name, path, query = {}, meta) {
      let routeData = this.$router.resolve({
        path: path,
        query: query,
        meta: meta
      });
      window.open(routeData.href, "_blank");
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
      window.open(
        "https://geocollections.info/" + params.object + "/" + params.id,
        "",
        "width=" + width + ",height=750"
      );
    },

    openUrlInNewWindow(params) {
      if (typeof params.width === "undefined") {
        params.width = 800;
      }
      if (typeof params.height === "undefined") {
        params.height = 750;
      }
      window.open(
        params.url,
        "",
        "width=" + params.width + ",height=" + params.height
      );
    },

    openDOI(params) {
      window.open("https://doi.org/" + params.doi, "", "width=1000,height=900");
    },

    openPdf(params) {
      window.open(
        "https://files.geocollections.info/" +
          params.pdf.substring(0, 2) +
          "/" +
          params.pdf.substring(2, 4) +
          "/" +
          params.pdf,
        "",
        "width=1000,height=900"
      );
    },

    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
    },

    getSarvDoiUrl(doiIdentifier) {
      if (doiIdentifier)
        return "https://doi.geocollections.info/" + doiIdentifier;
    },

    getFossilsUrl(id) {
      return `https://fossiilid.info/${id}`;
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
          delete object[entry[0]];
        }
      });
      return object;
    },

    // Todo: Update TAB code
    // handleUserChoice(choice) {
    //   this.$bvModal.hide('confirm-tab-close')
    //
    //   if (choice === 'LEAVE') {
    //     this.setActiveTab(this.nextTab, false)
    //   } else if (choice === 'SAVE') {
    //     this.addRelatedData(this.activeTab, true);
    //     this.setActiveTab(this.nextTab, false);
    //   }
    // },
    //
    // setActiveTab(type, isWarning = true) {
    //   // If user clicks on currently active tab then do nothing
    //   if (this.activeTab === type) return
    //
    //   this.nextTab = type;
    //   if (isWarning && this.isNotEmpty(this.relatedData.insert[this.activeTab])) {
    //     this.$bvModal.show('confirm-tab-close')
    //   } else {
    //     // CLEAR PREVIOUS TAB DATA BECAUSE IT SHOULD BE SAVED
    //     this.relatedData.insert[this.activeTab] = {};
    //     // this.activeTab = type;
    //     this.$emit('tab-changed', type);
    //     this.loadRelatedData(type);
    //   }
    // },

    /**************************
     *** RELATED DATA START ***
     **************************/

    /**
     * Adds related data. Changing related data in edit view will send an add request to API.
     * In add view and for DOI, data will be sent in related_data field.
     *
     * @param {string} tab - Current active tab which is being changed.
     * @param {boolean} checkForDuplicates - if true then we need to check that user won't enter duplicates
     */
    addRelatedData(tab, checkForDuplicates = false) {
      if (!this.isNotEmpty(tab)) tab = this.activeTab;

      if (this.isNotEmpty(this.relatedData.insert[tab])) {
        if (!this.recordAlreadyExists(tab, checkForDuplicates)) {
          if (this.$route.meta.isEdit) {
            let formData = new FormData();

            if (
              this.$route.meta.object === "doi" &&
              this.checkRequiredFields(tab, this.relatedData.insert[tab])
            ) {
              toastError({ text: this.$t("messages.checkForm") });
              return;
            }

            // Special use case for taxon
            let url = "/add/" + tab + "/";
            if (tab === "taxon_subclass") url = "/add/taxon/";

            formData.append(
              "data",
              this.formatRelatedData(this.relatedData.insert[tab])
            );
            this.saveData(tab, formData, url).then(isSuccessfullySaved => {
              console.log(isSuccessfullySaved);
              this.loadRelatedData(tab);
              this.$set(
                this.relatedData,
                "insert",
                this.setDefaultInsertRelatedData()
              );
            });
          } else {
            if (
              this.$route.meta.object === "doi" &&
              this.checkRequiredFields(tab, this.relatedData.insert[tab])
            ) {
              toastError({ text: this.$t("messages.checkForm") });
              return;
            }
            this.removeUnnecessaryFields(
              this.relatedData.insert[tab],
              this.relatedData.copyFields[tab]
            );
            this.relatedData[tab].push(
              this.unformatRelatedDataAutocompleteFields(
                this.relatedData.insert[tab]
              )
            );
            this.$set(
              this.relatedData,
              "insert",
              this.setDefaultInsertRelatedData()
            );
          }
        } else toastError({ text: this.$t("messages.checkFormDuplicate") });
      } else {
        toastError({ text: this.$t("messages.checkFormEmpty") });
      }
    },

    /**
     * Setting all insert values to default. Can implement so it would only set activeTab's insert
     * data to default, but this is can be done in the future if really needed.
     */
    setDefault() {
      this.$set(this.relatedData, "insert", this.setDefaultInsertRelatedData());
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
        this.$set(entity, "allowRemove", false);
      } else if (!entity.editMode) {
        this.$set(entity, "editMode", true);
        this.$set(
          entity,
          "new",
          this.fillRelatedDataAutocompleteFields(cloneDeep(entity))
        );
      } else {
        if (this.$route.meta.isEdit) {
          if (this.isNotEmpty(entity.new)) {
            let formData = new FormData();
            if (
              this.$route.meta.object === "doi" &&
              this.checkRequiredFields(this.activeTab, entity.new)
            ) {
              toastError({ text: this.$t("messages.checkForm") });
              return;
            }

            let editableObject = this.removeUnnecessaryFields(
              entity.new,
              this.relatedData.copyFields[this.activeTab]
            );
            formData.append("data", this.formatRelatedData(editableObject));

            let tab = this.activeTab;
            // Special use case for taxon
            if (this.activeTab === "taxon_subclass") tab = "taxon";

            this.saveData(
              this.activeTab,
              formData,
              "change/" + tab + "/" + entity.id
            ).then(isSuccessfullySaved => {
              console.log(isSuccessfullySaved);
              //  UPDATE ROW DATA
              this.$set(
                this.relatedData[this.activeTab],
                index,
                this.unformatRelatedDataAutocompleteFields(
                  entity.new,
                  entity.id
                )
              );
              this.$set(entity, "editMode", false);
              this.$set(entity, "new", {});
            });
          }
        } else {
          if (this.isNotEmpty(entity.new)) {
            if (
              this.$route.meta.object === "doi" &&
              this.checkRequiredFields(this.activeTab, entity.new)
            ) {
              toastError({ text: this.$t("messages.checkForm") });
              return;
            }

            this.removeUnnecessaryFields(
              entity.new,
              this.relatedData.copyFields[this.activeTab]
            );
            this.$set(
              this.relatedData[this.activeTab],
              index,
              this.unformatRelatedDataAutocompleteFields(entity.new, entity.id)
            );
            this.$set(entity, "editMode", false);
            this.$set(entity, "new", {});
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
        this.$set(entity, "editMode", false);
      } else if (!entity.allowRemove) {
        this.$set(entity, "allowRemove", true);
      } else {
        if (this.$route.meta.isEdit) {
          // Todo: Else send remove request to api
          console.log("DELETE: " + JSON.stringify(entity));
        } else {
          this.relatedData[this.activeTab].splice(index, 1);
          if (this.$route.meta.isEdit)
            toastSuccess({
              text: `Removed record with an ID: <b>${entity.id}</b> from <b>${this.activeTab}</b>`
            });
        }
      }
    },

    /**
     * Changes ordering.
     *
     * @param {object} entity - Contains active tab name and new orderBy field.
     */
    changeOrdering(entity) {
      if (this.$route.meta.isEdit)
        this.$set(
          this.relatedData.searchParameters[entity.tab],
          "order_by",
          entity.orderBy
        );
    },

    recordAlreadyExists(tab, checkForDuplicates) {
      if (checkForDuplicates) {
        if (tab === "doi_agent") {
          if (this.relatedData[tab].length > 0) {
            let name = this.relatedData.insert[tab].name;
            let agent = this.relatedData.insert[tab].agent;

            for (let entity in this.relatedData[tab]) {
              console.log(this.relatedData[tab][entity].agent);
              console.log(agent);

              if (
                this.relatedData[tab][entity].name &&
                name &&
                this.relatedData[tab][entity].name === name
              )
                return true;
              else if (
                this.relatedData[tab][entity].agent &&
                agent &&
                this.relatedData[tab][entity].agent === agent.id
              )
                return true;
            }
          }
        }
      }

      return false;
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

      if (choice === "SAVE_AS_NEW") {
        this.add(true, object, false, true);
      }

      if (choice === "CLEAR") {
        this.setInitialData();
        this.reloadData();
        if (object === "attachment") this.$set(this.$data, "clearFiles", true);
        toastInfo({ text: this.$t("messages.fieldsCleared") });
      }

      if (choice === "CANCEL") this.$router.push({ path: "/" + object });

      if (choice === "COPY_TO_LOCALITY") {
        this.add(true, object, true, false, 'locality').then(localityId => {
          console.log(localityId);
          if (this.isNotEmpty(localityId)) {
            this[object].locality.id = localityId;
            this.add(true, object, true).then(() => {
              this.$router.push({ path: "/locality/" + localityId });
            });
          }
        });
      }
    },

    /**
     * Returns file's url.
     *
     * @param filename - String value of file's name
     * @param size - can be small, medium, large or original.
     * @returns {string} - file's url
     */
    composeFileUrl(filename, size = "small") {
      if (filename) {
        if (size === "small" || size === "medium" || size === "large") {
          return (
            this.fileUrl +
            "/" +
            size +
            "/" +
            filename.substring(0, 2) +
            "/" +
            filename.substring(2, 4) +
            "/" +
            filename
          );
        } else {
          return (
            this.fileUrl +
            "/" +
            filename.substring(0, 2) +
            "/" +
            filename.substring(2, 4) +
            "/" +
            filename
          );
        }
      }
    },

    /**
     * Calculates next name, for example 'Test site 1' --> 'Test site 2'
     *
     * @param {string} previousName - It will be used to calculate next name.
     * @returns {string} - next name
     */
    calculateNextName(previousName) {
      if (!this.isNotEmpty(previousName)) return;
      let tokenize = previousName.split(/[^0-9]/g);
      let lastToken = tokenize[tokenize.length - 1];
      //last token is number
      return isNaN(parseInt(lastToken))
        ? previousName + " 1"
        : previousName.substring(0, previousName.length - lastToken.length) +
            (parseInt(lastToken) + 1);
    },

    getActiveProject() {
      let activeProject = this.$localStorage.get(
        "activeProject",
        "fallbackValue"
      );
      if (this.isNotEmpty(activeProject) && activeProject !== "fallbackValue")
        return activeProject[0];
      return null;
    },

    parseDate(date) {
      if (date) {
        return moment(String(date)).format("DD-MM-YYYY HH:mm");
      }
    },

    toastResponseMessages(response) {
      if (typeof response.body.message !== "undefined") {
        toastSuccess({ text: response.body.message });
      }
      if (typeof response.body.error !== "undefined") {
        toastError({ text: response.body.error });
      }
    }
  },

  watch: {
    showCollapseMap(newVal) {
      if (this.isNotEmpty(newVal))
        this.$localStorage.set("mapComponent", newVal);
    },
    attachmentLinkSaved: {
      handler: function(newval) {
        if (newval === 0) {
          this.$root.$emit("attachment-loading-status", true);
          this.loadRelatedData("attachment_link");
          this.attachmentLinkSaved = -1;
        }
      },
      deep: true
    }
  }
};

export default formManipulation;
