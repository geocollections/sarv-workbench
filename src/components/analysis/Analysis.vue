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
      :color="bodyColor.split('-')[0] + '-5'"
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- SAMPLE and SPECIMEN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`agent`"
                >{{ $t("analysis.sample") }}:</label
              >
              <vue-multiselect
                id="sample"
                v-model="analysis.sample"
                label="number"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.sample"
                :options="autocomplete.sample"
                @search-change="autocompleteSampleSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.number }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`specimen`"
                >{{ $t("analysis.specimen") }}:</label
              >
              <vue-multiselect
                v-model="analysis.specimen"
                id="specimen"
                label="specimen_id"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.specimen"
                :options="autocomplete.specimen"
                @search-change="autocompleteSpecimenSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.specimen_id }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- ANALYSIS_METHOD and MASS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`analysis_method`"
                >{{ $t("analysis.method") }}:</label
              >
              <vue-multiselect
                v-model="analysis.analysis_method"
                id="analysis_method"
                :options="autocomplete.analysis_methods"
                track-by="id"
                :label="analysisMethodLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[analysisMethodLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`mass`"
                >{{ $t("analysis.mass") }}:</label
              >
              <b-form-input
                size="sm"
                id="mass"
                v-model="analysis.mass"
                type="number"
                step="0.1"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- MET.DETAILS and MET.ING.K -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`method_specification`"
                >{{ $t("analysis.method_specification") }}:</label
              >
              <b-form-input
                size="sm"
                v-model="analysis.method_details"
                type="text"
              />
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`method_in_eng`"
                >{{ $t("analysis.method_in_eng") }}:</label
              >
              <b-form-input
                size="sm"
                v-model="analysis.method_details_en"
                type="text"
              />
            </v-col>
          </v-row>

          <!-- MATERIAL -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label class="p-0" :for="`material`"
                >{{ $t("analysis.material") }}:</label
              >
              <b-form-input size="sm" v-model="analysis.material" type="text" />
            </v-col>
          </v-row>

          <!-- DATE_START and DATE_END and DATE_FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_start`" class="p-0"
                >{{ $t("analysis.date") }}:</label
              >
              <datepicker
                id="date_start"
                v-model="analysis.date"
                use-utc="true "
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_end`" class="p-0"
                >{{ $t("analysis.date_end") }}:</label
              >
              <datepicker
                id="date_end"
                v-model="analysis.date_end"
                use-utc="true "
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_free`" class="p-0"
                >{{ $t("analysis.date_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="date_free"
                v-model="analysis.date_free"
                type="text"
                maxlength="10"
              />
            </v-col>
          </v-row>

          <!-- LABOR and LABOR TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`lab`"
                >{{ $t("analysis.labor") }}:</label
              >
              <vue-multiselect
                v-model="analysis.lab"
                id="lab"
                :options="autocomplete.labs"
                track-by="id"
                :label="labLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[labLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`labor_txt`"
                >{{ $t("analysis.labor_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="labor_txt"
                v-model="analysis.lab_txt"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- LAB. SAMPLE and LAB.NUMBER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`labor_sample`"
                >{{ $t("analysis.labor_sample") }}:</label
              >
              <b-form-input
                size="sm"
                v-model="analysis.lab_sample_number"
                type="text"
              />
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`labor_number`"
                >{{ $t("analysis.labor_number") }}:</label
              >
              <b-form-input
                size="sm"
                v-model="analysis.lab_analysis_number"
                type="text"
              />
            </v-col>
          </v-row>

          <!-- ANALYSIS_METHOD and MASS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`instrument`"
                >{{ $t("analysis.tool") }}:</label
              >
              <vue-multiselect
                v-model="analysis.instrument"
                id="instrument"
                :options="autocomplete.instruments"
                track-by="id"
                :label="instrumentLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[instrumentLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`instrument_txt`"
                >{{ $t("analysis.tool_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="tool_txt"
                v-model="analysis.instrument_txt"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- ANALYZER and ANALYZER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`analyzer`"
                >{{ $t("analysis.analyzer") }}:</label
              >
              <vue-multiselect
                id="agent"
                v-model="analysis.agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`agent_txt`"
                >{{ $t("analysis.analyzer_txt") }}:</label
              >
              <b-form-input
                size="sm"
                id="analyzer_txt"
                v-model="analysis.agent_txt"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- DATASET and ANALYZER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label class="p-0" :for="`dataset`"
                >{{ $t("analysis.first_dataset") }}:</label
              >
              <vue-multiselect
                v-model="analysis.dataset"
                id="dataset"
                :label="nameLabel"
                track-by="id"
                placeholder="dataset search..."
                :loading="autocomplete.loaders.dataset"
                :options="autocomplete.dataset"
                @search-change="autocompleteDatasetSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
            <v-col cols="12" md="4" class="px-1">
              <label class="p-0" :for="`reference`"
                >{{ $t("analysis.publication") }}:</label
              >
              <vue-multiselect
                v-model="analysis.reference"
                id="reference"
                label="reference"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.reference"
                :options="autocomplete.reference"
                @search-change="autocompleteReferenceSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
            <v-col cols="12" md="4" class="px-1">
              <label class="p-0" :for="`owner`"
                >{{ $t("analysis.owner") }}:</label
              >
              <vue-multiselect
                id="owner"
                v-model="analysis.owner"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.owner"
                :options="autocomplete.agent"
                @search-change="autocompleteOwnerSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- STORAGE and LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`labor_sample`"
                >{{ $t("analysis.storage") }}:</label
              >
              <vue-multiselect
                v-model="analysis.storage"
                id="storage"
                label="location"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.storage"
                :options="autocomplete.storage"
                @search-change="autocompleteStorageSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label class="p-0" :for="`labor_number`"
                >{{ $t("analysis.location") }}:</label
              >
              <b-form-input size="sm" v-model="analysis.location" type="text" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('-')[0] + '-5'"
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label class="mt-0" :for="`remarks`"
                >{{ $t("analysis.remarks") }}:</label
              >
              <b-form-textarea
                id="remarks"
                v-model="analysis.remarks"
                type="text"
                :rows="1"
                :max-rows="20"
              ></b-form-textarea>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS  -->
    <v-card
      class="related-tabs mt-2"
      :color="bodyColor.split('-')[0] + '-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('-')[0] + '-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('-')[0] + '-5 black--text'"
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
        <v-card class="pt-3 px-1" flat :color="bodyColor.split('-')[0] + '-5'">
          <analysis-results
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <analysis-files
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

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
        <v-checkbox
          v-model="analysis.is_private"
          id="is_private"
          :label="$t('analysis.is_private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Datepicker from "vue2-datepicker";
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
import AnalysisFiles from "./relatedTables/AnalysisFiles";
import AnalysisResults from "./relatedTables/AnalysisResults";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";

export default {
  components: {
    AnalysisResults,
    AnalysisFiles,
    Datepicker,
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
        block: { info: true, description: true },
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

      if (this.isNotEmpty(objectToUpload.date))
        uploadableObject.date = this.formatDateForUpload(objectToUpload.date);
      if (this.isNotEmpty(objectToUpload.date_end))
        uploadableObject.date_end = this.formatDateForUpload(
          objectToUpload.date_end
        );

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.sample))
        uploadableObject.sample = objectToUpload.sample.id;
      if (this.isNotEmpty(objectToUpload.analysis_method))
        uploadableObject.analysis_method = objectToUpload.analysis_method.id;
      if (this.isNotEmpty(objectToUpload.specimen))
        uploadableObject.specimen = objectToUpload.specimen.id;
      if (this.isNotEmpty(objectToUpload.lab))
        uploadableObject.lab = objectToUpload.lab.id;
      if (this.isNotEmpty(objectToUpload.instrument))
        uploadableObject.instrument = objectToUpload.instrument.id;
      if (this.isNotEmpty(objectToUpload.agent))
        uploadableObject.agent = objectToUpload.agent.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;

      if (this.isNotEmpty(objectToUpload.reference))
        uploadableObject.reference = objectToUpload.reference.id;
      if (this.isNotEmpty(objectToUpload.dataset))
        uploadableObject.dataset = objectToUpload.dataset.id;

      if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ];
        });
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      console.log(obj);
      this.analysis.sample = { id: obj.sample, number: obj.sample__number };
      this.analysis.agent = { id: obj.agent, agent: obj.agent__agent };
      this.analysis.owner = { id: obj.owner, agent: obj.owner__agent };
      this.analysis.analysis_method = {
        id: obj.analysis_method,
        analysis_method: obj.analysis_method__analysis_method
      };
      this.analysis.dataset = {
        id: obj.dataset,
        name: obj.dataset__name,
        name_en: obj.dataset__name_en
      };
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
      this.analysis.specimen = {
        id: obj.specimen,
        specimen_id: obj.specimen__specimen_id
      };
      this.analysis.reference = {
        id: obj.reference,
        reference: obj.reference__reference
      };
      this.analysis.storage = {
        location: obj.storage__location,
        id: obj.storage
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
