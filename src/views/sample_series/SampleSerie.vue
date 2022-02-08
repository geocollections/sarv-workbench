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
            v-show="activeTab === 'sample'"
            :response="relatedData.sample"
            :search-parameters="relatedData.searchParameters.sample"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem($event, 'series')"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachments'">
            <file-input
              show-existing
              :files-from-object="relatedData.attachment.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
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
  </div>
</template>

<script>
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";

import DateWrapper from "@/components/partial/inputs/DateWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import SampleSeriesSamplesTable from "@/components/sample_series/relatedTables/SampleSeriesSamplesTable";
import FileInput from "@/components/partial/inputs/FileInput";
import { mapActions, mapState } from "vuex";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "SampleSeries",

  components: {
    Pagination,
    FileInput,
    SampleSeriesSamplesTable,
    CheckboxWrapper,
    DateWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
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
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
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
          { name: "sample", iconClass: "fas fa-vial" },
          { name: "attachment", iconClass: "far fa-file" },
        ],
        activeTab: "sample",
        relatedData: this.setDefaultRelatedData(),
        autocomplete: {
          loaders: {
            stratigraphy_base: false,
            stratigraphy_top: false,
            agent_collected: false,
            locality: false,
            agent: false,
          },
          stratigraphy_base: [],
          stratigraphy_top: [],
          agent_collected: [],
          locality: [],
          owner: [],
        },
        sample_series: {
          id: null,
          name: null,
          sampling_purpose: null,
          sample_count: null,
          sample_numbers: null,
          number_prefix: null,
          number_start: null,
          zero_level: null,
          depth_top: null,
          depth_base: null,
          stratigraphy_base: null,
          stratigraphy_base_free: null,
          stratigraphy_top: null,
          stratigraphy_top_free: null,
          agent_collected: null,
          date_collected: null,
          date_collected_free: null,
          location: null,
          locality: null,
          locality_free: null,
          remarks: null,
          owner: null,
          is_private: null,
        },
        requiredFields: ["name"],
        block: {
          info: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        sample: { count: 0, results: [] },
        attachment: { count: 0, results: [] },
        searchParameters: {
          sample: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    // Overrides loadRelatedData method in detailViewUtilsMixin.js
    // loadRelatedData(tables, module, moduleId) {
    //   Promise.all(
    //     tables.map((table) =>
    //       this.$api.rw
    //         .get("selection", {
    //           defaultParams: {
    //             selection: moduleId,
    //             [`${table}__isnull`]: false,
    //           },
    //           options: {
    //             ...this.relatedData.searchParameters[table],
    //           },
    //         })
    //         .then((res) => {
    //           this.relatedData[table].count = res?.count ?? 0;
    //           this.relatedData[table].results = res?.results ?? [];
    //         })
    //         .catch((err) => {
    //           this.relatedData[table].count = 0;
    //           this.relatedData[table].results = [];
    //         })
    //     )
    //   );
    // },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, "sample_series", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachments.count = files.length;
      this.relatedData.attachment.results = files;
    },
  },
};
</script>

<style scoped></style>
