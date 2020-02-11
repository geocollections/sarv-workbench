<template>
  <div class="selectionSeries">
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
      class="mt-3"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <span>{{ $t("common.generalInfo") }}</span>
        <v-icon right>fas fa-project-diagram</v-icon>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="selection_series.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="selection_series.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
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
          <span>{{ $t("selectionSeries.relatedTables." + tab.name) }}</span>
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
          <div v-for="tab in relatedTabs" :key="tab.name">
            <selection-series-data-table
              v-show="activeTab === tab.name"
              :headers="[{ text: 'ID', value: tab.name, align: 'center' }]"
              :response="relatedData[tab.name]"
              :object="tab.name"
              :search-parameters="relatedData.searchParameters[tab.name]"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
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
import formManipulation from "../../mixins/formManipulation";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchSelectedAnalyses,
  fetchSelectedAttachments,
  fetchSelectedLocalities,
  fetchSelectedReferences,
  fetchSelectedSamples,
  fetchSelectedSpecimens,
  fetchSelectedTaxa,
  fetchSelectionSerie
} from "../../assets/js/api/apiCalls";
import Spinner from "vue-simple-spinner";
import InputWrapper from "../partial/inputs/InputWrapper";
import requestsMixin from "../../mixins/requestsMixin";
import SelectionSeriesDataTable from "./relatedTables/SelectionSeriesDataTable";

export default {
  name: "SelectionSeries",

  components: { SelectionSeriesDataTable, InputWrapper, Spinner },

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

  mixins: [formManipulation, formSectionsMixin, requestsMixin],

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
        searchHistory: "selectionSeriesSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SELECTION_SERIES",
        title: "header.selectionSeries",
        object: "selection_series",
        field: "name",
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true
    }
  },

  computed: {
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
        searchHistory: "selectionSeriesSearchHistory",
        relatedTabs: [
          { name: "specimen", iconClass: "fas fa-fish" },
          { name: "sample", iconClass: "fas fa-vial" },
          { name: "attachment", iconClass: "fas fa-file" },
          { name: "locality", iconClass: "fas fa-map-marked-alt" },
          { name: "reference", iconClass: "fas fa-book" },
          { name: "taxon", iconClass: "fas fa-pastafarianism" },
          { name: "analysis", iconClass: "fas fa-chart-bar" }
        ],
        activeTab: "specimen",
        relatedData: this.setDefaultRelatedData(),
        copyFields: ["id", "name", "remarks"],
        requiredFields: ["name"],
        selection_series: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: { info: true },
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
        this.sendingData = true;
        this.$emit("set-object", "selection_series");
        fetchSelectionSerie(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(
              this,
              "selection_series",
              this.handleResponse(response)[0]
            );
            // this.selection_series = this.handleResponse(response)[0];

            this.removeUnnecessaryFields(
              this.selection_series,
              this.copyFields
            );
            this.$emit("data-loaded", this.selection_series);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    formatDataForUpload(objectToUpload) {
      console.log("This object is sent in string format:");
      console.log(objectToUpload);
      return JSON.stringify(objectToUpload);
    },

    setDefaultRelatedData() {
      return {
        specimen: { count: 0, results: [] },
        sample: { count: 0, results: [] },
        attachment: { count: 0, results: [] },
        locality: { count: 0, results: [] },
        reference: { count: 0, results: [] },
        taxon: { count: 0, results: [] },
        analysis: { count: 0, results: [] },
        searchParameters: {
          specimen: {
            page: 1,
            paginateBy: 10,
            sortBy: ["specimen"],
            sortDesc: [true]
          },
          sample: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sample"],
            sortDesc: [true]
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["attachment"],
            sortDesc: [true]
          },
          locality: {
            page: 1,
            paginateBy: 10,
            sortBy: ["locality"],
            sortDesc: [true]
          },
          reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["reference"],
            sortDesc: [true]
          },
          taxon: {
            page: 1,
            paginateBy: 10,
            sortBy: ["taxon"],
            sortDesc: [true]
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["analysis"],
            sortDesc: [true]
          }
        }
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "specimen") {
        query = fetchSelectedSpecimens(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen
        );
      } else if (object === "sample") {
        query = fetchSelectedSamples(
          this.$route.params.id,
          this.relatedData.searchParameters.sample
        );
      } else if (object === "attachment") {
        query = fetchSelectedAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment
        );
      } else if (object === "locality") {
        query = fetchSelectedLocalities(
          this.$route.params.id,
          this.relatedData.searchParameters.locality
        );
      } else if (object === "reference") {
        query = fetchSelectedReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.reference
        );
      } else if (object === "taxon") {
        query = fetchSelectedTaxa(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon
        );
      } else if (object === "analysis") {
        query = fetchSelectedAnalyses(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        name: null,
        remarks: null,
        user_added: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped />
