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
} from "../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

const activeListMixin = {
  data: () => ({
    selected: [],
  }),

  computed: {
    ...mapState("search", [
      "activeSelectionSeriesList",
      "activeLibraryList",
      "activeSelectionSeries",
      "activeLibrary",
    ]),
  },

  watch: {
    activeSelectionSeriesList: {
      handler(newVal) {
        if (
          this.$route.meta.object === "specimen" ||
          this.$route.meta.object === "sample" ||
          this.$route.meta.object === "attachment" ||
          this.$route.meta.object === "locality" ||
          this.$route.meta.object === "taxon" ||
          this.$route.meta.object === "analysis"
        ) {
          this.fillSelectedValues(newVal);
        }
      },
      immediate: true,
    },

    activeLibraryList: {
      handler(newVal) {
        if (this.$route.meta.object === "reference") {
          this.fillSelectedValues(newVal);
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions("search", [
      "getActiveSelectionSeriesList",
      "getActiveLibraryList",
    ]),

    fillSelectedValues(activeList) {
      if (activeList && activeList.length > 0) {
        if (this?.response?.results && this.response.results.length > 0) {
          let listOfIds = activeList.map(
            (item) => item[this.$route.meta.object]
          );
          let listOfSelectedItems = [];
          this.response.results.forEach((item) => {
            if (listOfIds.includes(item.id)) listOfSelectedItems.push(item);
          });
          this.selected = cloneDeep(listOfSelectedItems);
        } else this.selected = [];
      } else this.selected = [];
    },

    toggleItemInSelectionSeries(selection, relation) {
      if (selection?.item?.id) {
        if (selection.value) {
          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              [relation]: selection?.item?.id,
              selection: this.activeSelectionSeries.id,
            })
          );

          fetchAddItemToSelection(formData).then(
            (response) => {
              this.handleResponseMessages(response, true);
              this.getActiveSelectionSeriesList({
                routeObject: this.$route.meta.object,
                selectionSeriesId: this.activeSelectionSeries.id,
              });
            },
            (errResponse) => {
              this.handleResponseMessages(errResponse, false);
              this.getActiveSelectionSeriesList({
                routeObject: this.$route.meta.object,
                selectionSeriesId: this.activeSelectionSeries.id,
              });
            }
          );
        } else {
          if (
            this.activeSelectionSeriesList &&
            this.activeSelectionSeriesList.length > 0
          ) {
            let id = this.activeSelectionSeriesList.find(
              (item) => item[this.$route.meta.object] === selection.item.id
            )?.id;
            if (id) {
              fetchRemoveRecordFromSelection(id).then(
                (response) => {
                  this.handleResponseMessages(response, true, true);
                  this.getActiveSelectionSeriesList({
                    routeObject: this.$route.meta.object,
                    selectionSeriesId: this.activeSelectionSeries.id,
                  });
                },
                (errResponse) => {
                  this.handleResponseMessages(errResponse, false, true);
                  this.getActiveSelectionSeriesList({
                    routeObject: this.$route.meta.object,
                    selectionSeriesId: this.activeSelectionSeries.id,
                  });
                }
              );
            }
          }
        }
      }
    },

    toggleReferenceInActiveLibrary(selection) {
      if (selection?.item?.id) {
        if (selection.value) {
          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              reference: selection?.item?.id,
              library: this.activeLibrary.id,
            })
          );

          fetchAddReferenceToLibrary(formData).then(
            (response) => {
              this.handleResponseMessages(response, true);
              this.getActiveLibraryList({
                libraryId: this.activeLibrary.id,
              });
            },
            (errResponse) => {
              this.handleResponseMessages(errResponse, false);
              this.getActiveLibraryList({
                libraryId: this.activeLibrary.id,
              });
            }
          );
        } else {
          if (this.activeLibraryList && this.activeLibraryList.length > 0) {
            let id = this.activeLibraryList.find(
              (item) => item.reference === selection.item.id
            )?.id;
            fetchRemoveReferenceFromLibrary(id).then(
              (response) => {
                this.handleResponseMessages(response, true, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              },
              (errResponse) => {
                this.handleResponseMessages(errResponse, false, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              }
            );
          }
        }
      }
    },

    toggleSelectAll(selection, relation) {
      if (selection?.items && selection.items.length > 0) {
        const keyForActiveList =
          relation === "reference"
            ? "activeLibraryList"
            : "activeSelectionSeriesList";

        if (selection.value) {
          let listOfObjects = [];
          const keyForListOfObjects =
            relation === "reference" ? "library" : "selection";

          listOfObjects = selection.items.map((item) => {
            return {
              [relation]: item.id,
              [keyForListOfObjects]:
                relation === "reference"
                  ? this.activeLibrary.id
                  : this.activeSelectionSeries.id,
            };
          });

          // Removing duplicates
          if (this[keyForActiveList] && this[keyForActiveList].length > 0) {
            let listOfDuplicateIds = [];

            listOfObjects.forEach((uploadableItem, index) => {
              let duplicate = this[keyForActiveList].find(
                (item) => item[relation] === uploadableItem[relation]
              );
              if (duplicate) listOfDuplicateIds.push(duplicate[relation]);
            });
            listOfObjects = listOfObjects.filter(
              (item) => !listOfDuplicateIds.includes(item[relation])
            );
          }

          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              add: listOfObjects,
            })
          );

          if (relation === "reference") {
            fetchMultiAddReferencesToLibrary(formData).then(
              (response) => {
                this.handleResponseMessages(response, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              },
              (errResponse) => {
                this.handleResponseMessages(errResponse, false);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              }
            );
          } else {
            fetchMultiAddRecordToSelection(formData).then(
              (response) => {
                this.handleResponseMessages(response, true);
                this.getActiveSelectionSeriesList({
                  routeObject: this.$route.meta.object,
                  selectionSeriesId: this.activeSelectionSeries.id,
                });
              },
              (errResponse) => {
                this.handleResponseMessages(errResponse, false);
                this.getActiveSelectionSeriesList({
                  routeObject: this.$route.meta.object,
                  selectionSeriesId: this.activeSelectionSeries.id,
                });
              }
            );
          }
        } else {
          let listOfIds = [];

          if (this[keyForActiveList] && this[keyForActiveList].length > 0) {
            selection.items.forEach((deletableItem) => {
              let id = this[keyForActiveList].find(
                (item) => item[relation] === deletableItem.id
              )?.id;
              if (id) listOfIds.push(id);
            });
          }

          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              delete: listOfIds,
            })
          );

          if (relation === "reference") {
            fetchMultiRemoveReferencesFromLibrary(formData).then(
              (response) => {
                this.handleResponseMessages(response, true, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              },
              (errResponse) => {
                this.handleResponseMessages(errResponse, false, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.id,
                });
              }
            );
          } else {
            fetchMultiRemoveRecordFromSelection(formData).then(
              (response) => {
                this.handleResponseMessages(response, true, true);
                this.getActiveSelectionSeriesList({
                  routeObject: this.$route.meta.object,
                  selectionSeriesId: this.activeSelectionSeries.id,
                });
              },
              (errResponse) => {
                this.handleResponseMessages(errResponse, false, true);
                this.getActiveSelectionSeriesList({
                  routeObject: this.$route.meta.object,
                  selectionSeriesId: this.activeSelectionSeries.id,
                });
              }
            );
          }
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
  },
};

export default activeListMixin;
