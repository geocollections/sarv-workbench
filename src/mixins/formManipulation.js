import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  fetchAttachmentForReference,
  fetchChangeRecordState,
  fetchRotateImage,
  postRequest,
} from "@/assets/js/api/apiCalls";
import toastMixin from "./toastMixin";

const formManipulation = {
  mixins: [toastMixin],
  data() {
    return {
      isFileAddedAsObject: null,
    };
  },
  mounted() {
    this.$parent.$on("button-clicked", this.bottomOptionClicked);
  },
  beforeDestroy() {
    this.$parent.$off("button-clicked", this.bottomOptionClicked);
  },
  computed: {
    ...mapState("search", ["loadingState"]),
    ...mapGetters("user", ["getCurrentUser", "getDatabaseId"]),
  },
  methods: {
    ...mapActions("search", [
      "setLoadingState",
      "setLoadingType",
      "setLoadingPercent",
      "setActiveSearchParameters",
    ]),
    ...mapActions("detail", [
      "saveFields",
      "resetFields",
      "setInitialEditViewDataHasChangedState",
    ]),

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
     * Handles request's response by returning results list or empty list.
     *
     * @param {object} response - This comes straight from API and is handled here.
     * @returns {array} Results from API.
     */
    handleResponse(response) {
      if (response.status === 200) {
        return response.data.count > 0 ? response.data.results : [];
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
      let isValid = true;
      let isValidOptional = false;

      let fields = this.requiredFields;
      let optionalFields = this.optionalFields;

      // Exceptions
      if (object === "imageset" && !this.$route.meta.isEdit)
        isValid &= !this.imagesetNumberExists;
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
      if (object === "visit") child = "visit";

      if (child) {
        fields = fields[child];
        optionalFields = optionalFields[child];
      }

      if (this.isNotEmpty(fields))
        fields.forEach((el) => (isValid &= this.isNotEmpty(this[object][el])));

      if (this.isNotEmpty(optionalFields))
        optionalFields.forEach(
          (el) => (isValidOptional |= this.isNotEmpty(this[object][el]))
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
      } else if (this.$route.meta.isEdit && object === "sarv_issue") {
        return this.isNotEmpty(this.initialResponse);
      } else return false;
    },

    add(
      addAnother,
      object,
      returnPromise = false,
      saveAsNew = false,
      saveAsDifferentObject
    ) {
      return new Promise((resolve) => {
        if (
          this.validate(object) &&
          !this.loadingState &&
          !this.isObjectLocked(object)
        ) {
          let objectToUpload = cloneDeep(this[object]);

          // Todo: Fix unique fields error, i.e. taxon
          if (saveAsNew) delete objectToUpload.id;

          if (saveAsDifferentObject) {
            if (objectToUpload.id) delete objectToUpload.id;
            object = saveAsDifferentObject;
            this.updateNewObjectsFields(objectToUpload, saveAsDifferentObject);
          }

          let url = objectToUpload.id
            ? `change/${object}/${objectToUpload.id}`
            : `add/${object}/`;
          if (objectToUpload.id) delete objectToUpload.id;

          const dataToUpload = this.formatDataForUpload(
            objectToUpload,
            saveAsNew
          );
          let formData = new FormData();
          formData.append("data", dataToUpload);

          if (object === "attachment" && this.files && this.files.length > 0) {
            for (let file in this.files) {
              if (file === "100" && this.files.length >= 100) break;
              else formData.append("file" + file, this.files[file]);
            }
          }

          this.saveData(object, formData, url).then(
            (savedObjectId) => {
              console.log(savedObjectId);
              console.log("^^^^^^ Saved object ID ^^^^^^ ");

              if (
                this.$route.meta.isEdit &&
                addAnother &&
                object === "sarv_issue"
              ) {
                this.setInitialResponse(this[object]);
              }

              if (saveAsNew) {
                if (this.isNotEmpty(savedObjectId)) {
                  this.$router.push({
                    path: "/" + object + "/" + savedObjectId,
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
                              imageset_number: this[object].imageset_number,
                            },
                          },
                        });
                      } else if (object === "journal") {
                        this.$router.push({
                          name: "reference add",
                          params: {
                            journal: {
                              id: savedObjectId,
                              journal_name: this[object].journal_name,
                            },
                          },
                        });
                      } else {
                        if (Array.isArray(savedObjectId)) {
                          this.$router.push({
                            path: "/" + object,
                          });
                        } else {
                          this.$router.push({
                            path: "/" + object + "/" + savedObjectId,
                          });
                        }
                      }
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
        } else if (this.loadingState) {
          // This runs only if loadingState is true which shouldn't happen normally
          this.toastError({ text: this.$t("messages.easterEggError") });
          resolve(false);
        } else {
          if (object === "attachment" && this.isAttachmentLocked)
            this.toastError({ text: this.$t("messages.lockedForm") });
          if (object === "sarv_issue" && this.isNotEmpty(this.initialResponse))
            this.toastError({ text: this.$t("sarv_issue.message_answered") });
          else this.toastError({ text: this.$t("messages.checkForm") });
          resolve(false);
        }
      });
    },

    saveData(object, formData, url) {
      return new Promise((resolve) => {
        this.request(object, formData, url, resolve);
      });
    },

    request(object, formData, url, resolve) {
      this.setLoadingState(true);
      this.setLoadingType(url.startsWith("change") ? "edit" : "add");
      this.setLoadingPercent(0);

      postRequest(url, formData, "", false, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            let loadingPercent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            this.setLoadingPercent(loadingPercent);
          }
        },
      }).then(
        (response) => {
          console.log(response);
          this.setLoadingState(false);
          if (response.status === 200) {
            if (response.data) {
              if (this.$i18n.locale === "ee") {
                if (response.data.message_et)
                  this.toastSuccess({
                    text: response?.data?.message_et.toString() || "Success",
                  });
                else if (response.data.message)
                  this.toastSuccess({
                    text: response?.data?.message.toString() || "Success",
                  });
                else if (response.data.error_et)
                  this.toastError({
                    text: response?.data?.error_et.toString() || "Error",
                  });
                else if (response.data.error)
                  this.toastError({
                    text: response?.data?.error.toString() || "Error",
                  });
              } else {
                if (response.data.message)
                  this.toastSuccess({
                    text: response?.data?.message.toString() || "Success",
                  });
                else if (response.data.error)
                  this.toastError({
                    text: response?.data?.error.toString() || "Error",
                  });
              }

              if (object === "attachment" && response.data.attachments_ids) {
                if (response.data.attachments_ids.length > 1)
                  resolve(response.data.attachments_ids);
                resolve(response.data.attachments_ids[0]);
              } else if (response.data.id) resolve(response.data.id);
              else resolve(undefined);
            } else resolve(undefined);
          } else resolve(undefined);
        },
        (errResponse) => {
          this.setLoadingState(false);
          console.log("ERROR: " + JSON.stringify(errResponse));
          this.toastError({ text: this.$t("messages.uploadError") });
          resolve(undefined);
        }
      );
    },

    // Currently this method has only one use case and it is in Reference.vue when adding digital version (pdf)
    addFileAsObject(files, relatedObject) {
      let formData = new FormData();

      let notYetUploadedFiles = files.filter((file) => !file.isAlreadyUploaded);

      notYetUploadedFiles.forEach((file, index) => {
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
            author: file.type.includes("pdf") ? null : this.getCurrentUser.id,
            date_created: file.type.includes("pdf")
              ? null
              : this.getCurrentFormattedDate("YYYY-MM-DD"),
            is_private: !this[relatedObject].is_oa,
            specimen_image_attachment: relatedObject === "reference" ? 4 : 3,
            [relatedObject]: this[relatedObject].id,
          })
        );

        formData.append("file" + [index], file);

        file.isAlreadyUploaded = true;
      });

      try {
        this.saveData("attachment", formData, "add/attachment/").then(
          (savedObjectId) => {
            if (this.isNotEmpty(savedObjectId)) {
              this.isFileAddedAsObject = savedObjectId;

              if (this.$route.meta.object === "reference") {
                fetchAttachmentForReference(this.$route.params.id).then(
                  (response) =>
                    (this.attachment = this.handleResponse(response))
                );
              }
            }
          }
        );
      } catch (e) {
        console.log("Attachment cannot be added");
        console.log(e);
      }
    },

    addFileAsRelatedDataNew(
      files,
      relatedObject,
      singleFileMetadata,
      totalAttachmentCount
    ) {
      console.log(files);
      console.log(totalAttachmentCount);
      console.log(singleFileMetadata);
      let attachment_link = `attachment_link__${
        relatedObject === "location" ? "storage" : relatedObject
      }`;

      let formData = new FormData();

      let notYetUploadedFiles = files.filter((file) => !file.isAlreadyUploaded);

      notYetUploadedFiles.forEach((file, index) => {
        if (!file.isAlreadyUploaded) {
          let newUploadableObject = {
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
            author: this.getCurrentUser.id,
            date_created: this.getCurrentFormattedDate("YYYY-MM-DD"),
            is_private: true,
            is_preferred:
              relatedObject === "drillcore_box" && totalAttachmentCount === 0,
            is_locked: relatedObject === "doi",
            related_data: {
              [attachment_link]: [{ id: this[relatedObject].id }],
            },
          };

          if (singleFileMetadata)
            newUploadableObject = {
              ...singleFileMetadata,
              ...newUploadableObject,
            };

          formData.append("data", JSON.stringify(newUploadableObject));
          formData.append("file" + [index], file);

          file.isAlreadyUploaded = true;
        }
      });

      try {
        this.saveData("attachment", formData, "add/attachment/").then(
          (savedObjectId) => {
            console.log(savedObjectId);
            if (savedObjectId) {
              if (relatedObject === "reference")
                this.loadAutocompleteFields(false, true);
              else {
                this.loadRelatedData("attachment");
                this.loadRelatedData("attachment_link");
              }
            }
          }
        );
      } catch (e) {
        console.log("Attachment cannot be added");
        console.log(e);
      }
    },

    /**
     * Todo: As of writing this there are only 3 use cases: Site -> Locality and Sample <-> Specimen
     * Todo: If there should come more use cases then the following method must become more dynamical
     * Todo: Fields could come from: https://rwapi.geocollections.info/fields/{tableName}
     * This method formats currentData object according to new object which will be saved.
     * @param currentData - Data which is saved (current active data)
     * @param object - New object name as string
     */
    updateNewObjectsFields(currentData, object) {
      if (object === "locality") {
        let site = cloneDeep(currentData);
        delete currentData.date_end;
        delete currentData.date_start;
        delete currentData.related_data;
        delete currentData.elevation_accuracy;
        delete currentData.location_accuracy;
        delete currentData.name;
        delete currentData.name_en;
        delete currentData.project;
        currentData.locality = {};
        currentData.locality.id = site.name;
      } else if (object === "sample") {
        delete currentData.specimen_id;
        delete currentData.coll;
        delete currentData.specimen_nr;
        delete currentData.fossil;
        delete currentData.type;
        delete currentData.part;
        delete currentData.locality;
        delete currentData.locality_free;
        delete currentData.sample;
        delete currentData.sample_number;
        delete currentData.agent_collected;
        delete currentData.presence;
        delete currentData.classification;
        delete currentData.locality_is_private;
        delete currentData.remarks_collecting;
        delete currentData.stratigraphy_free;
        delete currentData.accession;
        delete currentData.deaccession;
        delete currentData.remarks_internal;
        delete currentData.tags;
        delete currentData.status;
        delete currentData.original_status;
        delete currentData.parent;
        delete currentData.number_pieces;

        currentData.remarks += " (This record was added from specimen form)";
      } else if (object === "specimen") {
        delete currentData.number;
        delete currentData.number_additional;
        delete currentData.series;
        delete currentData.sample_purpose;
        delete currentData.sample_type;
        delete currentData.parent_sample;
        delete currentData.parent_specimen;
        delete currentData.stratigraphy_free;
        delete currentData.stratigraphy_bed;
        delete currentData.classification_rock;
        delete currentData.rock;
        delete currentData.rock_en;
        delete currentData.fossils;
        delete currentData.mass;
        delete currentData.storage_additional;
        delete currentData.owner;
        delete currentData.palaeontology;
        delete currentData.analysis;
        delete currentData.locality;
        delete currentData.locality_free;

        currentData.remarks_internal +=
          "(This record was added from sample form)";
      }
    },

    reset(object, isEdit) {
      console.log("reset");
      if (isEdit) this.$router.push({ path: "/" + object });
      else {
        this[object] = {};
        this.toastInfo({ text: this.$t("messages.fieldsCleared") });
      }
      // isEdit ? this.$router.push({ path: '/' + object }) : this[object] = {};
    },

    windowOpenNewTab(path, query = {}, meta) {
      let routeData = this.$router.resolve({
        path: path,
        query: query,
        meta: meta,
      });
      let height = window.screen.height;
      let top = height ? height / 2 - 364 : 176;
      window.open(
        routeData.href,
        "PopupWindow",
        `top=${top},left=325,width=786,height=600`
      );
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

    /**
     * Removes unnecessary fields from object.
     *
     * @param object - data object from api, for example doi, specimen etc.
     * @param copyFields - Array of fields which will be sent to API using add or change request.
     * @returns object, which has unnecessary fields removed.
     */
    removeUnnecessaryFields(object, copyFields) {
      //copy only certain fields
      Object.entries(object).forEach((entry) => {
        if (copyFields.indexOf(entry[0]) < 0) {
          delete object[entry[0]];
        }
      });
      return object;
    },

    /**
     * Currently every main object is initialised with empty object {}.
     * This method adds needed fields with null values which makes it reactive.
     * @param {string} objectName - object name from the $route meta (site, project etc.)
     * @param {array} fields - list of fields to init an object with.
     */
    makeObjectReactive(objectName, fields) {
      if (
        typeof this[objectName] !== "undefined" &&
        this[objectName] !== null &&
        typeof fields !== "undefined" &&
        fields !== null
      ) {
        fields.forEach((field) => {
          if (typeof this[objectName][field] === "undefined") {
            this.$set(this[objectName], field, null);
          }
        });
      }
    },

    /**
     * Handles user's bottom options button click by calling add method, route leave or resetting object.
     *
     * @param {string} choice - User's choice in String format e.g., 'SAVE', 'CLEAR', etc.
     * @param {string} object - Current object which user tries to edit or sth. ('specimen', 'doi', etc.)
     *
     * @example bottomOptionClicked('SAVE', 'doi')
     */
    async bottomOptionClicked(choice, object) {
      // Setting 'initialEditViewDataHasChangedState' to false because of bottom option click
      // which is intended as an intentional click and shouldn't ask for confirmation.
      this.setInitialEditViewDataHasChangedState(false);

      if (choice === "SAVE") {
        if (object === "attachment" && this?.imageRotationState)
          await this.rotateImageRequest(
            object,
            this.imageRotationDegreesForApi
          );

        await this.add(true, object);
      }

      if (choice === "FINISH") {
        this[object].date_end = this.getCurrentFormattedDate();
        this.add(false, object);
      }

      if (choice === "SAVE_AND_LEAVE") {
        if (object === "attachment" && this?.imageRotationState)
          await this.rotateImageRequest(
            object,
            this.imageRotationDegreesForApi
          );

        await this.add(false, object);
      }

      if (choice === "SAVE_AS_NEW") {
        this.add(true, object, false, true);
      }

      if (choice === "CLEAR") {
        this.setInitialData();
        this.reloadData();
        if (object === "attachment") this.$set(this.$data, "clearFiles", true);
        this.toastInfo({ text: this.$t("messages.fieldsCleared") });
      }

      if (choice === "CANCEL") this.$router.push({ path: "/" + object });

      if (choice === "COPY_TO_LOCALITY") {
        this.add(true, object, true, false, "locality").then((localityId) => {
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

    isValidDateTime(dateTime) {
      const formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm"];
      return moment(dateTime, formats, true).isValid();
    },

    formatDateForUpload(date) {
      return moment(date).toISOString(true).split(".")[0] + "Z"; // Without fractions
    },

    unformatISOStringToDate(date, format = "YYYY-MM-DD HH:mm:ss") {
      if (typeof date !== "undefined" && date !== null) {
        let datePart = date.split("T")[0];
        let timePart = date.split("T")[1].slice(0, -1);

        return moment(datePart + " " + timePart).format(format);
      } else return null;
    },

    getCurrentFormattedDate(format) {
      if (format) return moment().format(format);
      else return moment().format("YYYY-MM-DD HH:mm:ss");
    },

    updateUserInputtedDate(fieldToBeUpdated, date) {
      if (typeof date !== "undefined" && date !== null && date.length > 0) {
        if (this.$moment(date, "YYYY-MM-DD", true).isValid()) {
          this[this.$route.meta.object][fieldToBeUpdated] = date;
        }
      }
    },

    handleResponseMessages(response, isSuccess, isDelete = false) {
      if (isSuccess) {
        if (typeof response.data.message !== "undefined") {
          if (
            this.$i18n.locale === "ee" &&
            typeof response.data.message_et !== "undefined"
          ) {
            this.toastSuccess({ text: response.data.message_et });
          } else {
            this.toastSuccess({ text: response.data.message });
          }
        }
        if (typeof response.data.error !== "undefined") {
          if (
            this.$i18n &&
            this.$i18n.locale === "ee" &&
            typeof response.data.error_et !== "undefined"
          ) {
            this.toastError({ text: response.data.error_et });
          } else {
            this.toastError({ text: response.data.error });
          }
        }
      } else {
        if (
          typeof response.data !== "undefined" &&
          typeof response.data.error !== "undefined"
        )
          this.toastError({ text: response.data.error });
        this.toastError({
          text: isDelete
            ? this.$t("messages.deleteError")
            : this.$t("messages.uploadError"),
        });
      }
    },

    changeObjectsState(data) {
      let formData = new FormData();
      const id = data.id;
      const table = data.table;
      delete data.id;
      delete data.table;
      formData.append("data", JSON.stringify({ ...data }));

      fetchChangeRecordState(table, id, formData).then(
        (response) => {
          if (response && response.data) {
            if (this.$i18n.locale === "ee") {
              if (response.data.message_et)
                this.toastSuccess({ text: response.data.message_et });
              else if (response.data.error_et)
                this.toastError({ text: response.data.error_et });
            } else {
              if (response.data.message)
                this.toastSuccess({ text: response.data.message });
              else if (response.data.error)
                this.toastError({ text: response.data.error });
            }
          }
        },
        (errResponse) => {
          if (errResponse && errResponse.data && errResponse.data.error)
            this.toastError({ text: errResponse.data.error });
          this.toastError({ text: this.$t("messages.uploadError") });
        }
      );
    },

    async rotateImageRequest(object, degrees) {
      if (this[object]?.id) {
        let formData = new FormData();
        const data = {
          image_ids: [this[object].id],
          degrees: degrees,
        };

        formData.append("data", JSON.stringify({ ...data }));

        const response = await fetchRotateImage(formData);

        // Todo: Get success and error messages from api
        if (response) {
          this.filePreviewKey = Date.now();
          this.imageRotationDegrees = 0;

          this.toastSuccess({ text: this.$t("attachment.imageRotated") });
        } else
          this.toastError({ text: this.$t("attachment.imageRotationFailed") });

        console.log(response);
      }
    },
  },
};

export default formManipulation;
