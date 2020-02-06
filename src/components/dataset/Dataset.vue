<template>
  <div class="dataset">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    />

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('dataset') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('dataset') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION and DESCRIPTION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.description"
                :color="bodyActiveColor"
                :label="$t('common.description')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.description_en"
                :color="bodyActiveColor"
                :label="$t('common.description_en')"
              />
            </v-col>
          </v-row>

          <!-- DATE, DATE_TXT, COPYRIGHT_AGENT and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <date-wrapper
                v-model="dataset.date"
                :color="bodyActiveColor"
                :label="$t('common.date')"
                v-on:date:clear="dataset.date = null"
                v-on:date:update="updateUserInputtedDate('date', $event)"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="dataset.date_txt"
                :color="bodyActiveColor"
                :label="$t('common.date_txt')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.copyright_agent"
                :color="bodyActiveColor"
                :items="autocomplete.copyright_agent"
                :loading="autocomplete.loaders.copyright_agent"
                item-text="agent"
                :label="$t('common.copyright_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteCopyrightAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.licence"
                :color="bodyActiveColor"
                :items="autocomplete.licence"
                :loading="autocomplete.loaders.licence"
                :item-text="licenceLabel"
                :label="$t('common.licence')"
              />
            </v-col>
          </v-row>

          <!-- DATASET_HTML and REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.dataset_html"
                :color="bodyActiveColor"
                :label="$t('dataset.dataset_html')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- OWNER and OWNER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.owner"
                :color="bodyActiveColor"
                :items="autocomplete.owner"
                :loading="autocomplete.loaders.owner"
                item-text="agent"
                :label="$t('common.owner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteOwner2Search"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.owner_txt"
                :color="bodyActiveColor"
                :label="$t('common.owner_txt')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
      class="related-tabs mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('n-')[0] + 'n-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
        hide-slider
      >
        <v-tab
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("dataset.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <dataset-author-table
            v-show="activeTab === 'dataset_author'"
            :response="relatedData.dataset_author"
            :search-parameters="relatedData.searchParameters.dataset_author"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <dataset-reference-table
            v-show="activeTab === 'dataset_reference'"
            :response="relatedData.dataset_reference"
            :search-parameters="relatedData.searchParameters.dataset_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <dataset-analysis-table
            v-show="activeTab === 'dataset_analysis'"
            :response="relatedData.dataset_analysis"
            :search-parameters="relatedData.searchParameters.dataset_analysis"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters[activeTab].page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData[activeTab].count /
                      relatedData.searchParameters[activeTab].paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="dataset.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="dataset.is_private = !dataset.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import Spinner from "vue-simple-spinner";
import { mapState } from "vuex";
import {
  fetchDataset, fetchDatasetAnalyses,
  fetchDatasetAuthors,
  fetchDatasetReferences,
  fetchListLicences
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import DatasetAuthorTable from "./relatedTables/DatasetAuthorTable";
import DatasetReferenceTable from "./relatedTables/DatasetReferenceTable";
import requestsMixin from "../../mixins/requestsMixin";
import DatasetAnalysisTable from "./relatedTables/DatasetAnalysisTable";

export default {
  name: "Dataset",

  components: {
    DatasetAnalysisTable,
    DatasetReferenceTable,
    DatasetAuthorTable,
    CheckboxWrapper,
    AutocompleteWrapper,
    DateWrapper,
    TextareaWrapper,
    InputWrapper,
    Spinner
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      const searchHistory = this.$localStorage.get(
        this.searchHistory,
        "fallbackValue"
      );
      let params =
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "datasetSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DATASETS",
        title: "header.datasets",
        object: "dataset",
        field: "name",
        databaseId: this.databaseId,
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["databaseId"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "dataset_author", iconClass: "far fa-user" },
          { name: "dataset_reference", iconClass: "fas fa-book" },
          { name: "dataset_analysis", iconClass: "far fa-chart-bar" }
        ],
        searchHistory: "datasetSearchHistory",
        activeTab: "dataset_author",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "name",
          "name_en",
          "description",
          "description_en",
          "dataset_html",
          "date",
          "date_txt",
          "is_private",
          "owner",
          "owner_txt",
          "copyright_agent",
          "licence",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            copyright_agent: false,
            owner: false,
            agent: false,
            reference: false
          },
          copyright_agent: [],
          licence: [],
          owner: [],
          agent: [],
          reference: []
        },
        requiredFields: ["name", "name_en"],
        dataset: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ],
        dateState: false
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "dataset");
        fetchDataset(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "dataset", this.handleResponse(response)[0]);
            // this.dataset = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.dataset);

            this.removeUnnecessaryFields(this.dataset, this.copyFields);
            this.$emit("data-loaded", this.dataset);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields() {
      fetchListLicences().then(
        response => (this.autocomplete.licence = this.handleResponse(response))
      );
    },

    setDefaultRelatedData() {
      return {
        dataset_author: { count: 0, results: [] },
        dataset_reference: { count: 0, results: [] },
        dataset_analysis: { count: 0, results: [] },
        searchParameters: {
          dataset_author: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          dataset_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          dataset_analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["analysis"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach(key => {
        if (
          typeof uploadableObject[key] === "object" &&
          uploadableObject[key] !== null
        ) {
          uploadableObject[key] = uploadableObject[key].id
            ? uploadableObject[key].id
            : null;
        } else if (typeof uploadableObject[key] === "undefined") {
          uploadableObject[key] = null;
        }
      });

      if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ].results;
        });
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.copyright_agent)) {
        this.dataset.copyright_agent = {
          id: obj.copyright_agent,
          agent: obj.copyright_agent__agent
        };
        this.autocomplete.copyright_agent.push(this.dataset.copyright_agent);
      }
      this.dataset.licence = {
        id: obj.licence,
        licence: obj.licence__licence,
        licence_en: obj.licence__licence_en
      };
      if (this.isNotEmpty(obj.owner)) {
        this.dataset.owner = {
          id: obj.owner,
          agent: obj.owner__agent
        };
        this.autocomplete.owner.push(this.dataset.owner);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "dataset_author") {
        query = fetchDatasetAuthors(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_author
        );
      } else if (object === "dataset_reference") {
        query = fetchDatasetReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_reference
        );
      } else if (object === "dataset_analysis") {
        query = fetchDatasetAnalyses(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_analysis
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    setDefaultSearchParameters() {
      return {
        name: null,
        owner: null,
        date: null,
        remarks: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
