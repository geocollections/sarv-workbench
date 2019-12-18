<template>
  <div class="analysis">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("analysis.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- SAMPLE and SPECIMEN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.sample"
                :color="bodyActiveColor"
                :items="autocomplete.sample"
                :loading="autocomplete.loaders.sample"
                item-text="number"
                :label="$t('analysis.sample')"
                is-link
                route-object="sample"
                is-searchable
                v-on:search:items="autocompleteSampleSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.specimen"
                :color="bodyActiveColor"
                :items="autocomplete.specimen"
                :loading="autocomplete.loaders.specimen"
                item-text="specimen_id"
                :label="$t('analysis.specimen')"
                is-link
                route-object="specimen"
                is-searchable
                v-on:search:items="autocompleteSpecimenSearch"
              />
            </v-col>
          </v-row>

          <!-- ANALYSIS_METHOD and MASS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.analysis_method"
                :color="bodyActiveColor"
                :items="autocomplete.analysis_methods"
                :loading="autocomplete.loaders.analysis_methods"
                :item-text="analysisMethodLabel"
                :label="$t('analysis.method')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.mass"
                :color="bodyActiveColor"
                :label="$t('analysis.mass')"
                type="number"
                step="0.1"
              />
            </v-col>
          </v-row>

          <!-- MET.DETAILS and MET.ING.K -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.method_details"
                :color="bodyActiveColor"
                :label="$t('analysis.method_specification')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.method_details_en"
                :color="bodyActiveColor"
                :label="$t('analysis.method_in_eng')"
              />
            </v-col>
          </v-row>

          <!-- MATERIAL -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="analysis.material"
                :color="bodyActiveColor"
                :label="$t('analysis.material')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LAB INFO -->
    <v-card
      class="mt-2"
      id="block-labInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.labInfo = !block.labInfo"
        >
          <span>{{ $t("analysis.labInfo") }}</span>
          <v-icon right>fas fa-vials</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.labInfo = !block.labInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.labInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.labInfo" class="pa-1">
          <!-- DATE_START and DATE_END and DATE_FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="analysis.date"
                :color="bodyActiveColor"
                :label="$t('analysis.date')"
                v-on:date:clear="analysis.date = null"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="analysis.date_end"
                :color="bodyActiveColor"
                :label="$t('analysis.date_end')"
                v-on:date:clear="analysis.date_end = null"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="analysis.date_free"
                :color="bodyActiveColor"
                :label="$t('analysis.date_free')"
              />
            </v-col>
          </v-row>

          <!-- LABOR and LABOR TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.lab"
                :color="bodyActiveColor"
                :items="autocomplete.labs"
                :loading="autocomplete.loaders.labs"
                :item-text="labLabel"
                :label="$t('analysis.labor')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.lab_txt"
                :color="bodyActiveColor"
                :label="$t('analysis.labor_txt')"
              />
            </v-col>
          </v-row>

          <!-- LAB. SAMPLE and LAB.NUMBER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.lab_sample_number"
                :color="bodyActiveColor"
                :label="$t('analysis.labor_sample')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.lab_analysis_number"
                :color="bodyActiveColor"
                :label="$t('analysis.labor_number')"
              />
            </v-col>
          </v-row>

          <!-- ANALYSIS_METHOD and MASS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.instrument"
                :color="bodyActiveColor"
                :items="autocomplete.instruments"
                :loading="autocomplete.loaders.instruments"
                :item-text="instrumentLabel"
                :label="$t('analysis.tool')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.instrument_txt"
                :color="bodyActiveColor"
                :label="$t('analysis.tool_txt')"
              />
            </v-col>
          </v-row>

          <!-- ANALYZER and ANALYZER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('analysis.analyzer')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.agent_txt"
                :color="bodyActiveColor"
                :label="$t('analysis.analyzer_txt')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-otherInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.otherInfo = !block.otherInfo"
        >
          <span>{{ $t("analysis.otherInfo") }}</span>
          <v-icon right>fas fa-sitemap</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.otherInfo = !block.otherInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.otherInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.otherInfo" class="pa-1">
          <!-- DATASET and ANALYZER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.dataset"
                :color="bodyActiveColor"
                :items="autocomplete.dataset"
                :loading="autocomplete.loaders.dataset"
                :item-text="nameLabel"
                :label="$t('analysis.first_dataset')"
                is-link
                route-object="dataset"
                is-searchable
                v-on:search:items="autocompleteDatasetSearch"
              />
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('analysis.publication')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.owner"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.owner"
                item-text="agent"
                :label="$t('analysis.owner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteOwnerSearch"
              />
            </v-col>
          </v-row>

          <!-- STORAGE and LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis.location"
                :color="bodyActiveColor"
                :label="$t('analysis.location')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("analysis.remarks") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="analysis.remarks"
                :color="bodyActiveColor"
                :label="$t('analysis.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS  -->
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
          <span>{{ $t("analysis.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].length > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData[tab.name].length }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pa-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <analysis-results
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <div v-show="activeTab === 'attachment_link'">
            <file-upload
              show-existing
              :files-from-object="relatedData.attachment_link"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :is-draggable="$route.meta.isEdit"
            />
          </div>

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"
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
                    relatedData.count[activeTab] /
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
          v-model="analysis.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="analysis.is_private = !analysis.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchAnalysis,
  fetchLabs,
  fetchInstruments,
  fetchAnalysisAttachment,
  fetchAnalysisResults,
  fetchAnalysisMethod
} from "../../assets/js/api/apiCalls";
import AnalysisResults from "./relatedTables/AnalysisResults";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileUpload from "../partial/inputs/FileInput";

export default {
  components: {
    FileUpload,
    CheckboxWrapper,
    DateWrapper,
    AutocompleteWrapper,
    InputWrapper,
    TextareaWrapper,
    AnalysisResults,
    Spinner
  },

  props: {
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

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  name: "Analysis",

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
        searchHistory: "analysisSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_ANALYSES",
        title: "header.analyses",
        object: "analysis",
        field: "sample__number",
        block: this.block,
        agent: this.currentUser,
        databaseId: this.databaseId
      });
    }

    // Getting sample (only from sample view when user presses 'add analysis button')
    if (
      typeof this.$route.params.sample !== "undefined" &&
      this.$route.params.sample !== null
    ) {
      this.analysis.sample = this.$route.params.sample;
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
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
    ...mapState(["currentUser", "databaseId"]),

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
          { name: "analysis_results", iconClass: "far fa-chart-bar" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" }
        ],
        searchHistory: "analysisSearchHistory",
        activeTab: "analysis_results",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "sample",
          "specimen",
          "analysis_method",
          "mass",
          "method_details",
          "method_details_en",
          "material",
          "date",
          "date_end",
          "date_free",
          "lab",
          "lab_txt",
          "lab_analysis_number",
          "lab_sample_number",
          "instrument",
          "instrument_txt",
          "agent",
          "agent_txt",
          "owner",
          "dataset",
          "reference",
          "storage",
          "location",
          "remarks",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            owner: false,
            sample: false,
            specimen: false,
            storage: false,
            analysis_methods: false,
            dataset: false,
            labs: false,
            instruments: false,
            reference: false,
            attachment: false
          },
          agent: [],
          owner: [],
          sample: [],
          specimen: [],
          storage: [],
          dataset: [],
          labs: [],
          instruments: [],
          reference: [],
          analysis_methods: [],
          attachment: []
        },
        requiredFields: [],
        analysis: {},
        searchParameters: this.setDefaultSearchParameters(),
        componentKey: 0,
        block: {
          info: true,
          labInfo: true,
          otherInfo: false,
          description: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
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
        this.$emit("set-object", "analysis");

        fetchAnalysis(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.analysis = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.analysis);

            this.removeUnnecessaryFields(this.analysis, this.copyFields);
            this.$emit("data-loaded", this.analysis);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("analysis_results");
    },

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
        fetchLabs().then(
          response => (this.autocomplete.labs = this.handleResponse(response))
        );
        fetchInstruments().then(
          response =>
            (this.autocomplete.instruments = this.handleResponse(response))
        );
        fetchAnalysisMethod().then(
          response =>
            (this.autocomplete.analysis_methods = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        attachment_link: [],
        analysis_results: [],
        new: {
          attachment: [],
          analysis_results: []
        },
        copyFields: {
          attachment_link: ["attachment", "remarks"],
          analysis_results: [
            "name",
            "value",
            "value_max",
            "value_min",
            "value_bin",
            "value_txt"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          analysis_results: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          attachment_link: 0,
          analysis_results: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        attachment_link: {},
        analysis_results: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // if (this.isNotEmpty(objectToUpload.date))
      //   uploadableObject.date = this.formatDateForUpload(objectToUpload.date);
      // if (this.isNotEmpty(objectToUpload.date_end))
      //   uploadableObject.date_end = this.formatDateForUpload(
      //     objectToUpload.date_end
      //   );

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.sample))
        uploadableObject.sample = objectToUpload.sample.id;
      else uploadableObject.sample = null;
      if (this.isNotEmpty(objectToUpload.analysis_method))
        uploadableObject.analysis_method = objectToUpload.analysis_method.id;
      else uploadableObject.analysis_method = null;
      if (this.isNotEmpty(objectToUpload.specimen))
        uploadableObject.specimen = objectToUpload.specimen.id;
      else uploadableObject.specimen = null;
      if (this.isNotEmpty(objectToUpload.lab))
        uploadableObject.lab = objectToUpload.lab.id;
      else uploadableObject.lab = null;
      if (this.isNotEmpty(objectToUpload.instrument))
        uploadableObject.instrument = objectToUpload.instrument.id;
      else uploadableObject.instrument = null;
      if (this.isNotEmpty(objectToUpload.agent))
        uploadableObject.agent = objectToUpload.agent.id;
      else uploadableObject.agent = null;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;
      else uploadableObject.owner = null;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;
      else uploadableObject.storage = null;
      if (this.isNotEmpty(objectToUpload.reference))
        uploadableObject.reference = objectToUpload.reference.id;
      else uploadableObject.reference = null;
      if (this.isNotEmpty(objectToUpload.dataset))
        uploadableObject.dataset = objectToUpload.dataset.id;
      else uploadableObject.dataset = null;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment = this.relatedData.attachment_link;
            } else {
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
                ];
            }
        });
      } else {
        uploadableObject.related_data = {};
        uploadableObject.related_data.attachment = this.relatedData.attachment_link;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.sample)) {
        this.analysis.sample = { id: obj.sample, number: obj.sample__number };
        this.autocomplete.sample.push(this.analysis.sample);
      }
      if (this.isNotEmpty(obj.agent)) {
        this.analysis.agent = { id: obj.agent, agent: obj.agent__agent };
        this.autocomplete.agent.push(this.analysis.agent);
      }
      if (this.isNotEmpty(obj.owner)) {
        this.analysis.owner = { id: obj.owner, agent: obj.owner__agent };
        this.autocomplete.owner.push(this.analysis.owner);
      }
        this.analysis.analysis_method = {
          id: obj.analysis_method,
          analysis_method: obj.analysis_method__analysis_method,
          method_en: obj.analysis_method__method_en
        };
      if (this.isNotEmpty(obj.dataset)) {
        this.analysis.dataset = {
          id: obj.dataset,
          name: obj.dataset__name,
          name_en: obj.dataset__name_en
        };
        this.autocomplete.dataset.push(this.analysis.dataset);
      }
      if (this.isNotEmpty(obj.specimen)) {
        this.analysis.specimen = {
          id: obj.specimen,
          specimen_id: obj.specimen__specimen_id
        };
        this.autocomplete.specimen.push(this.analysis.specimen);
      }
      if (this.isNotEmpty(obj.reference)) {
        this.analysis.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
        this.autocomplete.reference.push(this.analysis.reference);
      }
      if (this.isNotEmpty(obj.storage)) {
        this.analysis.storage = {
          location: obj.storage__location,
          id: obj.storage
        };
        this.autocomplete.storage.push(this.analysis.storage);
      }
      this.analysis.lab = {
        id: obj.lab,
        lab: obj.lab__lab,
        lab_en: obj.lab__lab_en
      };
      this.analysis.instrument = {
        id: obj.instrument,
        instrument: obj.instrument__instrument,
        instrument_en: obj.instrument__instrument_en
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.attachment))
        obj.attachment = {
          id: obj.attachment,
          original_filename: obj.attachment__original_filename
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.attachment)) {
        newObject.attachment = obj.attachment.id;
        newObject.attachment__original_filename =
          obj.attachment.original_filename;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "attachment_link") {
        query = fetchAnalysisAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (object === "analysis_results") {
        query = fetchAnalysisResults(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis_results
        );
      }

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.analysis = this.analysis.id;

      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        analysis_method: null,
        agentAndLab: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "analysis");
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link = files;
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
