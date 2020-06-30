import { mapState } from "vuex";
import {
  fetchAddItemToSelection,
  fetchAddReferenceToLibrary
} from "../assets/js/api/apiCalls";

const activeListMixin = {
  data: () => ({
    selected: []
  }),

  computed: {
    ...mapState("search", [
      "activeSelectionSeriesList",
      "activeLibraryList",
      "activeSelectionSeries",
      "activeLibrary"
    ])
  },

  watch: {
    activeSelectionSeries() {
      this.selected = [];
    },

    activeLibrary() {
      this.selected = [];
    },

    activeSelectionSeriesList(newVal) {
      if (newVal && newVal.length > 0) {
        this.fillSelectedValues(newVal);
      } else this.selected = [];
    },

    activeLibraryList(newVal) {
      if (newVal && newVal.length > 0) {
        this.fillSelectedValues(newVal);
      } else this.selected = [];
    }
  },

  methods: {
    fillSelectedValues(listOfIds) {
      if (this?.response?.results && this.response.results.length > 0) {
        this.response.results.forEach(item => {
          if (listOfIds.includes(item.id)) this.selected.push(item);
        });
      }
    },

    addItemToSelectionSeries(selection, relation) {
      console.log(selection);
      console.log(relation);

      if (selection?.item?.id) {
        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            [relation]: selection?.item?.id,
            selection: this.activeSelectionSeries.id
          })
        );

        if (selection.value) {
          fetchAddItemToSelection(formData).then(
            response => this.handleResponseMessages(response, true),
            errResponse => this.handleResponseMessages(errResponse, false)
          );
        } else {
          // Todo: Remove
          console.log(
            `Todo: Remove ${relation} (${selection?.item?.id}) from selection ${this.activeSelectionSeries.id}`
          );
        }
      }
    },

    addReferenceToActiveLibrary(selection) {
      console.log(selection);

      if (selection?.item?.id) {
        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            reference: selection?.item?.id,
            library: this.activeLibrary.library
          })
        );

        if (selection.value) {
          fetchAddReferenceToLibrary(formData).then(
            response => this.handleResponseMessages(response, true),
            errResponse => this.handleResponseMessages(errResponse, false)
          );
        } else {
          // Todo: Remove
          console.log(
            `Todo: Remove reference (${selection?.item?.id}) from library ${this.activeLibrary.library}`
          );
        }
      }
    },

    toggleSelectAll(selection, relation) {
      // Todo: Mass adding/removing
      if (selection?.items && selection?.items.length > 0) {
        let items = selection.items.map(item => item.id);
        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            [relation]: items,
            selection: this.activeSelectionSeries.id
          })
        );

        if (selection.value) {
          console.log(
            `Todo: Add ${selection?.items.length} ${relation}s to selection ${this.activeSelectionSeries.id}`
          );
        } else {
          console.log(
            `Todo: Remove ${selection?.items.length} ${relation}s from selection ${this.activeSelectionSeries.id}`
          );
        }
      }
    },

    handleResponseMessages(response, isSuccess) {
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
        this.toastError({ text: this.$t("messages.uploadError") });
      }
    }
  }
};

export default activeListMixin;
