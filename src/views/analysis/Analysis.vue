<template>
  <div class="analysis">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("common.generalInfo") }}</span>
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
                :items="autocomplete.analysis_method"
                :loading="autocomplete.loaders.analysis_method"
                :item-text="analysisMethodLabel"
                :label="$t('analysis.method')"
                use-state
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
                :label="$t('common.date')"
                v-on:date:clear="analysis.date = null"
                v-on:date:update="updateUserInputtedDate('date', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="analysis.date_end"
                :color="bodyActiveColor"
                :label="$t('analysis.date_end')"
                v-on:date:clear="analysis.date_end = null"
                v-on:date:update="updateUserInputtedDate('date_end', $event)"
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
                :items="autocomplete.lab"
                :loading="autocomplete.loaders.lab"
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
                :items="autocomplete.lab_instrument"
                :loading="autocomplete.loaders.lab_instrument"
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
                :label="$t('common.owner')"
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
          <span>{{ $t("common.remarks") }}</span>
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
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS  -->
    <v-card
      v-if="$route.meta.isEdit"
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
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <analysis-results-table
            v-show="activeTab === 'analysis_results'"
            :response="relatedData.analysis_results"
            :search-parameters="relatedData.searchParameters.analysis_results"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachment_link'">
            <file-input
              show-existing
              :record-options="$route.meta.isEdit"
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />
          </div>

          <!-- PAGINATION -->
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            v-on:update:page="
              relatedData.searchParameters[activeTab].page = $event
            "
            v-on:update:paginateBy="
              relatedData.searchParameters[activeTab].paginateBy = $event
            "
          />
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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { mapActions } from "vuex";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import DateWrapper from "@/components/partial/inputs/DateWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import AnalysisResultsTable from "@/components/analysis/relatedTables/AnalysisResultsTable";
import requestsMixin from "@/mixins/requestsMixin";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  components: {
    Pagination,
    AnalysisResultsTable,
    FileInput,
    CheckboxWrapper,
    DateWrapper,
    AutocompleteWrapper,
    InputWrapper,
    TextareaWrapper,
  },

  props: {
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  name: "Analysis",

  data() {
    return this.setInitialData();
  },

  created() {
    // Getting sample (only from sample view when user presses 'add analysis button')
    if (this?.$route?.params?.sample) {
      this.analysis.sample = this.$route.params.sample;
    }

    this.loadFullInfo();
  },

  watch: {
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(this.activeTab);
      },
      deep: true,
    },
  },

  computed: {
    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "analysis_results", iconClass: "far fa-chart-bar" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
        ],
        activeTab: "analysis_results",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["lab", "lab_instrument", "analysis_method"],
        autocomplete: {
          loaders: {
            agent: false,
            owner: false,
            sample: false,
            specimen: false,
            storage: false,
            analysis_method: false,
            dataset: false,
            lab: false,
            lab_instrument: false,
            reference: false,
            attachment: false,
          },
          agent: [],
          owner: [],
          sample: [],
          specimen: [],
          storage: [],
          dataset: [],
          lab: [],
          lab_instrument: [],
          reference: [],
          analysis_method: [],
          attachment: [],
        },
        requiredFields: ["analysis_method"],
        analysis: {
          id: null,
          sample: null,
          specimen: null,
          analysis_method: null,
          mass: null,
          method_details: null,
          method_details_en: null,
          material: null,
          date: null,
          date_end: null,
          date_free: null,
          lab: null,
          lab_txt: null,
          lab_analysis_number: null,
          lab_sample_number: null,
          instrument: null,
          instrument_txt: null,
          agent: null,
          agent_txt: null,
          owner: null,
          dataset: null,
          reference: null,
          storage: null,
          location: null,
          remarks: null,
          is_private: null,
        },
        componentKey: 0,
        block: {
          info: true,
          labInfo: true,
          otherInfo: false,
          description: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        attachment_link: {
          count: 0,
          results: [],
        },
        analysis_results: {
          count: 0,
          results: [],
        },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 10,
            orderBy: "id",
          },
          analysis_results: {
            page: 1,
            paginateBy: 10,
            sortBy: ["name"],
            sortDesc: [true],
          },
        },
      };
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "analysis", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },
  },
};
</script>
