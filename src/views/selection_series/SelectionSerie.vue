<template>
  <div class="selectionSeries">
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
              :headers="[
                {
                  text: 'Name',
                  value: tab.name,
                  align: 'center',
                },
              ]"
              :response="relatedData[tab.name]"
              :object="tab.name"
              :search-parameters="relatedData.searchParameters[tab.name]"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
            />
          </div>

          <!-- PAGINATION -->
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1 mt-2"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :items-per-page="
              relatedData.searchParameters[activeTab].itemsPerPage
            "
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- SPECIMEN STORAGE CHANGE -->
    <v-card
      v-if="$route.meta.isEdit && isSpecimenInSelection"
      class="mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <span>{{ $t("selectionSeries.specimen_storage_change") }}</span>
        <v-icon right>fas fa-warehouse</v-icon>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.storage = !block.storage"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.storage ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.storage" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="newSpecimenStorage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-link
                route-object="location"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1 text-center text-sm-right">
              <v-dialog
                v-model="changeStorageDialog"
                max-width="500"
                style="z-index: 50000"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    @click="changeStorageDialog = true"
                    :disabled="!newSpecimenStorage"
                    color="red"
                    class="white--text"
                    ><v-icon left small>fas fa-exclamation-triangle</v-icon
                    >{{ $t("selectionSeries.change_storage") }}
                    <v-icon right small
                      >fas fa-exclamation-triangle</v-icon
                    ></v-btn
                  >
                </template>
                <v-card>
                  <v-card-title class="headline">{{
                    $t("selectionSeries.change_storage")
                  }}</v-card-title>
                  <v-card-text
                    >{{ $t("selectionSeries.confirm_storage_change") }}
                    <div v-if="relatedData.specimen.results.length > 5">
                      {{
                        relatedData.specimen.results
                          .slice(0, 5)
                          .map((item) => item.specimen.id)
                          .join(", ")
                      }}, ...
                    </div>

                    <div v-else class="font-weight-bold">
                      {{
                        relatedData.specimen.results
                          .map((item) => item.specimen.id)
                          .join(", ")
                      }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      small
                      class="white--text"
                      @click="changeStorageDialog = false"
                      >{{ $t("buttons.cancel") }}</v-btn
                    >
                    <v-btn
                      small
                      color="red darken-1"
                      @click="changeSpecimenStorage"
                      class="white--text"
                    >
                      <v-icon left small>fas fa-exclamation-triangle</v-icon
                      >{{ $t("selectionSeries.change_storage_yes") }}
                      <v-icon right small
                        >fas fa-exclamation-triangle</v-icon
                      ></v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- EMPTY SELECTION -->
    <div
      v-if="$route.meta.isEdit && isRelatedDataFilled"
      class="d-flex flex-row flex-nowrap justify-end mt-2"
    >
      <v-dialog
        v-model="clearSelectionModal"
        max-width="320"
        style="z-index: 50000"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            @click="clearSelectionModal = true"
            small
            color="red"
            class="white--text"
            ><v-icon left small>fas fa-exclamation-triangle</v-icon>
            {{ $t("selectionSeries.clear") }}
            <v-icon right small>fas fa-exclamation-triangle</v-icon></v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline">{{
            $t("selectionSeries.clear")
          }}</v-card-title>
          <v-card-text>{{
            $t("selectionSeries.confirm_clearing")
          }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              small
              class="white--text"
              @click="clearSelectionModal = false"
              >{{ $t("buttons.cancel") }}</v-btn
            >
            <v-btn
              small
              color="red darken-1"
              @click="clearSelection"
              class="white--text"
            >
              <v-icon left small>fas fa-exclamation-triangle</v-icon
              >{{ $t("selectionSeries.clear_yes") }}
              <v-icon right small>fas fa-exclamation-triangle</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { fetchSelectedSpecimens } from "@/assets/js/api/apiCalls";

import InputWrapper from "@/components/partial/inputs/InputWrapper";
import SelectionSeriesDataTable from "@/components/selection_series/relatedTables/SelectionSeriesDataTable";
import { mapActions } from "vuex";
import { fetchMultiChangeSpecimen } from "@/assets/js/api/apiCalls";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "SelectionSeries",

  components: {
    Pagination,
    AutocompleteWrapper,
    SelectionSeriesDataTable,
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
    formSectionsMixin,
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

  computed: {
    isRelatedDataFilled() {
      let result = Object.keys(this.relatedData).find(
        (item) => this.relatedData[item]?.count > 0
      );
      return !!result;
    },

    isSpecimenInSelection() {
      return this.relatedData.specimen.count > 0;
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    async clearSelection() {
      const response = await this.$api.rw.get("selection", {
        defaultParams: {
          id: this.$route.params.id,
          fields: "id",
        },
        options: {
          limit: 10000,
        },
      });
      const listOfIds = response?.results ?? [];

      // Todo: Could make a dedicated endpoint in api for clearing whole selection
      if (listOfIds.length > 0)
        await this.$api.rw.deleteMulti("selection", listOfIds);

      this.loadRelatedData(
        this.relatedTabs.map((tab) => tab.name),
        this.$route.meta.object,
        this.selection_series.id
      );

      this.clearSelectionModal = false;
    },

    async changeSpecimenStorage() {
      const specimens = this.relatedData?.specimen?.results ?? [];

      if (specimens.length > 0) {
        const updatedSpecimenObjects = specimens.map((item) => {
          return { id: item.specimen.id, storage: this.newSpecimenStorage.id };
        });
        await this.$api.rw.putMulti("specimen", updatedSpecimenObjects);

        this.loadRelatedData(
          this.relatedTabs.map((tab) => tab.name),
          this.$route.meta.object,
          this.selection_series.id
        );
      }

      this.changeStorageDialog = false;
    },

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
          { name: "specimen", iconClass: "fas fa-fish" },
          { name: "sample", iconClass: "fas fa-vial" },
          { name: "attachment", iconClass: "fas fa-file" },
          { name: "locality", iconClass: "fas fa-map-marked-alt" },
          // { name: "reference", iconClass: "fas fa-book" },
          { name: "taxon", iconClass: "fas fa-pastafarianism" },
          { name: "analysis", iconClass: "fas fa-chart-bar" },
        ],
        activeTab: "specimen",
        relatedData: this.setDefaultRelatedData(),
        requiredFields: ["name"],
        selection_series: {
          id: null,
          name: null,
          remarks: null,
        },
        newSpecimenStorage: null,
        autocomplete: {
          loaders: {
            storage: false,
          },
          storage: [],
        },
        clearSelectionModal: false,
        changeStorageDialog: false,
        block: { info: true, storage: true },
      };
    },

    setDefaultRelatedData() {
      return {
        specimen: { count: 0, results: [] },
        sample: { count: 0, results: [] },
        attachment: { count: 0, results: [] },
        locality: { count: 0, results: [] },
        // reference: { count: 0, results: [] },
        taxon: { count: 0, results: [] },
        analysis: { count: 0, results: [] },
        searchParameters: {
          specimen: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["specimen"],
            sortDesc: [true],
          },
          sample: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["sample"],
            sortDesc: [true],
          },
          attachment: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["attachment"],
            sortDesc: [true],
          },
          locality: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["locality"],
            sortDesc: [true],
          },
          // reference: {
          //   page: 1,
          //   itemsPerPage: 100,
          //   sortBy: ["reference"],
          //   sortDesc: [true],
          // },
          taxon: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["taxon"],
            sortDesc: [true],
          },
          analysis: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["analysis"],
            sortDesc: [true],
          },
        },
      };
    },

    // Overrides loadRelatedData method in detailViewUtilsMixin.js
    loadRelatedData(tables, module, moduleId) {
      Promise.all(
        tables.map((table) =>
          this.$api.rw
            .get("selection", {
              defaultParams: {
                selection: moduleId,
                [`${table}__isnull`]: false,
              },
              options: {
                ...this.relatedData.searchParameters[table],
              },
            })
            .then((res) => {
              this.relatedData[table].count = res?.count ?? 0;
              this.relatedData[table].results = res?.results ?? [];
            })
            .catch((err) => {
              this.relatedData[table].count = 0;
              this.relatedData[table].results = [];
            })
        )
      );
    },
  },
};
</script>
