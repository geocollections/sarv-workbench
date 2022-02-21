import { mapActions, mapState } from "vuex";
import {
  fetchAddItemToSelection,
  fetchAddReferenceToLibrary,
  fetchMultiAddRecordToSelection,
  fetchMultiAddReferencesToLibrary,
  fetchMultiRemoveRecordFromSelection,
  fetchMultiRemoveReferencesFromLibrary,
  fetchRemoveRecordFromSelection,
  fetchRemoveReferenceFromLibrary,
} from "@/assets/js/api/apiCalls";
import { cloneDeep } from "lodash";
import toastMixin from "@/mixins/toastMixin";

const activeListMixin = {
  mixins: [toastMixin],

  computed: {
    ...mapState("search", [
      "activeSelectionSeries",
      "activeLibrary",
      "activeList",
      "selectedList",
    ]),
  },

  methods: {
    ...mapActions("search", ["getActiveList"]),

    async itemSelected(payload) {
      console.log("itemSelected");
      console.log(payload);

      if (payload?.item?.id) {
        const table =
          payload.module === "reference" ? "library_reference" : "selection";
        const connectionField =
          payload.module === "reference" ? "library" : "selection";
        const activeObject =
          payload.module === "reference"
            ? this.activeLibrary
            : this.activeSelectionSeries;

        if (payload.value) {
          let formData = new FormData();
          formData.set([payload.module], payload.item.id);
          formData.set(connectionField, activeObject.id);

          await this.$api.rw.post(table, formData);
        } else {
          const itemFromActiveList = this.activeList.find(
            (item) => item?.[payload.module]?.id === payload.item.id
          );
          if (itemFromActiveList?.id)
            await this.$api.rw.delete(table, itemFromActiveList.id);
        }

        await this.getActiveList({
          table,
          connectionField,
          id: activeObject.id,
          module: payload.module,
        });
      }
    },

    async toggleSelectAll(payload) {
      console.log("toggleSelectAll");
      console.log(payload);

      let testObj = [
        { specimen_id: "test_upload 1", remarks: "test multi" },
        { specimen_id: "test_upload 2", remarks: "test multi" },
      ];

      // Todo: Build object and send + backend support for library_reference and selection tables (currently missing)

      const response = await this.$api.rw.post("specimen", testObj);
      console.log(response)
    },

    // toggleSelectAll(selection, relation) {
    //   if (selection?.items && selection.items.length > 0) {
    //     const keyForActiveList =
    //       relation === "reference"
    //         ? "activeLibraryList"
    //         : "activeSelectionSeriesList";
    //
    //     if (selection.value) {
    //       let listOfObjects = [];
    //       const keyForListOfObjects =
    //         relation === "reference" ? "library" : "selection";
    //
    //       listOfObjects = selection.items.map((item) => {
    //         return {
    //           [relation]: item.id,
    //           [keyForListOfObjects]:
    //             relation === "reference"
    //               ? this.activeLibrary.id
    //               : this.activeSelectionSeries.id,
    //         };
    //       });
    //
    //       // Removing duplicates
    //       if (this[keyForActiveList] && this[keyForActiveList].length > 0) {
    //         let listOfDuplicateIds = [];
    //
    //         listOfObjects.forEach((uploadableItem, index) => {
    //           let duplicate = this[keyForActiveList].find(
    //             (item) => item[relation] === uploadableItem[relation]
    //           );
    //           if (duplicate) listOfDuplicateIds.push(duplicate[relation]);
    //         });
    //         listOfObjects = listOfObjects.filter(
    //           (item) => !listOfDuplicateIds.includes(item[relation])
    //         );
    //       }
    //
    //       let formData = new FormData();
    //       formData.append(
    //         "data",
    //         JSON.stringify({
    //           add: listOfObjects,
    //         })
    //       );
    //
    //       if (relation === "reference") {
    //         fetchMultiAddReferencesToLibrary(formData).then(
    //           (response) => {
    //             this.handleResponseMessages(response, true);
    //             this.getActiveLibraryList({
    //               libraryId: this.activeLibrary.id,
    //             });
    //           },
    //           (errResponse) => {
    //             this.handleResponseMessages(errResponse, false);
    //             this.getActiveLibraryList({
    //               libraryId: this.activeLibrary.id,
    //             });
    //           }
    //         );
    //       } else {
    //         fetchMultiAddRecordToSelection(formData).then(
    //           (response) => {
    //             this.handleResponseMessages(response, true);
    //             this.getActiveSelectionSeriesList({
    //               routeObject: this.$route.meta.object,
    //               selectionSeriesId: this.activeSelectionSeries.id,
    //             });
    //           },
    //           (errResponse) => {
    //             this.handleResponseMessages(errResponse, false);
    //             this.getActiveSelectionSeriesList({
    //               routeObject: this.$route.meta.object,
    //               selectionSeriesId: this.activeSelectionSeries.id,
    //             });
    //           }
    //         );
    //       }
    //     } else {
    //       let listOfIds = [];
    //
    //       if (this[keyForActiveList] && this[keyForActiveList].length > 0) {
    //         selection.items.forEach((deletableItem) => {
    //           let id = this[keyForActiveList].find(
    //             (item) => item[relation] === deletableItem.id
    //           )?.id;
    //           if (id) listOfIds.push(id);
    //         });
    //       }
    //
    //       let formData = new FormData();
    //       formData.append(
    //         "data",
    //         JSON.stringify({
    //           delete: listOfIds,
    //         })
    //       );
    //
    //       if (relation === "reference") {
    //         fetchMultiRemoveReferencesFromLibrary(formData).then(
    //           (response) => {
    //             this.handleResponseMessages(response, true, true);
    //             this.getActiveLibraryList({
    //               libraryId: this.activeLibrary.id,
    //             });
    //           },
    //           (errResponse) => {
    //             this.handleResponseMessages(errResponse, false, true);
    //             this.getActiveLibraryList({
    //               libraryId: this.activeLibrary.id,
    //             });
    //           }
    //         );
    //       } else {
    //         fetchMultiRemoveRecordFromSelection(formData).then(
    //           (response) => {
    //             this.handleResponseMessages(response, true, true);
    //             this.getActiveSelectionSeriesList({
    //               routeObject: this.$route.meta.object,
    //               selectionSeriesId: this.activeSelectionSeries.id,
    //             });
    //           },
    //           (errResponse) => {
    //             this.handleResponseMessages(errResponse, false, true);
    //             this.getActiveSelectionSeriesList({
    //               routeObject: this.$route.meta.object,
    //               selectionSeriesId: this.activeSelectionSeries.id,
    //             });
    //           }
    //         );
    //       }
    //     }
    //   }
    // },

    // handleResponseMessages(response, isSuccess, isDelete = false) {
    //   if (isSuccess) {
    //     if (typeof response.data.message !== "undefined") {
    //       if (
    //         this.$i18n.locale === "ee" &&
    //         typeof response.data.message_et !== "undefined"
    //       ) {
    //         this.toastSuccess({ text: response.data.message_et });
    //       } else {
    //         this.toastSuccess({ text: response.data.message });
    //       }
    //     }
    //     if (typeof response.data.error !== "undefined") {
    //       if (
    //         this.$i18n &&
    //         this.$i18n.locale === "ee" &&
    //         typeof response.data.error_et !== "undefined"
    //       ) {
    //         this.toastError({ text: response.data.error_et });
    //       } else {
    //         this.toastError({ text: response.data.error });
    //       }
    //     }
    //   } else {
    //     if (
    //       typeof response.data !== "undefined" &&
    //       typeof response.data.error !== "undefined"
    //     )
    //       this.toastError({ text: response.data.error });
    //     this.toastError({
    //       text: isDelete
    //         ? this.$t("messages.deleteError")
    //         : this.$t("messages.uploadError"),
    //     });
    //   }
    // },
  },
};

export default activeListMixin;
