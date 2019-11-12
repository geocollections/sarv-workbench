<template>
  <div class="list-module-core">
    <!-- EXPORT and OPTIONS -->
    <v-row align="center" justify="start" class="px-4 d-print-none">
      <!-- EXPORT -->
      <div class="mr-4 mb-2" v-if="exportButtons">
        <export-buttons
          :filename="module"
          :table-data="response.results"
        ></export-buttons>
      </div>

      <div
        v-if="useListView || useImageView || useAlternativeTableView"
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
            color="blue"
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
            color="blue"
          ></v-radio>
          <v-radio
            v-if="useImageView"
            class="mb-2"
            value="image"
            :label="$t('buttons.imageView')"
            color="blue"
          ></v-radio>
          <v-radio
            v-if="useAlternativeTableView"
            class="mb-2"
            value="alternativeTable"
            :label="$t('references.alternativeTableView')"
            color="blue"
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
          color="blue"
          dense
          :items="paginateByOptionsTranslated"
          item-color="blue"
          label="Paginate by"
          hide-details
        />
      </div>

      <div>
        <v-pagination
          v-model="searchParameters.page"
          color="blue"
          circle
          prev-icon="fas fa-angle-left"
          next-icon="fas fa-angle-right"
          :length="Math.ceil(response.count / searchParameters.paginateBy)"
          :total-visible="5"
        />
      </div>
    </div>

    <!-- ALTERNATIVE TABLE CONTROLS -->
    <alternative-table-controls
      class="mt-3"
      v-if="isAlternativeTable && response.results.length > 0"
      :columns="Object.keys(response.results[0])"
      :alternativeTableControls="alternativeTableControls"
      v-on:set-default-controls="
        setDefaultAlternativeTableControlsFromResetButton
      "
    />

    <!-- DATA TABLE -->
    <v-card class="table-card my-1" :loading="isLoading">
      <v-card-title class="d-print-none">
        <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
        <span id="table-title">
          <span>{{ $t("main.found") }}</span>
          <span class="font-weight-bold">{{ ` ${response.count} ` }}</span>
          <span>{{ $t("main.records") }}</span>
        </span>
        <div class="flex-grow-1"></div>
        <v-text-field
          v-if="module === 'reference' && isTableView"
          v-model="filterTable"
          append-outer-icon="fas fa-search"
          label="Filter records"
          clear-icon="fas fa-times"
          clearable
          color="deep-orange"
        ></v-text-field>
      </v-card-title>

      <!-- LIST VIEW -->
      <list-view
        v-if="isListView && response.count > 0"
        :module="module"
        :data="response.results"
      />

      <!-- IMAGE VIEW -->
      <image-view
        v-if="isImageView && response.count > 0"
        :module="module"
        :data="response.results"
      />

      <router-view
        ref="table"
        :response="response"
        :filter="filterTable"
        :search-parameters="searchParameters"
        :is-library-active="isLibraryActive"
        :is-selection-series-active="isSelectionSeriesActive"
        :active-selection-series="activeSelectionSeries"
        v-if="
          (module === 'reference' ||
            'specimen' ||
            'collection' ||
            'taxon' ||
            'selectionSeries' ||
            'sample') &&
            isTableView
        "
        v-on:toggle-privacy-state="changeObjectsPrivacyState"
        v-on:add-reference-to-active-library="
          $emit('add-reference-to-active-library', $event)
        "
        v-on:add-item-to-selection-series="addItemToSelectionSeries"
        v-on:toggle-select-all="toggleSelectAll"
      />

      <!-- TABLE -->
      <div
        class="row"
        v-else-if="(isTableView || isAlternativeTable) && response.count > 0"
      >
        <div class="col">
          <div
            class="table-responsive mb-0"
            :class="{ 'fixed-table': isAlternativeTable }"
          >
            <table
              id="export-table"
              class="table table-hover table-bordered b-table-fixed"
            >
              <thead
                class="thead-light"
                :class="{ 'sticky-header': isAlternativeTable }"
              >
                <tr class="th-sort">
                  <!-- MULTI ORDERING -->
                  <th
                    class="nowrap"
                    v-if="multiOrdering === true && isTableView"
                    v-for="item in activeColumns"
                  >
                    <span
                      @click="changeOrderMulti(item.id)"
                      v-on:dblclick="removeOrder(item.id)"
                      v-if="item.orderBy !== false"
                    >
                      <i
                        class="fas fa-sort"
                        v-if="isFieldInOrderBy(item.id) === 0"
                      ></i>
                      <i
                        class="fas fa-sort-up"
                        v-if="isFieldInOrderBy(item.id) === 1"
                      ></i>
                      <i
                        class="fas fa-sort-down"
                        v-if="isFieldInOrderBy(item.id) === -1"
                      ></i>
                      {{ $t(item.title) }}
                      <i
                        class="far fa-calendar-alt"
                        v-if="item.isDate === true"
                      ></i>
                      <i v-if="item.isPrivate" class="fas fa-lock"></i>
                      <i
                        v-else-if="item.isEstonianAuthor"
                        class="fas fa-user"
                      ></i>
                      <!--                    <i v-else-if="item.isEstonianReference" class="fas fa-book"></i>-->
                    </span>
                    <span v-if="item.orderBy === false && item.showHeader">{{
                      $t(item.title)
                    }}</span>
                    <br />
                  </th>

                  <!-- REGULAR ORDERING -->
                  <th
                    class="nowrap"
                    v-if="multiOrdering === false && isTableView"
                    v-for="item in activeColumns"
                  >
                    <span
                      @click="changeOrder(item.id)"
                      v-if="item.orderBy !== false"
                    >
                      <i
                        class="fas fa-sort"
                        v-if="
                          searchParameters.orderBy !== item.id &&
                            searchParameters.orderBy !== '-' + item.id
                        "
                      ></i>
                      <i
                        class="fas"
                        :class="
                          searchParameters.orderBy.includes('-')
                            ? 'fa-sort-down'
                            : 'fa-sort-up'
                        "
                        v-else
                      ></i>
                      {{ $t(item.title) }}
                      <i
                        class="far fa-calendar-alt"
                        v-if="item.isDate === true"
                      ></i>
                      <i v-if="item.isPrivate" class="fas fa-lock"></i>
                      <i
                        v-else-if="item.isEstonianAuthor"
                        class="fas fa-user"
                      ></i>
                      <!--                    <i v-else-if="item.isEstonianReference" class="fas fa-book"></i>-->
                    </span>
                    <span v-if="item.orderBy === false && item.showHeader">{{
                      $t(item.title)
                    }}</span>
                    <br />
                  </th>

                  <!-- ALTERNATIVE TABLE TH START -->
                  <!-- MULTI ORDERING for alternativeTable -->
                  <th
                    class="break-all-words"
                    :style="
                      'font-size:' + alternativeTableControls.size + 'px;'
                    "
                    v-if="
                      multiOrdering === true &&
                        isAlternativeTable &&
                        alternativeTableControls.fields.includes(key)
                    "
                    v-for="(value, key) in response.results[0]"
                    :key="key"
                  >
                    <span
                      @click="changeOrderMulti(key)"
                      v-on:dblclick="removeOrder(key)"
                    >
                      <i
                        class="fas fa-sort"
                        v-if="isFieldInOrderBy(item.id) === 0"
                      ></i>
                      <i
                        class="fas fa-sort-up"
                        v-if="isFieldInOrderBy(item.id) === 1"
                      ></i>
                      <i
                        class="fas fa-sort-down"
                        v-if="isFieldInOrderBy(item.id) === -1"
                      ></i>
                      {{ key }}
                    </span>
                    <br />
                  </th>

                  <!-- REGULAR ORDERING for alternativeTable -->
                  <th
                    class="break-all-words"
                    :style="
                      'font-size:' + alternativeTableControls.size + 'px;'
                    "
                    v-if="
                      multiOrdering === false &&
                        isAlternativeTable &&
                        alternativeTableControls.fields.includes(key)
                    "
                    v-for="(value, key) in response.results[0]"
                    :key="key"
                  >
                    <span @click="changeOrder(key)">
                      <i
                        class="fas fa-sort"
                        v-if="
                          searchParameters.orderBy !== item.id &&
                            searchParameters.orderBy !== '-' + item.id
                        "
                      ></i>
                      <i
                        class="fas"
                        :class="
                          searchParameters.orderBy.includes('-')
                            ? 'fa-sort-down'
                            : 'fa-sort-up'
                        "
                        v-else
                      ></i>
                      {{ key }} </span
                    ><br />
                  </th>
                  <!-- ALTERNATIVE TABLE TH END -->
                </tr>

                <tr>
                  <th class="p-0" v-for="item in columns" v-if="showFilters">
                    <b-form-input
                      autocomplete="off"
                      style="display: inline !important;max-width: 100%; "
                      class="col-sm-8"
                      v-model="searchParameters[item.id]"
                      :id="item.id"
                      :type="item.type"
                      v-if="item.type === 'text'"
                    ></b-form-input>
                    <b-form-input
                      autocomplete="off"
                      style="display: inline !important;max-width: 100%; "
                      class="col-sm-8"
                      v-model="searchParameters[item.id]"
                      :id="item.id"
                      :type="item.type"
                      v-if="item.type === 'number'"
                      min="0"
                    ></b-form-input>
                  </th>
                </tr>
              </thead>

              <router-view
                :response="response"
                :is-library-active="isLibraryActive"
                v-if="response.count > 0 && isTableView"
                v-on:toggle-privacy-state="changeObjectsPrivacyState"
              />

              <!-- ALTERNATIVE TABLE VIEW -->
              <alternative-table-view
                v-if="isAlternativeTable"
                module="reference"
                :data="response.results"
                :controls="alternativeTableControls"
              />
            </table>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import ExportButtons from "../components/partial/export/ExportButtons";
import ListView from "../components/partial/ListView";
import AlternativeTableView from "../components/reference/AlternativeTableView";
import AlternativeTableControls from "../components/reference/AlternativeTableControls";
import {
  fetchAddItemToSelection,
  fetchChangePrivacyState
} from "../assets/js/api/apiCalls";
import { toastError, toastSuccess } from "../assets/js/iziToast/iziToast";
import debounce from "lodash/debounce";
import ImageView from "../components/partial/ImageView";

export default {
  components: {
    AlternativeTableControls,
    AlternativeTableView,
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

    useAlternativeTableView: {
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
      currentView: "table",
      alternativeTableControls: this.setDefaultAlternativeTableControls()
    };
  },

  metaInfo() {
    return {
      title: this.$t(this.title)
    };
  },

  computed: {
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

    isAlternativeTable() {
      return this.currentView === "alternativeTable";
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

    changeOrder(orderValue) {
      if (this.searchParameters.orderBy === orderValue) {
        if (orderValue.charAt(0) !== "-") {
          orderValue = "-" + orderValue;
        } else {
          orderValue = orderValue.substring(1);
        }
      }
      let searchParametes = this.searchParameters;
      searchParametes.page = 1;
      searchParametes.orderBy = orderValue;
      this.$emit("search-params-changed", searchParametes);
    },

    /* MULTI ORDERING CODE START */

    changeOrderMulti(field) {
      let searchParametes = this.searchParameters;

      // Change string to array
      if (typeof searchParametes.orderBy === "string")
        searchParametes.orderBy = searchParametes.orderBy.split();

      if (searchParametes.orderBy.includes(field)) {
        // Ascending
        this.$set(
          searchParametes.orderBy,
          searchParametes.orderBy.indexOf(field),
          "-" + field
        );
      } else if (searchParametes.orderBy.includes("-" + field)) {
        // Descending
        this.$set(
          searchParametes.orderBy,
          searchParametes.orderBy.indexOf("-" + field),
          field
        );
      } else {
        if (searchParametes.orderBy.length > 1) {
          // Removes first and adds field
          searchParametes.orderBy.shift();
          searchParametes.orderBy.push(field);
        } else {
          // Just adds field
          searchParametes.orderBy.push(field);
        }
      }

      // Move it up if it starts to trigger multiple requests
      searchParametes.page = 1;
      this.$emit("search-params-changed", searchParametes);
    },

    // Returns 1 for ascending, -1 for descending and 0 if not in orderBy
    isFieldInOrderBy(field) {
      let searchParametes = this.searchParameters;

      // Change string to array
      if (typeof searchParametes.orderBy === "string")
        searchParametes.orderBy = searchParametes.orderBy.split();

      for (const i in searchParametes.orderBy) {
        if (searchParametes.orderBy[i] === field) {
          return 1;
        }
        if (searchParametes.orderBy[i] === "-" + field) {
          return -1;
        }
      }
      return 0;
    },

    removeOrder(field) {
      let searchParametes = this.searchParameters;

      // Change string to array (this should already be array, but just in case)
      if (typeof searchParametes.orderBy === "string")
        searchParametes.orderBy = searchParametes.orderBy.split();

      // Removing is not possible if there is only 1 field
      if (searchParametes.orderBy.length > 1) {
        if (searchParametes.orderBy.includes(field)) {
          searchParametes.orderBy.splice(
            searchParametes.orderBy.indexOf(field),
            1
          );
          this.$emit("search-params-changed", searchParametes);
        } else if (searchParametes.orderBy.includes("-" + field)) {
          searchParametes.orderBy.splice(
            searchParametes.orderBy.indexOf("-" + field),
            1
          );
          this.$emit("search-params-changed", searchParametes);
        }
      }
    },

    /* MULTI ORDERING CODE END */

    setDefaultAlternativeTableControls() {
      return {
        height: "4",
        width: "8",
        size: "14",
        fields:
          this.response &&
          this.response.results &&
          this.response.results.length > 0
            ? Object.keys(this.response.results[0])
            : []
      };
    },

    setDefaultAlternativeTableControlsFromResetButton() {
      this.alternativeTableControls = this.setDefaultAlternativeTableControls();
    },

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
.badge-style > span {
  padding-left: 0.4em;
  padding-right: 0.4em;
}

.font-larger {
  font-size: larger;
}

.nowrap {
  white-space: nowrap;
}

.break-all-words {
  word-break: break-all;
}

.th-sort > th > span {
  cursor: pointer;
}

.th-sort > th > span:hover {
  color: #000;
}

.fa-sort-up,
.fa-sort-down {
  color: #007bff;
}

/* Fixes table so scrolling happens inside table */
.fixed-table {
  max-height: 65vh;
}

/* Sticky header for responsive table */
.sticky-header th {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  outline: 1px solid #dee2e6;
  outline-offset: -1px;
  box-shadow: 0 2px 0 #cfd5db;
}

.radio-buttons >>> .form-group {
  margin-bottom: unset;
}

.radio-buttons >>> .v-label {
  margin-bottom: 0;
}
</style>
