import moment from "moment";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  fetchAttachmentForReference,
  fetchChangeRecordState,
  postRequest,
} from "../assets/js/api/apiCalls";
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
    ...mapGetters("user", ["getCurrentAgent", "getDatabaseId"]),
  },
  methods: {
    ...mapActions("search", ["setLoadingState", "setActiveSearchParameters"]),
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

    async save(module, saveAndLeave = false, saveAsNew = false) {
      if (this.validate(module)) {
        const data = this.formatDataForUpload(this[module]);

        let method = data?.id ? "put" : "post";
        // Todo: Some fields may be unique and throw upload errors
        if (saveAsNew) method = "post";

        // Setting form data
        let formData = new FormData();
        Object.keys(data).forEach((key) => formData.set(key, data[key]));

        // Adding files if any to form data
        if (module === "attachment" && this?.files?.length > 0) {
          for (let file in this.files) {
            if (file === "100" && this.files.length >= 100) break;
            else formData.append("files", this.files[file]);
          }
        }

        let response;
        if (method === "post") {
          response = await this.$api.rw.post(module, formData);
        } else if (method === "put") {
          response = await this.$api.rw.put(module, data?.id, formData);
        }
        console.log(response);

        const newRecordId = response?.id;

        if (newRecordId) {
          if (saveAndLeave) this.$router.push({ path: `/${module}` });
          else if (data?.id === newRecordId)
            this.$emit("data-loaded", response);
          else this.$router.push({ path: `/${module}/${newRecordId}` });
          return response;
        } else {
          this.toastInfo({
            text: "Something went wrong, new record is missing ID",
          });
          return false;
        }
      } else {
        this.toastInfo({ text: "Please fill all the required fields" });
        return false;
      }
    },

    async saveData(object, formData, url, method) {
      return await this.request(object, formData, url, method);
    },

    async request(object, formData, url, method) {
      this.setLoadingState(true);

      const response = await postRequest(url, formData, "", method);
      this.setLoadingState(false);

      console.log(response);
      this.toastSuccess({
        text: method === "post" ? "Record Added" : "Record changed",
      });

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
        }
      }
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
            author: file.type.includes("pdf") ? null : this.getCurrentAgent.id,
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
      let attach_link = `attach_link__${
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
            author: this.getCurrentAgent.id,
            date_created: this.getCurrentFormattedDate("YYYY-MM-DD"),
            is_private: true,
            is_preferred:
              relatedObject === "drillcore_box" && totalAttachmentCount === 0
                ? true
                : false,
            is_locked: relatedObject === "doi",
            related_data: { [attach_link]: [{ id: this[relatedObject].id }] },
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
     * Handles user's bottom options button click by calling add method, route leave or resetting object.
     *
     * @param {string} choice - User's choice in String format e.g., 'SAVE', 'CLEAR', etc.
     *
     * @example bottomOptionClicked('SAVE')
     */
    async bottomOptionClicked(choice) {
      // Setting 'initialEditViewDataHasChangedState' to false because of bottom option click
      // which is intended as an intentional click and shouldn't ask for confirmation.
      this.setInitialEditViewDataHasChangedState(false);
      const availableChoices = [
        "SAVE",
        "SAVE_AND_LEAVE",
        "SAVE_AS_NEW",
        "CLEAR",
        "CANCEL",
        "FINISH",
        "COPY_TO_LOCALITY",
      ];
      const module = this.$route.meta.object;

      if (availableChoices.includes(choice)) {
        // Attachment special case. Save new image rotation before saving record itself
        if (
          module === "attachment" &&
          this?.imageRotationState &&
          (choice === "SAVE" || choice === "SAVE_AND_LEAVE")
        ) {
          await this.$_formManipulation_rotateImageRequest(
            this?.[module]?.id,
            this.imageRotationDegreesForApi
          );
        }

        if (choice === "SAVE") await this.save(module);

        // Site special case
        if (choice === "FINISH") {
          this[module].date_end = this.getCurrentFormattedDate();
          await this.save(module);
        }

        if (choice === "SAVE_AND_LEAVE") await this.save(module, true);

        if (choice === "SAVE_AS_NEW") await this.save(module, false, true);

        if (choice === "CLEAR") {
          this.setInitialData();
          this.reloadData();
          if (module === "attachment")
            this.$set(this.$data, "clearFiles", true);
          this.toastInfo({ text: this.$t("messages.fieldsCleared") });
        }

        if (choice === "CANCEL") this.$router.push({ path: "/" + module });

        if (choice === "COPY_TO_LOCALITY") {
          this.save("locality").then((localityId) => {
            console.log(localityId);
            if (this.isNotEmpty(localityId)) {
              this[module].locality.id = localityId;
              this.save(module, true).then(() => {
                this.$router.push({ path: "/locality/" + localityId });
              });
            }
          });
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

    async $_formManipulation_rotateImageRequest(imageIds, degrees) {
      if (imageIds) {
        let formData = new FormData();
        formData.set("image_ids", imageIds);
        formData.set("degrees", degrees);

        const res = await this.$api.rw.rotateImages(formData);
        console.log(res);

        if (res) {
          this.filePreviewKey = Date.now();
          this.imageRotationDegrees = 0;
          this.toastSuccess({ text: this.$t("attachment.imageRotated") });
        } else
          this.toastError({ text: this.$t("attachment.imageRotationFailed") });
      }
    },
  },
};

export default formManipulation;
