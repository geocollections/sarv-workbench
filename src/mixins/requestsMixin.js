import cloneDeep from "lodash/cloneDeep";
import { toastError, toastSuccess } from "../assets/js/iziToast/iziToast";

const requestsMixin = {
  data: () => ({
    apiUrl: "https://rwapi.geocollections.info/"
  }),

  methods: {
    addRelatedItem(payload) {
      console.log(payload);

      if (this.$route.meta.isEdit) {
        let url = `add/${payload.table}/`;
        let formData = new FormData();
        let uploadableObject = cloneDeep(payload.item);
        uploadableObject[this.$route.meta.table] = this[
          this.$route.meta.table
        ].id;
        formData.append("data", JSON.stringify(uploadableObject));

        this.httpRequestWrapper(url, formData).then(response => {
          console.log(response);
          if (response) {
            this.loadRelatedData(payload.table);
          }
        });
      } else {
        this.relatedData[payload.table].results.push(payload.rawItem);
        this.relatedData[payload.table].count += 1;
      }
    },

    editRelatedItem(payload) {
      console.log(payload);

      if (this.$route.meta.isEdit) {
        let url = `change/${payload.table}/${payload.item.id}`;
        let formData = new FormData();
        let uploadableObject = cloneDeep(payload.item);
        delete uploadableObject.id;
        formData.append("data", JSON.stringify(uploadableObject));

        this.httpRequestWrapper(url, formData).then(response => {
          console.log(response);
          if (response) {
            this.loadRelatedData(payload.table);
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
      this.$http.post(this.apiUrl + url, formData).then(
        response => {
          if (response.status === 200) {
            this.toastResponseMessage(response);
            if (!!response.body && !!response.body.id) {
              resolve(response.body.id);
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
        if (response.body.message_et)
          toastSuccess({ text: response.body.message_et });
        else if (response.body.message)
          toastSuccess({ text: response.body.message });
        else if (response.body.error_et)
          toastError({ text: response.body.error_et });
        else if (response.body.error) toastError({ text: response.body.error });
      } else {
        if (response.body.message)
          toastSuccess({ text: response.body.message });
        else if (response.body.error) toastError({ text: response.body.error });
      }
    }
  }
};

export default requestsMixin;
