<template>
  <div class="list-module-core">
    <!-- EXPORT and OPTIONS -->
    <v-row align="center" justify="start" class="px-4 d-print-none">
      <!-- EXPORT -->
      <div class="mr-4 mb-2" v-if="exportButtons">
        <export-buttons
          :filename="module"
          :table-data="response.results"
          :body-active-color="appSettings.bodyActiveColor"
        ></export-buttons>
      </div>

      <!-- OPTIONS -->
      <div
        v-if="useListView || useImageView"
        class="mb-2"
      >
        <v-radio-group
          class="radio-buttons mt-0"
          v-model="currentView"
          row
          hide-details
        >
          <v-radio
            value="table"
            class="mb-2"
            :label="$t('references.tableView')"
            :color="appSettings.bodyActiveColor"
          ></v-radio>
          <v-radio
            v-if="useListView"
            class="mb-2"
            value="list"
            :label="
              $route.meta.object === 'sample' ||
              $route.meta.object === 'specimen'
                ? $t('references.labelView')
                : $t('references.listView')
            "
            :color="appSettings.bodyActiveColor"
          ></v-radio>
          <v-radio
            v-if="useImageView"
            class="mb-2"
            value="image"
            :label="$t('buttons.imageView')"
            :color="appSettings.bodyActiveColor"
          ></v-radio>
        </v-radio-group>
      </div>
    </v-row>

    <!-- PAGINATION -->
    <div
      v-if="response.count > 0"
      class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none"
    >
      <div class="mr-3 mb-3">
        <v-select
          v-model="searchParameters.paginateBy"
          :color="appSettings.bodyActiveColor"
          dense
          :items="paginateByOptionsTranslated"
          :item-color="appSettings.bodyActiveColor"
          label="Paginate by"
          hide-details
        />
      </div>

      <div>
        <v-pagination
          v-model="searchParameters.page"
          :color="appSettings.bodyActiveColor"
          circle
          prev-icon="fas fa-angle-left"
          next-icon="fas fa-angle-right"
          :length="Math.ceil(response.count / searchParameters.paginateBy)"
          :total-visible="5"
        />
      </div>
    </div>

    <!-- DATA TABLE -->
    <v-card
      elevation="4"
      :color="appSettings.bodyColor.split('n-')[0] + 'n-3'"
      class="table-card my-1"
      :loading="isLoading"
    >
      <template v-slot:progress>
        <v-progress-linear
          indeterminate
          :color="appSettings.bodyColor.split('n-')[0] + 'n-1'"
        ></v-progress-linear>
      </template>

      <v-card-title class="d-print-none">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("main.found") }}</span>
          <span class="font-weight-bold">{{ ` ${response.count} ` }}</span>
          <span>{{ $t("main.records") }}</span>
        </span>
        <div class="flex-grow-1"></div>
        <!-- Todo: Not working properly with server-items-length #330 -->
        <!--        <v-text-field-->
        <!--          v-if="module === 'reference' && isTableView"-->
        <!--          v-model="filterTable"-->
        <!--          append-outer-icon="fas fa-search"-->
        <!--          label="Filter records"-->
        <!--          clear-icon="fas fa-times"-->
        <!--          clearable-->
        <!--          :color="appSettings.bodyActiveColor"-->
        <!--        ></v-text-field>-->
      </v-card-title>

      <!-- LIST VIEW -->
      <list-view
        v-if="isListView && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="appSettings.bodyColor"
        :body-active-color="appSettings.bodyActiveColor"
      />

      <!-- IMAGE VIEW -->
      <image-view
        v-if="isImageView && response.count > 0"
        :module="module"
        :data="response.results"
        :body-color="appSettings.bodyColor"
        :body-active-color="appSettings.bodyActiveColor"
      />

      <router-view
        ref="table"
        :response="response"
        :filter="filterTable"
        :search-parameters="searchParameters"
        :is-library-active="isLibraryActive"
        :is-selection-series-active="isSelectionSeriesActive"
        :active-selection-series="activeSelectionSeries"
        v-if="isTableView && response.count > 0"
        v-on:toggle-privacy-state="changeObjectsPrivacyState"
        v-on:add-reference-to-active-library="
          $emit('add-reference-to-active-library', $event)
        "
        v-on:add-item-to-selection-series="addItemToSelectionSeries"
        v-on:toggle-select-all="toggleSelectAll"
        :body-color="appSettings.bodyColor"
        :body-active-color="appSettings.bodyActiveColor"
      />
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/partial/export/ExportButtons";
import ListView from "../components/partial/ListView";
import {
  fetchAddItemToSelection,
  fetchChangePrivacyState
} from "../assets/js/api/apiCalls";
import { toastError, toastSuccess } from "../assets/js/iziToast/iziToast";
import debounce from "lodash/debounce";
import ImageView from "../components/partial/ImageView";
import { mapState } from "vuex";

export default {
  components: {
    ExportButtons,
    ListView,
    ImageView
  },
  props: {
    apiCall: {
      type: Function
    },
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    module: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    searchParameters: {
      type: Object
    },
    searchHistory: {
      type: String,
      default: null
    },
    viewType: {
      type: String,
      default: null
    },

    showFilters: {
      type: Boolean,
      default: false
    },

    multiOrdering: {
      type: Boolean,
      default: false
    },

    exportButtons: {
      type: Boolean,
      default: true
    },

    useListView: {
      type: Boolean,
      default: false
    },

    useImageView: {
      type: Boolean,
      default: false
    },

    combinedView: {
      type: Boolean,
      default: false
    },

    isLibraryActive: {
      type: Boolean
    },

    isSelectionSeriesActive: {
      type: Boolean
    },

    activeSelectionSeries: {
      type: Object
    }
  },
  name: "ListModuleCore",
  data() {
    return {
      paginateByOptions: [
        { text: "main.pagination", value: 10 },
        { text: "main.pagination", value: 25 },
        { text: "main.pagination", value: 50 },
        { text: "main.pagination", value: 100 },
        { text: "main.pagination", value: 250 },
        { text: "main.pagination", value: 500 },
        { text: "main.pagination", value: 1000 }
      ],
      filterTable: "",
      noResults: null,
      isLoading: false,
      response: {
        count: 0,
        results: []
      },
      currentView: "table"
    };
  },

  metaInfo() {
    return {
      title: this.$t(this.title)
    };
  },

  computed: {
    ...mapState(["appSettings"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    },

    isTableView() {
      // true and false checks are put just in case, because of migrating from old viewType value page didn't show table.
      // Clear filtering button fixes it but just in case
      return (
        this.currentView === "table" ||
        this.currentView === "false" ||
        this.currentView === "true" ||
        typeof this.currentView === "boolean"
      );
    },

    isListView() {
      return this.currentView === "list";
    },

    isImageView() {
      return this.currentView === "image";
    },

    // Special use case for references (choosing reference to active library).
    activeColumns() {
      return this.columns.filter(column => {
        if (column.type !== "ACTIVE_LIBRARY_HEADER") {
          return column;
        } else if (
          column.type === "ACTIVE_LIBRARY_HEADER" &&
          this.isLibraryActive
        ) {
          return column;
        }
      });
    }
  },
  watch: {
    searchParameters: {
      handler: function() {
        this.search(this.searchParameters);
      },
      deep: true
    },
    currentView(newVal, oldVal) {
      this.$localStorage.set(this.viewType, newVal);

      // Because specimen image and table use different search url
      if (this.module === "specimen" && newVal === "image") {
        this.response = { count: 0, results: [] };
        this.$emit("search:specimenImages", true);
      } else if (this.module === "specimen" && oldVal === "image") {
        this.response = { count: 0, results: [] };
        this.$emit("search:specimenImages", false);
      }
    }
  },

  created: function() {
    const searchHistory = this.$localStorage.get(
      this.searchHistory,
      "fallbackValue"
    );

    if (
      searchHistory !== "fallbackValue" &&
      Object.keys(searchHistory).length !== 0 &&
      searchHistory.constructor === Object
    ) {
      this.$emit("search-params-changed", searchHistory);
    } else {
      this.search(this.searchParameters);
    }

    let viewingType = this.$localStorage.get(this.viewType, "table");
    // Changes old boolean value to correct string (maybe make the storage value into object or something?)
    if (
      viewingType === "false" ||
      viewingType === "true" ||
      typeof viewingType === "boolean"
    )
      this.currentView = "table";
    else this.currentView = viewingType;
  },

  methods: {
    search: debounce(function(searchParameters) {
      this.isLoading = true;
      //I don't know how to check if an object is serializable... at least i haven't found the solution
      //sample search returns [object Object] but locality object {locality:null,...}
      // if(this.searchHistory === 'sampleSearchHistory') searchParameters = JSON.stringify(searchParameters);
      this.$localStorage.set(this.searchHistory, searchParameters);
      this.$emit("search-params-changed", searchParameters);

      this.apiCall().then(
        response => {
          if (response.status === 200) {
            if (response.body.count === 0) this.noResults = true;
            if (response.body.count > 0) this.noResults = false;
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    }, 500),

    changeObjectsPrivacyState(state, id) {
      let formData = new FormData();
      formData.append("data", JSON.stringify({ is_private: state }));

      fetchChangePrivacyState(this.module, id, formData).then(
        response => {
          if (response && response.body) {
            if (this.$i18n.locale === "ee") {
              if (response.body.message_et)
                toastSuccess({ text: response.body.message_et });
              else if (response.body.error_et)
                toastError({ text: response.body.error_et });
            } else {
              if (response.body.message)
                toastSuccess({ text: response.body.message });
              else if (response.body.error)
                toastError({ text: response.body.error });
            }
          }
        },
        errResponse => {
          if (errResponse && errResponse.body && errResponse.body.error)
            toastError({ text: errResponse.body.error });
          toastError({ text: this.$t("messages.uploadError") });
        }
      );
    },

    addItemToSelectionSeries(item, relation) {
      if (typeof item === "number") {
        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            [relation]: item,
            selection: this.activeSelectionSeries.id
          })
        );

        fetchAddItemToSelection(formData).then(
          response => {
            if (typeof response.body.message !== "undefined") {
              if (
                this.$i18n.locale === "ee" &&
                typeof response.body.message_et !== "undefined"
              ) {
                toastSuccess({ text: response.body.message_et });
              } else {
                toastSuccess({ text: response.body.message });
              }
            }
            if (typeof response.body.error !== "undefined") {
              if (
                this.$i18n &&
                this.$i18n.locale === "ee" &&
                typeof response.body.error_et !== "undefined"
              ) {
                toastError({ text: response.body.error_et });
              } else {
                toastError({ text: response.body.error });
              }
            }
          },
          errResponse => {
            if (typeof errResponse.body.error !== "undefined")
              toastError({ text: errResponse.body.error });
            toastError({ text: this.$t("messages.uploadError") });
          }
        );
      } else {
        // Todo: vuetify built in select
        console.log(item);
        console.log("TODO");
      }
    },

    toggleSelectAll(test) {
      console.log(test);
    }
  }
};
</script>
<style scoped>
.radio-buttons >>> .form-group {
  margin-bottom: unset;
}

.radio-buttons >>> .v-label {
  margin-bottom: 0;
}
</style>
