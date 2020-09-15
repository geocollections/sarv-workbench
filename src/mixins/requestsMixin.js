import cloneDeep from "lodash/cloneDeep";
import { fetchDeleteRecord, postRequest } from "../assets/js/api/apiCalls";
import toastMixin from "./toastMixin";

const requestsMixin = {
  mixins: [toastMixin],
  data: () => ({
    apiUrl: "https://rwapi.geocollections.info/"
  }),

  methods: {
    addRelatedItem(payload, connectionField = null) {
      console.log(payload);
      let table = payload.table;
      if (table === "taxon_subclass") table = "taxon";

      if (this.$route.meta.isEdit) {
        let url = `add/${table}/`;
        let formData = new FormData();
        let uploadableObject = cloneDeep(payload.item);

        let mainObjectKey = this.$route.meta.table;
        if (connectionField) mainObjectKey = connectionField;
        if (payload.table === "taxon_subclass" && table === "taxon") {
          mainObjectKey = "parent";
          uploadableObject.taxon = payload.rawItem.taxon;
        }

        uploadableObject[mainObjectKey] = this[this.$route.meta.table].id;

        formData.append("data", JSON.stringify(uploadableObject));

        this.$_requestsMixin_httpRequestWrapper(url, formData).then(
          response => {
            console.log(response);
            if (response) {
              this.loadRelatedData(table);
            }
          }
        );
      } else {
        let clonedRawItem = cloneDeep(payload.rawItem);

        // Changes every empty string to null (is needed for float fields which give error on add #384)
        Object.keys(clonedRawItem).forEach(key => {
          if (
            typeof clonedRawItem[key] === "string" &&
            clonedRawItem[key].length === 0
          ) {
            clonedRawItem[key] = null;
          }
        });

        this.relatedData[table].results.push(clonedRawItem);
        this.relatedData[table].count += 1;
      }
    },

    editRelatedItem(payload) {
      console.log(payload);
      let table = payload.table;
      if (table === "taxon_subclass") table = "taxon";

      if (this.$route.meta.isEdit) {
        let url = `change/${table}/${payload.item.id}`;
        let formData = new FormData();
        let uploadableObject = cloneDeep(payload.item);
        delete uploadableObject.id;

        if (payload.table === "taxon_subclass" && table === "taxon") {
          uploadableObject.parent = this[this.$route.meta.table].id;
          uploadableObject.taxon = payload.rawItem.taxon;
        }

        console.log(JSON.stringify(uploadableObject));
        formData.append("data", JSON.stringify(uploadableObject));

        this.$_requestsMixin_httpRequestWrapper(url, formData).then(
          response => {
            console.log(response);
            if (response) {
              this.loadRelatedData(table);
            }
          }
        );
      } else {
        // Todo
      }
    },

    async deleteRelatedItem(payload) {
      console.log(payload);
      if (this.$route.meta.isEdit) {
        const deleteResponse = await fetchDeleteRecord(
          payload.table,
          payload.item.id
        ).then(
          response => response,
          errResponse => errResponse
        );

        if (deleteResponse) {
          this.$_requestsMixin_handleResponseMessages(
            deleteResponse,
            deleteResponse.status === 200,
            true
          );

          if (deleteResponse.status === 200)
            this.loadRelatedData(payload.table);
        }
      } else {
        // Todo
      }
    },

    $_requestsMixin_httpRequestWrapper(url, formData) {
      return new Promise(resolve => {
        this.$_requestsMixin_httpRequest(url, formData, resolve);
      });
    },

    $_requestsMixin_httpRequest(url, formData, resolve) {
      postRequest(url, formData).then(
        response => {
          if (response.status === 200) {
            this.$_requestsMixin_toastResponseMessage(response);
            if (!!response.data && !!response.data.id) {
              resolve(response.data.id);
            } else resolve(false);
          } else resolve(false);
        },
        errResponse => {
          console.log("ERROR: " + JSON.stringify(errResponse));
          this.toastError({ text: this.$t("messages.uploadError") });
          resolve(false);
        }
      );
    },

    $_requestsMixin_toastResponseMessage(response) {
      if (this.$i18n.locale === "ee") {
        if (response.data.message_et)
          this.toastSuccess({ text: response.data.message_et });
        else if (response.data.message)
          this.toastSuccess({ text: response.data.message });
        else if (response.data.error_et)
          this.toastError({ text: response.data.error_et });
        else if (response.data.error)
          this.toastError({ text: response.data.error });
      } else {
        if (response.data.message)
          this.toastSuccess({ text: response.data.message });
        else if (response.data.error)
          this.toastError({ text: response.data.error });
      }
    },

    $_requestsMixin_handleResponseMessages(
      response,
      isSuccess,
      isDelete = false
    ) {
      if (isSuccess) {
        if (response?.data?.message) {
          if (this.$i18n.locale === "ee" && response?.data?.message_et) {
            this.toastSuccess({ text: response.data.message_et });
          } else {
            this.toastSuccess({ text: response.data.message });
          }
        }
        if (response?.data?.error) {
          if (this.$i18n.locale === "ee" && response?.data?.error_et) {
            this.toastError({ text: response.data.error_et });
          } else {
            this.toastError({ text: response.data.error });
          }
        }
      } else {
        if (response?.data?.error) {
          if (this.$i18n.locale === "ee" && response?.data?.error_et) {
            this.toastError({ text: response.data.error_et });
          } else {
            this.toastError({ text: response.data.error });
          }
        } else
          this.toastError({
            text: isDelete
              ? this.$t("messages.deleteError")
              : this.$t("messages.uploadError")
          });
      }
    }
  }
};

export default requestsMixin;
