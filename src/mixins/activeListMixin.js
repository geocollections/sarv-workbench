import { mapActions, mapState } from "vuex";
import {
  fetchAddItemToSelection,
  fetchAddReferenceToLibrary,
  fetchRemoveRecordFromSelection,
  fetchRemoveReferenceFromLibrary
} from "../assets/js/api/apiCalls";
import { cloneDeep } from "lodash";

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
      immediate: true
    },

    activeLibraryList: {
      handler(newVal) {
        if (this.$route.meta.object === "reference") {
          this.fillSelectedValues(newVal);
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions("search", [
      "getActiveSelectionSeriesList",
      "getActiveLibraryList"
    ]),

    fillSelectedValues(activeList) {
      if (activeList && activeList.length > 0) {
        if (this?.response?.results && this.response.results.length > 0) {
          let listOfIds = activeList.map(item => item[this.$route.meta.object]);
          let listOfSelectedItems = [];
          this.response.results.forEach(item => {
            if (listOfIds.includes(item.id)) listOfSelectedItems.push(item);
          });
          this.selected = cloneDeep(listOfSelectedItems);
        } else this.selected = [];
      } else this.selected = [];
    },

    addItemToSelectionSeries(selection, relation) {
      console.log(selection);
      console.log(relation);

      if (selection?.item?.id) {
        if (selection.value) {
          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              [relation]: selection?.item?.id,
              selection: this.activeSelectionSeries.id
            })
          );

          fetchAddItemToSelection(formData).then(
            response => {
              this.handleResponseMessages(response, true);
              this.getActiveSelectionSeriesList({
                routeObject: this.$route.meta.object,
                selectionSeriesId: this.activeSelectionSeries.id
              });
            },
            errResponse => {
              this.handleResponseMessages(errResponse, false);
              this.getActiveSelectionSeriesList({
                routeObject: this.$route.meta.object,
                selectionSeriesId: this.activeSelectionSeries.id
              });
            }
          );
        } else {
          if (
            this.activeSelectionSeriesList &&
            this.activeSelectionSeriesList.length > 0
          ) {
            let id = this.activeSelectionSeriesList.find(
              item => item[this.$route.meta.object] === selection.item.id
            )?.id;
            if (id) {
              fetchRemoveRecordFromSelection(id).then(
                response => {
                  this.handleResponseMessages(response, true, true);
                  this.getActiveSelectionSeriesList({
                    routeObject: this.$route.meta.object,
                    selectionSeriesId: this.activeSelectionSeries.id
                  });
                },
                errResponse => {
                  this.handleResponseMessages(errResponse, false, true);
                  this.getActiveSelectionSeriesList({
                    routeObject: this.$route.meta.object,
                    selectionSeriesId: this.activeSelectionSeries.id
                  });
                }
              );
            }
          }
        }
      }
    },

    toggleReferenceInActiveLibrary(selection) {
      console.log(selection);

      if (selection?.item?.id) {
        if (selection.value) {
          let formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({
              reference: selection?.item?.id,
              library: this.activeLibrary.library
            })
          );

          fetchAddReferenceToLibrary(formData).then(
            response => {
              this.handleResponseMessages(response, true);
              this.getActiveLibraryList({
                libraryId: this.activeLibrary.library
              });
            },
            errResponse => {
              this.handleResponseMessages(errResponse, false);
              this.getActiveLibraryList({
                libraryId: this.activeLibrary.library
              });
            }
          );
        } else {
          if (this.activeLibraryList && this.activeLibraryList.length > 0) {
            let id = this.activeLibraryList.find(
              item => item.reference === selection.item.id
            )?.id;
            fetchRemoveReferenceFromLibrary(id).then(
              response => {
                this.handleResponseMessages(response, true, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.library
                });
              },
              errResponse => {
                this.handleResponseMessages(errResponse, false, true);
                this.getActiveLibraryList({
                  libraryId: this.activeLibrary.library
                });
              }
            );
          }
        }
      }
    },

    toggleSelectAll(selection, relation) {
      // Todo: Mass adding/removing

      this.toastInfo({ text: this.$t("messages.underDevelopment") });

      if (relation === "reference") {
        this.getActiveLibraryList({
          libraryId: this.activeLibrary.library
        });
      } else {
        this.getActiveSelectionSeriesList({
          routeObject: this.$route.meta.object,
          selectionSeriesId: this.activeSelectionSeries.id
        });
      }

      // Todo: Distinguish references to library, others to selection
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
            : this.$t("messages.uploadError")
        });
      }
    }
  }
};

export default activeListMixin;
