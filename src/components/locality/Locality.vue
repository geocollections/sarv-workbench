<template>
  <div>
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
          <span :class="validate('locality') ? 'green--text' : 'red--text'">{{
            $t("locality.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('locality') ? 'green--text' : 'red--text'"
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
          <!-- LOCALITY and LOCALITY ENG -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.locality"
                :color="bodyActiveColor"
                :label="$t('locality.locality')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.locality_en"
                :color="bodyActiveColor"
                :label="$t('locality.locality_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- NUMBER, OTHER NUMBER, LOCALITY TYPE and LOCALITY BELONGS-->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="locality.number"
                :color="bodyActiveColor"
                :label="$t('locality.number')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="locality.code"
                :color="bodyActiveColor"
                :label="$t('locality.code')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.type"
                :color="bodyActiveColor"
                :items="autocomplete.localityTypes"
                :loading="autocomplete.loaders.localityTypes"
                :item-text="commonLabel"
                :label="$t('locality.type')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.parent"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('locality.parent')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- MAP -->
    <v-card
      class="mt-2"
      id="block-map"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.map = !block.map">
          <span>{{ $t("locality.map") }}</span>
          <v-icon right>fas fa-map</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.map = !block.map" :color="bodyActiveColor">
          <v-icon>{{
            block.map ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.map" class="pa-1">
          <!-- LATITUDE, LONGITUDE and ELEVATION -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.latitude"
                :color="bodyActiveColor"
                :label="$t('common.latitude')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.longitude"
                :color="bodyActiveColor"
                :label="$t('common.longitude')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.elevation"
                :color="bodyActiveColor"
                :label="$t('locality.elevation')"
                type="number"
                step="0.01"
              />
            </v-col>
          </v-row>

          <!-- MAP SWITCH -->
          <v-card
            class="d-flex flex-row justify-content-start mb-1 mx-3"
            flat
            :color="bodyColor.split('n-')[0] + 'n-5'"
            tile
          >
            <v-card
              flat
              tile
              class="align-self-center mr-2"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-switch
                v-model="showMap"
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
                {{ showMap ? $t("site.mapEnabled") : $t("site.mapDisabled") }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <transition enter-active-class="animated fadeIn faster">
            <v-row no-gutters v-show="showMap" class="mt-1">
              <v-col cols="12" class="pa-1">
                <map-component
                  v-if="showMap"
                  mode="single"
                  v-bind:locations="[]"
                  v-bind:location="{
                    lat: locality.latitude
                      ? locality.latitude.toString()
                      : null,
                    lng: locality.longitude
                      ? locality.longitude.toString()
                      : null
                  }"
                  v-on:update-coordinates="updateLocation"
                />
              </v-col>
            </v-row>
          </transition>
        </div>
      </transition>
    </v-card>

    <!-- ADDITIONAL INFO -->
    <v-card
      class="mt-2"
      id="block-additionalInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.additionalInfo = !block.additionalInfo"
        >
          <span>{{ $t("locality.additionalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.additionalInfo = !block.additionalInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.additionalInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.additionalInfo" class="pa-1">
          <!-- COORDINATE X, EXTENT and COUNTRY-->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.extent"
                :color="bodyActiveColor"
                :items="autocomplete.extent"
                :loading="autocomplete.loaders.extent"
                :item-text="commonLabel"
                :label="$t('locality.extent')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.depth"
                :color="bodyActiveColor"
                :label="$t('common.depth')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.country"
                :color="bodyActiveColor"
                :items="autocomplete.country"
                :loading="autocomplete.loaders.country"
                :item-text="commonLabel"
                :label="$t('locality.country')"
              />
            </v-col>
          </v-row>

          <!-- COORD PRECISION, COORD METHOD and COORD AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.coord_det_precision"
                :color="bodyActiveColor"
                :items="autocomplete.coordPrecision"
                :loading="autocomplete.loaders.coordPrecision"
                :item-text="commonLabel"
                :label="$t('locality.coord_det_precision')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.coord_det_method"
                :color="bodyActiveColor"
                :items="autocomplete.coordMethod"
                :loading="autocomplete.loaders.coordMethod"
                :item-text="commonLabel"
                :label="$t('locality.coord_det_method')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.coord_det_agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('locality.coord_det_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- STRAT TOP AND STRAT TOP FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('locality.stratigraphy_top')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.stratigraphy_top_free"
                :color="bodyActiveColor"
                :label="$t('locality.stratigraphy_top_free')"
              />
            </v-col>
          </v-row>

          <!-- STRAT LOWER AND STRAT LOWER FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('locality.stratigraphy_base')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.stratigraphy_base_free"
                :color="bodyActiveColor"
                :label="$t('locality.stratigraphy_base_free')"
              />
            </v-col>
          </v-row>

          <!-- MAAAMET PA AND EELIS ID -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.maaamet_pa_id"
                :color="bodyActiveColor"
                :label="$t('locality.maaamet_pa_id')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="locality.eelis"
                :color="bodyActiveColor"
                :label="$t('locality.eelis')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DESCRIPTION -->
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
          <span>{{ $t("locality.description") }}</span>
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
                v-model="locality.remarks_location"
                :color="bodyActiveColor"
                :label="$t('locality.remarks_location')"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="locality.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-2">
      <v-col>
        <checkbox-wrapper
          v-model="locality.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="locality.is_private = !locality.is_private"
        />
      </v-col>
    </v-row>

    <!-- SHOWING RELATED_DATA -->
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
          <span>{{ $t("locality.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2 blue--text"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <locality-reference-table
            v-show="activeTab === 'locality_reference'"
            :response="relatedData.locality_reference"
            :search-parameters="relatedData.searchParameters.locality_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <locality-synonym-table
            v-show="activeTab === 'locality_synonym'"
            :response="relatedData.locality_synonym"
            :search-parameters="relatedData.searchParameters.locality_synonym"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachment_link'">
            <file-upload
              show-existing
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :is-draggable="$route.meta.isEdit"
            />
          </div>

          <locality-stratigraphy-table
            v-show="activeTab === 'locality_stratigraphy'"
            :response="relatedData.locality_stratigraphy"
            :search-parameters="
              relatedData.searchParameters.locality_stratigraphy
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 0"
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
import Spinner from "vue-simple-spinner";
import {
  fetchListLocalityTypes,
  fetchListLocalityExtent,
  fetchListCoordinateMethod,
  fetchListCoordinatePrecision,
  fetchListCountry,
  fetchLocality,
  fetchLocalityReference,
  fetchLocalitySynonym,
  fetchLocalityAttachment,
  fetchLocalityStratigraphy
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import MapComponent from "../partial/MapComponent";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import FileUpload from "../partial/inputs/FileInput";
import LocalityReferenceTable from "./relatedTables/LocalityReferenceTable";
import LocalitySynonymTable from "./relatedTables/LocalitySynonymTable";
import LocalityStratigraphyTable from "./relatedTables/LocalityStratigraphyTable";
import requestsMixin from "../../mixins/requestsMixin";

export default {
  name: "Locality",

  components: {
    LocalityStratigraphyTable,
    LocalitySynonymTable,
    LocalityReferenceTable,
    FileUpload,
    AutocompleteWrapper,
    CheckboxWrapper,
    TextareaWrapper,
    InputWrapper,
    Spinner,
    MapComponent
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
        searchHistory: "localitySearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_LOCALITIES",
        title: "header.localities",
        object: "locality",
        field: "locality_en",
        block: this.block
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
    ...mapState(["databaseId", "mapSettings"]),

    showMap: {
      get() {
        return this.mapSettings.showMap;
      },
      set(value) {
        this.$store.dispatch("updateMapState", value);
      }
    },

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
          { name: "locality_reference", iconClass: "fas fa-book" },
          { name: "locality_synonym", iconClass: "fas fa-font" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "locality_stratigraphy", iconClass: "fas fa-globe-asia" }
        ],
        searchHistory: "localitySearchHistory",
        activeTab: "locality_reference",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "locality",
          "locality_en",
          "number",
          "code",
          "latitude",
          "longitude",
          "elevation",
          "depth",
          "coordx",
          "coordy",
          "coord_system",
          "stratigraphy_top_free",
          "stratigraphy_base_free",
          "maaamet_pa_id",
          "eelis",
          "remarks_location",
          "remarks",
          "is_private",
          "type",
          "parent",
          "extent",
          "coord_det_precision",
          "coord_det_method",
          "coord_det_agent",
          "country",
          "stratigraphy_top",
          "stratigraphy_base"
        ],
        autocomplete: {
          loaders: {
            locality: false,
            stratigraphy_top: false,
            stratigraphy_base: false,
            agent: false,
            reference: false,
            synonym: false,
            attachment: false,
            stratigraphy: false
          },
          localityTypes: [],
          locality: [],
          extent: [],
          coordPrecision: [],
          coordMethod: [],
          reference: [],
          agent: [],
          country: [],
          county: [],
          parish: [],
          stratigraphy_top: [],
          stratigraphy_base: [],
          synonym: [],
          attachment: [],
          stratigraphy: []
        },
        requiredFields: ["locality", "locality_en"],
        locality: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          map: true,
          additionalInfo: true,
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
        this.$emit("set-object", "locality");

        fetchLocality(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.locality = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.locality);

            this.removeUnnecessaryFields(this.locality, this.copyFields);
            this.$emit("data-loaded", this.locality);
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
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("locality_reference");
    },

    loadAutocompleteFields() {
      fetchListLocalityTypes().then(
        response =>
          (this.autocomplete.localityTypes = this.handleResponse(response))
      );
      fetchListLocalityExtent().then(
        response => (this.autocomplete.extent = this.handleResponse(response))
      );
      fetchListCoordinateMethod().then(
        response =>
          (this.autocomplete.coordMethod = this.handleResponse(response))
      );
      fetchListCoordinatePrecision().then(
        response =>
          (this.autocomplete.coordPrecision = this.handleResponse(response))
      );
      fetchListCountry().then(
        response => (this.autocomplete.country = this.handleResponse(response))
      );
    },

    setDefaultRelatedData() {
      return {
        locality_reference: { count: 0, results: [] },
        locality_synonym: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        locality_stratigraphy: { count: 0, results: [] },
        searchParameters: {
          locality_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          locality_synonym: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          attachment_link: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          locality_stratigraphy: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(uploadableObject.elevation))
        uploadableObject.elevation = parseFloat(
          uploadableObject.elevation
        ).toFixed(1);
      else uploadableObject.elevation = null;
      if (this.isNotEmpty(uploadableObject.latitude))
        uploadableObject.latitude = parseFloat(
          uploadableObject.latitude
        ).toFixed(6);
      else uploadableObject.latitude = null;
      if (this.isNotEmpty(uploadableObject.longitude))
        uploadableObject.longitude = parseFloat(
          uploadableObject.longitude
        ).toFixed(6);
      else uploadableObject.longitude = null;

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

      // if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment = this.relatedData.attachment_link.results;
            } else {
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
              ].results;
            }
        });
      } else {
        uploadableObject.related_data = {};
        uploadableObject.related_data.attachment = this.relatedData.attachment_link.results;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.locality.type = {
        value: obj.type__value,
        value_en: obj.type__value_en,
        id: obj.type__id
      };
      if (this.isNotEmpty(obj.parent__id)) {
        this.locality.parent = {
          locality: obj.parent__locality,
          locality_en: obj.parent__locality_en,
          id: obj.parent__id
        };
        this.autocomplete.locality.push(this.locality.parent);
      }
      this.locality.extent = {
        value: obj.extent__value,
        value_en: obj.extent__value_en,
        id: obj.extent__id
      };
      this.locality.coord_det_precision = {
        value: obj.coord_det_precision__value,
        value_en: obj.coord_det_precision__value_en,
        id: obj.coord_det_precision__id
      };
      this.locality.coord_det_method = {
        value: obj.coord_det_method__value,
        value_en: obj.coord_det_method__value_en,
        id: obj.coord_det_method__id
      };
      if (this.isNotEmpty(obj.coord_det_agent__id)) {
        this.locality.coord_det_agent = {
          agent: obj.coord_det_agent__agent,
          id: obj.coord_det_agent__id
        };
        this.autocomplete.agent.push(this.locality.coord_det_agent);
      }
      this.locality.country = {
        value: obj.country__value,
        value_en: obj.country__value_en,
        id: obj.country__id
      };
      if (this.isNotEmpty(obj.stratigraphy_top__id)) {
        this.locality.stratigraphy_top = {
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en,
          id: obj.stratigraphy_top__id
        };
        this.autocomplete.stratigraphy_top.push(this.locality.stratigraphy_top);
      }
      if (this.isNotEmpty(obj.stratigraphy_base__id)) {
        this.locality.stratigraphy_base = {
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en,
          id: obj.stratigraphy_base__id
        };
        this.autocomplete.stratigraphy_base.push(
          this.locality.stratigraphy_base
        );
      }
    },

    loadRelatedData(type) {
      let query;

      if (type === "locality_reference") {
        query = fetchLocalityReference(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_reference
        );
      } else if (type === "locality_synonym") {
        query = fetchLocalitySynonym(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_synonym
        );
      } else if (type === "attachment_link") {
        query = fetchLocalityAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (type === "locality_stratigraphy") {
        query = fetchLocalityStratigraphy(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_stratigraphy
        );
      }

      query.then(response => {
        this.relatedData[type] = this.handleResponse(response);
        this.relatedData.count[type] = response.data.count;
      });
    },

    updateLocation(location) {
      this.locality.latitude = location.lat.toFixed(6);
      this.locality.longitude = location.lng.toFixed(6);
    },

    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        county: null,
        country: null,
        agent: null,
        id: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "locality");
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.reuslts = files;
    }
  }
};
</script>

<style scoped>
.toggle-collapse {
  font-weight: bold;
  /*font-size: large;*/
}

.toggle-collapse:hover {
  cursor: pointer;
  opacity: 0.7;
}

/* Map height */
#collapseMap {
  height: 50vh;
}

.leaflet-container {
  /*cursor: pointer;*/
}

label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
