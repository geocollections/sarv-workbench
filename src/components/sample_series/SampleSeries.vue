<template>
  <div class="sample_series">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span
            :class="validate('sample_series') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('sample_series') ? 'green--text' : 'red--text'"
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
          <!-- NAME and SAMPLING_PURPOSE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="sample_series.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="sample_series.sampling_purpose"
                :color="bodyActiveColor"
                :label="$t('sample_series.sampling_purpose')"
              />
            </v-col>
          </v-row>

          <!-- SAMPLE_COUNT, SAMPLE_NUMBERS, NUMBER_PREFIX and NUMBER_START -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.sample_count"
                :color="bodyActiveColor"
                :label="$t('sample_series.sample_count')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.sample_numbers"
                :color="bodyActiveColor"
                :label="$t('sample_series.sample_numbers')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.number_prefix"
                :color="bodyActiveColor"
                :label="$t('sample_series.number_prefix')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.number_start"
                :color="bodyActiveColor"
                :label="$t('sample_series.number_start')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_BASE, DEPTH_TOP and ZERO_LEVEL -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="sample_series.depth_base"
                :color="bodyActiveColor"
                :label="$t('sample_series.depth_base')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="sample_series.depth_top"
                :color="bodyActiveColor"
                :label="$t('sample_series.depth_top')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="sample_series.zero_level"
                :color="bodyActiveColor"
                :label="$t('sample_series.zero_level')"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_BASE, STRATIGRAPHY_BASE_FREE, STRATIGRAPHY_TOP and STRATIGRAPHY_TOP_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="sample_series.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('sample_series.stratigraphy_base')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.stratigraphy_base_free"
                :color="bodyActiveColor"
                :label="$t('sample_series.stratigraphy_base_free')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="sample_series.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('sample_series.stratigraphy_top')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.stratigraphy_top_free"
                :color="bodyActiveColor"
                :label="$t('sample_series.stratigraphy_top_free')"
              />
            </v-col>
          </v-row>

          <!-- AGENT_COLLECTED, DATE_COLLECTED, DATE_COLLECTED_FREE and LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="sample_series.agent_collected"
                :color="bodyActiveColor"
                :items="autocomplete.agent_collected"
                :loading="autocomplete.loaders.agent_collected"
                item-text="agent"
                :label="$t('sample_series.agent_collected')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentCollectedSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <date-wrapper
                v-model="sample_series.date_collected"
                :color="bodyActiveColor"
                :label="$t('sample_series.date_collected')"
                v-on:date:clear="sample_series.date_collected = null"
                v-on:date:update="
                  updateUserInputtedDate('date_collected', $event)
                "
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.date_collected_free"
                :color="bodyActiveColor"
                :label="$t('sample_series.date_collected_free')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="sample_series.location"
                :color="bodyActiveColor"
                :label="$t('sample_series.location')"
              />
            </v-col>
          </v-row>

          <!-- LOCALITY, LOCALITY_FREE and OWNER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="sample_series.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('common.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="sample_series.locality_free"
                :color="bodyActiveColor"
                :label="$t('sample_series.locality_free')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="sample_series.owner"
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
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="sample_series.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- IS_PRIVATE -->
          <v-row no-gutters class="my-2">
            <v-col>
              <checkbox-wrapper
                v-model="sample_series.is_private"
                :color="bodyActiveColor"
                :label="$t('common.is_private')"
                @change="sample_series.is_private = !sample_series.is_private"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
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
          <span>{{ $t("sample_series.relatedTables." + tab.name) }}</span>
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
          <sample-series-samples-table
            v-show="activeTab === 'samples'"
            :response="relatedData.samples"
            :search-parameters="relatedData.searchParameters.samples"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem($event, 'series')"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachments'">
            <file-input
              show-existing
              :files-from-object="relatedData.attachments.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />
          </div>

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
  </div>
</template>

<script>
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import {
  fetchSampleSeriesAttachments,
  fetchSampleSeriesDetail,
  fetchSampleSeriesSamples
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

import DateWrapper from "../partial/inputs/DateWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import requestsMixin from "../../mixins/requestsMixin";
import SampleSeriesSamplesTable from "./relatedTables/SampleSeriesSamplesTable";
import FileInput from "../partial/inputs/FileInput";
import { mapActions, mapState } from "vuex";

export default {
  name: "SampleSeries",

  components: {
    FileInput,
    SampleSeriesSamplesTable,
    CheckboxWrapper,
    DateWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper
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

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.sample_seriesSearchParameters,
        request: "FETCH_SAMPLE_SERIES",
        title: "header.sample_series",
        object: "sample_series",
        field: "name"
      });
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
    ...mapState("search", ["sample_seriesSearchParameters"]),

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
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "samples", iconClass: "fas fa-vial" },
          { name: "attachments", iconClass: "far fa-file" }
        ],
        activeTab: "samples",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "name",
          "sampling_purpose",
          "sample_count",
          "sample_numbers",
          "number_prefix",
          "number_start",
          "zero_level",
          "depth_top",
          "depth_base",
          "stratigraphy_base",
          "stratigraphy_base_free",
          "stratigraphy_top",
          "stratigraphy_top_free",
          "agent_collected",
          "date_collected",
          "date_collected_free",
          "location",
          "locality",
          "locality_free",
          "remarks",
          "owner",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            stratigraphy_base: false,
            stratigraphy_top: false,
            agent_collected: false,
            locality: false,
            agent: false
          },
          stratigraphy_base: [],
          stratigraphy_top: [],
          agent_collected: [],
          locality: [],
          owner: []
        },
        sample_series: {},
        requiredFields: ["name"],
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
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchSampleSeriesDetail(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "sample_series", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.sample_series);
            this.removeUnnecessaryFields(this.sample_series, this.copyFields);

            this.$emit("data-loaded", this.sample_series);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRelatedData() {
      return {
        samples: { count: 0, results: [] },
        attachments: { count: 0, results: [] },
        searchParameters: {
          samples: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          attachments: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
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

      // Adding related data only on add view
      uploadableObject.related_data = {};
      if (!this.$route.meta.isEdit) {
        this.relatedTabs.forEach(tab => {
          if (
            tab.name === "attachments" &&
            this.relatedData[tab.name].count > 0
          ) {
            uploadableObject.related_data.attachment = this.relatedData.attachments.results.map(
              item => {
                return { id: item.id };
              }
            );
          }
        });
      } else {
        if (this.relatedData.attachments.results.length > 0) {
          uploadableObject.related_data.attachment = this.relatedData.attachments.results.map(
            item => {
              return { id: item.id };
            }
          );
        } else uploadableObject.related_data.attachment = null;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        this.sample_series.stratigraphy_base = {
          id: obj.stratigraphy_base,
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en
        };
        this.autocomplete.stratigraphy_base.push(
          this.sample_series.stratigraphy_base
        );
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        this.sample_series.stratigraphy_top = {
          id: obj.stratigraphy_top,
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en
        };
        this.autocomplete.stratigraphy_top.push(
          this.sample_series.stratigraphy_top
        );
      }
      if (this.isNotEmpty(obj.agent_collected)) {
        this.sample_series.agent_collected = {
          id: obj.agent_collected,
          agent: obj.agent_collected__agent
        };
        this.autocomplete.agent_collected.push(
          this.sample_series.agent_collected
        );
      }
      if (this.isNotEmpty(obj.locality)) {
        this.sample_series.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
        this.autocomplete.locality.push(this.sample_series.locality);
      }
      if (this.isNotEmpty(obj.owner)) {
        this.sample_series.owner = { id: obj.owner, agent: obj.owner__agent };
        this.autocomplete.owner.push(this.sample_series.owner);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "samples") {
        query = fetchSampleSeriesSamples(
          this.$route.params.id,
          this.relatedData.searchParameters.samples
        );
      } else if (object === "attachments") {
        query = fetchSampleSeriesAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachments
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "sample_series", singleFileMetadata);
    },

    addExistingFiles(files) {
      this.relatedData.attachments.count = files.length;
      this.relatedData.attachments.results = files;
    }
  }
};
</script>

<style scoped></style>
