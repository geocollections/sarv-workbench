<template>
  <div class="area">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('area') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon right :class="validate('area') ? 'green--text' : 'red--text'"
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
          <!-- NAME, NAME_EN and AREA_TYPE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="area.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="area.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="area.area_type"
                :color="bodyActiveColor"
                :items="autocomplete.area_type"
                :loading="autocomplete.loaders.area_type"
                :item-text="nameLabel"
                :label="$t('common.type')"
              />
            </v-col>
          </v-row>

          <!-- EELIS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="area.eelis"
                :color="bodyActiveColor"
                :label="$t('area.eelis')"
              />
            </v-col>
          </v-row>

          <!-- EGF -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="area.egf"
                :color="bodyActiveColor"
                :label="$t('area.egf')"
              />
            </v-col>
          </v-row>

          <!-- MAARDLA, AREA_HA, DEPOSIT_AREA_HA and MAAKOND -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="area.maardla"
                :color="bodyActiveColor"
                :label="$t('area.maardla')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="area.area_ha"
                :color="bodyActiveColor"
                :label="$t('area.area_ha')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="area.deposit_area_ha"
                :color="bodyActiveColor"
                :label="$t('area.deposit_area_ha')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="area.maakond"
                :color="bodyActiveColor"
                :items="autocomplete.maakond"
                :loading="autocomplete.loaders.maakond"
                :item-text="maakondLabel"
                :label="$t('area.maakond')"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION and DESCRIPTION_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof area.description !== 'undefined'"
                v-model="area.description"
                :label="$t('common.description')"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof area.description_en !== 'undefined'"
                v-model="area.description_en"
                :label="$t('common.description_en')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="area.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- POLYGON -->
          <!--          <v-row no-gutters>-->
          <!--            <v-col cols="12" class="pa-1">-->
          <!--              <textarea-wrapper-->
          <!--                v-model="area.polygon"-->
          <!--                :color="bodyActiveColor"-->
          <!--                :label="$t('area.polygon')"-->
          <!--                readonly-->
          <!--              />-->
          <!--            </v-col>-->
          <!--          </v-row>-->
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
          <span>{{ $t("site.relatedTables." + tab.name) }}</span>
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
          <div v-if="activeTab === 'sites'">
            <!-- MAP SWITCH -->
            <v-card
              class="d-flex flex-row justify-start mt-1 mx-3"
              flat
              tile
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-card
                flat
                tile
                class="align-self-center mr-2"
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <v-switch
                  v-model="myShowMap"
                  hide-details
                  id="map-switch"
                  class="vuetify-switch my-1"
                ></v-switch>
              </v-card>

              <v-card
                flat
                tile
                class="align-self-center"
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <label class="m-0" :for="`map-switch`">
                  <i class="far fa-map"></i>
                  {{
                    myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled")
                  }}
                </label>
              </v-card>
            </v-card>

            <!-- MAP -->
            <v-row no-gutters v-show="myShowMap" class="mt-2">
              <v-col cols="12" class="px-1">
                <map-component
                  :show-map="myShowMap && block.sites"
                  :gps-coords="true"
                  mode="multiple"
                  module="area"
                  v-bind:location="{ lat: null, lng: null }"
                  :locations="relatedData.sites.results"
                />
              </v-col>
            </v-row>

            <!-- ADD NEW and EXPORT -->
            <v-card
              class="d-flex flex-row justify-start mt-2 mb-3"
              flat
              tile
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-card
                flat
                tile
                class="px-1"
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <v-btn
                  :to="{
                    name: 'Site add',
                    query: { area: JSON.stringify(area) },
                  }"
                  target="newAreaWindow"
                  :color="bodyActiveColor"
                  :dark="isBodyActiveColorDark"
                  >{{ $t("add.new") }}</v-btn
                >
              </v-card>

              <v-card
                flat
                tile
                class="px-1"
                :color="bodyColor.split('n-')[0] + 'n-5'"
              >
                <export-buttons
                  filename="site"
                  :table-data="relatedData.sites.results"
                ></export-buttons>
              </v-card>
            </v-card>

            <v-row no-gutters v-if="relatedData.sites.count > 0">
              <v-col cols="12" class="px-1">
                <site-table
                  ref="table"
                  :response="relatedData.sites"
                  :search-parameters="relatedData.searchParameters.sites"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                />
              </v-col>
            </v-row>
          </div>

          <area-locality-reference-table
            v-show="activeTab === 'locality_reference'"
            :response="relatedData.locality_reference"
            :search-parameters="relatedData.searchParameters.locality_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

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
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import {
  fetchArea,
  fetchAreaLocalityReferences,
  fetchLinkedAreaSites,
  fetchListAreaTypes,
  fetchListMaakond,
} from "../../assets/js/api/apiCalls";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import Editor from "../partial/inputs/Editor";
import MapComponent from "../partial/MapComponent";
import ExportButtons from "../partial/export/ExportButtons";
import debounce from "lodash/debounce";
import { mapActions, mapState } from "vuex";
import SiteTable from "../site/SiteTable";
import AreaLocalityReferenceTable from "./relatedTables/AreaLocalityReferenceTable";
import requestsMixin from "../../mixins/requestsMixin";
import Pagination from "@/components/partial/Pagination";
export default {
  name: "Area",

  components: {
    Pagination,
    AreaLocalityReferenceTable,
    SiteTable,
    ExportButtons,
    MapComponent,
    Editor,
    TextareaWrapper,
    InputWrapper,
    AutocompleteWrapper,
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

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.areaSearchParameters,
        request: "FETCH_AREAS",
        title: "header.areas",
        object: "area",
        field: "name",
      });
    }

    this.loadFullInfo();
  },

  computed: {
    ...mapState("map", ["showMap"]),
    ...mapState("search", ["areaSearchParameters"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },

    computedRelatedTabs() {
      return this.relatedTabs.filter((tab) => tab.name !== "sites");
    },
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        this.setInitialData();
        this.reloadData();
      },
      deep: true,
    },
    "relatedData.searchParameters.sites": {
      handler(newVal) {
        // if (this.$route.meta.isEdit) {
        //   this.searchRelatedData(newVal, this.fetchLinkedSiteWrapper, "sites");
        // }
      },
      immediate: true,
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

  methods: {
    ...mapActions("map", ["updateShowMap"]),
    ...mapActions("search", ["setActiveSearchParameters", "updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    fetchLinkedSiteWrapper() {
      return new Promise((resolve) => {
        resolve(
          fetchLinkedAreaSites(
            this.relatedData.searchParameters.sites,
            this.$route.params.id
          )
        );
      });
    },

    searchRelatedData: debounce(function (
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then((response) => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.data.count;
          this.relatedData[relatedObject].results = response.data.results;
        }
      });
    },
    50),

    setInitialData() {
      return {
        relatedTabs: [
          { name: "sites", iconClass: "fas fa-globe-americas" },
          { name: "locality_reference", iconClass: "fas fa-book" },
        ],
        activeTab: "sites",
        copyFields: [
          "id",
          "name",
          "name_en",
          "area_type",
          "maardla",
          "eelis",
          "egf",
          "area_ha",
          "deposit_area_ha",
          "maakond",
          "description",
          "description_en",
          "remarks",
          // "polygon"
        ],
        autocomplete: {
          loaders: {
            area_type: false,
            maakond: false,
          },
          language: [],
          area_type: [],
          maakond: [],
        },
        requiredFields: ["name"],
        area: {},
        block: {
          info: true,
          sites: true,
        },
        relatedData: this.setDefaultRalatedData(),
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      fetchListAreaTypes().then((response) => {
        this.autocomplete.area_type = this.handleResponse(response);
      });

      fetchListMaakond().then((response) => {
        this.autocomplete.maakond = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);

        fetchArea(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "area", this.handleResponse(response)[0]);
            // this.area = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.area);
            this.removeUnnecessaryFields(this.area, this.copyFields);

            this.$emit("data-loaded", this.area);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRalatedData() {
      return {
        sites: {
          count: 0,
          results: [],
        },
        locality_reference: {
          count: 0,
          results: [],
        },
        searchParameters: {
          sites: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
          locality_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["reference"],
            sortDesc: [true],
          },
        },
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach((key) => {
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
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach((tab) => {
          if (this.relatedData[tab.name].count > 0) {
            uploadableObject.related_data[tab.name] =
              this.relatedData[tab.name].results;

            uploadableObject.related_data[tab.name].forEach((item) => {
              Object.keys(item).forEach((key) => {
                if (typeof item[key] === "object" && item[key] !== null) {
                  item[key] = item[key].id ? item[key].id : null;
                }
              });
            });
          }
        });
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.area.area_type = {
        id: obj.area_type,
        name: obj.area_type__name,
        name_en: obj.area_type__name_en,
      };
      this.area.maakond = {
        id: obj.maakond,
        maakond: obj.maakond__maakond,
        maakond_en: obj.maakond__maakond_en,
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "sites") {
        query = fetchLinkedAreaSites(
          this.relatedData.searchParameters.sites,
          this.$route.params.id
        );
      } else if (object === "locality_reference") {
        query = fetchAreaLocalityReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_reference
        );
      }

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },
  },
};
</script>

<style scoped />
