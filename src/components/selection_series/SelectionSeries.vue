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
              :headers="[{ text: 'ID', value: tab.name, align: 'center' }]"
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
                v-model="new_specimen_storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
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
                    :disabled="!new_specimen_storage"
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
                          .map((item) => item.specimen)
                          .join(", ")
                      }}, ...
                    </div>

                    <div v-else class="font-weight-bold">
                      {{
                        relatedData.specimen.results
                          .map((item) => item.specimen)
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

    <!-- EMPTY SELECTION BUTTON -->
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

    <!-- SELECTION CONTENT PERMISSIONS -->
    <v-card
      v-if="$route.meta.isEdit"
      class="mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <span>{{ $t("selectionSeries.content_permission") }}</span>
        <v-icon right>fas fa-cogs</v-icon>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.contentPermission = !block.contentPermission"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.contentPermission ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.contentPermission" class="pa-1">
          <v-row no-gutters>
            <!-- EDIT -->
            <v-col cols="12" md="6" class="pa-1">
              <v-card
                flat
                :color="bodyColor.split('n-')[0] + 'n-5'"
                hover
                class="pa-1"
              >
                <div class="pa-1 font-weight-bold">
                  <span>{{ $t("permissions.change_perms_title") }}</span>
                  <span
                    ><v-icon small right :color="bodyActiveColor"
                      >far fa-edit</v-icon
                    ></span
                  >
                </div>

                <autocomplete-wrapper
                  v-model="object_permissions.change_group"
                  :color="bodyActiveColor"
                  :items="autocomplete.groups"
                  item-text="acronym"
                  :label="$t('permissions.group')"
                  :multiple="true"
                  v-on:chip:close="
                    object_permissions.change_group.splice(
                      object_permissions.change_group.findIndex(
                        (item) => item.id === $event.id
                      ),
                      1
                    )
                  "
                  :menu-props="{ maxHeight: 208 }"
                />
              </v-card>
            </v-col>

            <!-- VIEW -->
            <v-col cols="12" md="6" class="pa-1">
              <v-card
                :color="bodyColor.split('n-')[0] + 'n-5'"
                flat
                hover
                class="pa-1"
              >
                <div class="pa-1 font-weight-bold">
                  <span>{{ $t("permissions.view_perms_title") }}</span>
                  <span
                    ><v-icon small right :color="bodyActiveColor"
                      >fas fa-eye</v-icon
                    ></span
                  >
                </div>

                <autocomplete-wrapper
                  v-model="object_permissions.view_group"
                  :color="bodyActiveColor"
                  :items="autocomplete.groups"
                  :loading="autocomplete.loaders.groups"
                  item-text="acronym"
                  :label="$t('permissions.group')"
                  :multiple="true"
                  v-on:chip:close="
                    object_permissions.view_group.splice(
                      object_permissions.view_group.findIndex(
                        (item) => item.id === $event.id
                      ),
                      1
                    )
                  "
                  :menu-props="{ maxHeight: 208 }"
                />
              </v-card>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <div class="v-messages theme--light mb-1">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">
                    {{ $t("permissions.update_content_message") }}
                  </div>
                </div>
              </div>

              <v-btn
                :color="bodyActiveColor"
                dark
                :title="$t('permissions.update')"
                @click="updateContentPermissions"
              >
                {{ $t("permissions.update_content") }}
                <v-icon small right>fas fa-users-cog</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <v-row no-gutters class="mt-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchDatabaseGroups,
  fetchMultiRemoveRecordFromSelection,
  fetchSelectedAnalyses,
  fetchSelectedAttachments,
  fetchSelectedLocalities,
  fetchSelectedReferences,
  fetchSelectedSamples,
  fetchSelectedSpecimens,
  fetchSelectedTaxa,
  fetchSelectionSerie,
  postRequest,
} from "@/assets/js/api/apiCalls";

import InputWrapper from "../partial/inputs/InputWrapper";
import requestsMixin from "../../mixins/requestsMixin";
import SelectionSeriesDataTable from "./relatedTables/SelectionSeriesDataTable";
import { mapActions, mapState } from "vuex";
import {
  fetchAllSelections,
  fetchMultiChangeSpecimen,
} from "@/assets/js/api/apiCalls";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import Pagination from "@/components/partial/Pagination";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";

export default {
  name: "SelectionSeries",

  components: {
    Pagination,
    AutocompleteWrapper,
    SelectionSeriesDataTable,
    InputWrapper,
    ObjectPermissionsCreate,
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
    formSectionsMixin,
    requestsMixin,
    autocompleteMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.selection_seriesSearchParameters,
        request: "FETCH_SELECTION_SERIES",
        title: "header.selectionSeries",
        object: "selection_series",
        field: "name",
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
      deep: true,
    },
    "relatedData.searchParameters": {
      handler: function () {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },

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
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },

    async clearSelection() {
      let allSelections = await fetchAllSelections(this.$route.params.id);

      if (
        allSelections &&
        allSelections.status === 200 &&
        allSelections?.data?.results
      ) {
        let listOfIds = allSelections.data.results.map((item) => item.id);

        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            delete: listOfIds,
          })
        );

        let multiRemoveResponse = await fetchMultiRemoveRecordFromSelection(
          formData
        ).then(
          (response) => response,
          (errResponse) => errResponse
        );

        if (multiRemoveResponse) {
          this.handleResponseMessages(
            multiRemoveResponse,
            multiRemoveResponse.status === 200,
            true
          );

          if (multiRemoveResponse.status === 200)
            this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
        }
      }

      this.clearSelectionModal = false;
    },

    async changeSpecimenStorage() {
      let specimenSelectionResponse = await fetchSelectedSpecimens(
        this.$route.params.id,
        {
          page: 1,
          paginateBy: 1000,
          sortBy: ["specimen"],
          sortDesc: [true],
        }
      );

      if (
        specimenSelectionResponse &&
        specimenSelectionResponse?.data?.results
      ) {
        let updatedSpecimenObjects = specimenSelectionResponse.data.results.map(
          (specimen) => {
            return {
              id: specimen.specimen,
              storage: this.new_specimen_storage.id,
            };
          }
        );
        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            change: updatedSpecimenObjects,
          })
        );

        let multiChangeResponse = await fetchMultiChangeSpecimen(formData).then(
          (response) => response,
          (errResponse) => errResponse
        );

        if (multiChangeResponse) {
          this.handleResponseMessages(
            multiChangeResponse,
            multiChangeResponse.status === 200
          );

          if (multiChangeResponse.status === 200)
            this.loadRelatedData("specimen");
        }
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
          { name: "reference", iconClass: "fas fa-book" },
          { name: "taxon", iconClass: "fas fa-pastafarianism" },
          { name: "analysis", iconClass: "fas fa-chart-bar" },
        ],
        activeTab: "specimen",
        relatedData: this.setDefaultRelatedData(),
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        copyFields: ["id", "name", "remarks"],
        requiredFields: ["name"],
        selection_series: {},
        new_specimen_storage: null,
        autocomplete: {
          loaders: {
            storage: false,
          },
          storage: [],
          groups: [],
        },
        clearSelectionModal: false,
        changeStorageDialog: false,
        block: {
          info: true,
          storage: true,
          contentPermission: false,
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
        object_permissions: {
          view_group: [],
          change_group: [],
        },
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
        this.$emit("set-object", "selection_series");
        fetchSelectionSerie(this.$route.params.id).then((response) => {
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
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
        this.getDatabaseGroups();
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    formatDataForUpload(objectToUpload) {
      if (!this.$route.meta.isEdit) {
        objectToUpload.initial_permissions = this.initialPermissions;
      }
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
            sortDesc: [true],
          },
          sample: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sample"],
            sortDesc: [true],
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["attachment"],
            sortDesc: [true],
          },
          locality: {
            page: 1,
            paginateBy: 10,
            sortBy: ["locality"],
            sortDesc: [true],
          },
          reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["reference"],
            sortDesc: [true],
          },
          taxon: {
            page: 1,
            paginateBy: 10,
            sortBy: ["taxon"],
            sortDesc: [true],
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["analysis"],
            sortDesc: [true],
          },
        },
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
      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },

    async getDatabaseGroups() {
      try {
        const res = await fetchDatabaseGroups();
        this.autocomplete.groups = res?.data?.results ?? [];
      } catch (e) {
        console.error("Failed to fetch database groups: ", e);
      }
    },

    async updateContentPermissions() {
      const groups_change = this.object_permissions.change_group.map(
        (item) => item.id
      );
      const groups_view = this.object_permissions.view_group.map(
        (item) => item.id
      );

      let url = `selection_series/${this.$route.params.id}/setcontentpermissions`;
      let formData = new FormData();
      formData.append("data", JSON.stringify({ groups_view, groups_change }));

      try {
        const res = await postRequest(url, formData);

        if (res.status !== 200) {
          this.toastError({ text: "Failed to add content permissions" });
          return;
        }

        this.toastSuccess({ text: "Content permissions added!" });
      } catch (e) {
        console.error("Failed to add content permissions: ", e);
        this.toastError({ text: "Failed to add content permissions" });
      }
    },
  },
};
</script>

<style scoped />
