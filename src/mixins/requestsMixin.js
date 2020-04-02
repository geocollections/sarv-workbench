import cloneDeep from "lodash/cloneDeep";
import { toastError, toastSuccess } from "../assets/js/iziToast/iziToast";
import { postRequest } from "../assets/js/api/apiCalls";

const requestsMixin = {
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
          uploadableObject.taxon = payload.rawItem.taxon.taxon;
        }

        uploadableObject[mainObjectKey] = this[this.$route.meta.table].id;

        formData.append("data", JSON.stringify(uploadableObject));

        this.httpRequestWrapper(url, formData).then(response => {
          console.log(response);
          if (response) {
            this.loadRelatedData(table);
          }
        });
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
          uploadableObject.taxon = payload.rawItem.taxon.taxon;
        }

        console.log(JSON.stringify(uploadableObject));
        formData.append("data", JSON.stringify(uploadableObject));

        this.httpRequestWrapper(url, formData).then(response => {
          console.log(response);
          if (response) {
            this.loadRelatedData(table);
          }
        });
      } else {
        // Todo
      }
    },

    deleteRelatedItem(payload) {
      console.log(payload);
      // Todo
    },

    httpRequestWrapper(url, formData) {
      return new Promise(resolve => {
        this.httpRequest(url, formData, resolve);
      });
    },

    httpRequest(url, formData, resolve) {
      postRequest(url, formData).then(
        response => {
          if (response.status === 200) {
            this.toastResponseMessage(response);
            if (!!response.data && !!response.data.id) {
              resolve(response.data.id);
            } else resolve(false);
          } else resolve(false);
        },
        errResponse => {
          console.log("ERROR: " + JSON.stringify(errResponse));
          toastError({ text: this.$t("messages.uploadError") });
          resolve(false);
        }
      );
    },

    toastResponseMessage(response) {
      if (this.$i18n.locale === "ee") {
        if (response.data.message_et)
          toastSuccess({ text: response.data.message_et });
        else if (response.data.message)
          toastSuccess({ text: response.data.message });
        else if (response.data.error_et)
          toastError({ text: response.data.error_et });
        else if (response.data.error) toastError({ text: response.data.error });
      } else {
        if (response.data.message)
          toastSuccess({ text: response.data.message });
        else if (response.data.error) toastError({ text: response.data.error });
      }
    }
  }
};

export default requestsMixin;
