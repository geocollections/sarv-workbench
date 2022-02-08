<template>
  <div class="locality">
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
            $t("common.generalInfo")
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
                :items="autocomplete.list_locality_type"
                :loading="autocomplete.loaders.list_locality_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.parent"
                :color="bodyActiveColor"
                :items="autocomplete.parent"
                :loading="autocomplete.loaders.parent"
                :item-text="localityLabel"
                :label="$t('locality.parent')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch($event, 'parent')"
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
            class="d-flex flex-row justify-start mb-1 mx-3"
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
                {{ myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled") }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <v-row no-gutters v-show="myShowMap" class="mt-1">
            <v-col cols="12" class="pa-1">
              <map-component
                :show-map="myShowMap && block.map"
                mode="single"
                v-bind:locations="[]"
                v-bind:location="{
                  lat: locality.latitude ? locality.latitude.toString() : null,
                  lng: locality.longitude
                    ? locality.longitude.toString()
                    : null,
                }"
                v-on:update-coordinates="updateLocation"
              />
            </v-col>
          </v-row>

          <!-- COORDX, COORDY and EPSG -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.coordx"
                :color="bodyActiveColor"
                :label="$t('site.coordx')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.coordy"
                :color="bodyActiveColor"
                :label="$t('site.coordy')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.epsg"
                :color="bodyActiveColor"
                :label="$t('site.epsg')"
                type="number"
              />
            </v-col>
          </v-row>
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
                :items="autocomplete.list_locality_extent"
                :loading="autocomplete.loaders.list_locality_extent"
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
                :items="autocomplete.list_country"
                :loading="autocomplete.loaders.list_country"
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
                :items="autocomplete.list_coordinate_precision"
                :loading="autocomplete.loaders.list_coordinate_precision"
                :item-text="commonLabel"
                :label="$t('locality.coord_det_precision')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.coord_det_method"
                :color="bodyActiveColor"
                :items="autocomplete.list_coordinate_method"
                :loading="autocomplete.loaders.list_coordinate_method"
                :item-text="commonLabel"
                :label="$t('locality.coord_det_method')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="locality.coord_det_agent"
                :color="bodyActiveColor"
                :items="autocomplete.coord_det_agent"
                :loading="autocomplete.loaders.coord_det_agent"
                item-text="agent"
                :label="$t('locality.coord_det_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="
                  autocompleteAgentSearch($event, 'coord_det_agent')
                "
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

          <!-- MINDAT_ID, MAAAMET PA AND EELIS ID -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.mindat_id"
                :color="bodyActiveColor"
                label="Mindat ID"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="locality.maaamet_pa_id"
                :color="bodyActiveColor"
                :label="$t('locality.maaamet_pa_id')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
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
          <span>{{ $t("common.description") }}</span>
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
          <span>{{ $t("locality.relatedTables." + tab.name) }}</span>
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
            <file-input
              show-existing
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
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

          <locality-description-table
            v-show="activeTab === 'locality_description'"
            :response="relatedData.locality_description"
            :search-parameters="
              relatedData.searchParameters.locality_description
            "
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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import MapComponent from "@/components/partial/MapComponent";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import LocalityReferenceTable from "@/components/locality/relatedTables/LocalityReferenceTable";
import LocalitySynonymTable from "@/components/locality/relatedTables/LocalitySynonymTable";
import LocalityStratigraphyTable from "@/components/locality/relatedTables/LocalityStratigraphyTable";
import LocalityDescriptionTable from "@/components/locality/relatedTables/LocalityDescriptionTable";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Locality",

  components: {
    Pagination,
    LocalityDescriptionTable,
    LocalityStratigraphyTable,
    LocalitySynonymTable,
    LocalityReferenceTable,
    FileInput,
    AutocompleteWrapper,
    CheckboxWrapper,
    TextareaWrapper,
    InputWrapper,
    MapComponent,
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

  computed: {
    ...mapState("map", ["showMap"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),
    ...mapActions("map", ["updateShowMap"]),

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
          { name: "locality_reference", iconClass: "fas fa-book" },
          { name: "locality_synonym", iconClass: "fas fa-font" },
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "locality_stratigraphy", iconClass: "fas fa-globe-asia" },
          { name: "locality_description", iconClass: "fas fa-align-left" },
        ],
        activeTab: "locality_reference",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: [
          "list_locality_type",
          "list_locality_extent",
          "list_coordinate_method",
          "list_coordinate_precision",
          "list_country",
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
            stratigraphy: false,
            list_locality_type: false,
            list_locality_extent: false,
            list_coordinate_method: false,
            list_coordinate_precision: false,
            list_country: false,
            parent: false,
            coord_det_agent: false,
          },
          locality: [],
          reference: [],
          agent: [],
          county: [],
          parish: [],
          stratigraphy_top: [],
          stratigraphy_base: [],
          synonym: [],
          attachment: [],
          stratigraphy: [],
          list_locality_type: [],
          list_locality_extent: [],
          list_coordinate_method: [],
          list_coordinate_precision: [],
          list_country: [],
          parent: [],
          coord_det_agent: [],
        },
        requiredFields: ["locality", "locality_en"],
        locality: {
          id: null,
          locality: null,
          locality_en: null,
          number: null,
          code: null,
          latitude: null,
          longitude: null,
          elevation: null,
          depth: null,
          coordx: null,
          coordy: null,
          epsg: null,
          coord_system: null,
          stratigraphy_top_free: null,
          stratigraphy_base_free: null,
          maaamet_pa_id: null,
          mindat_id: null,
          eelis: null,
          remarks_location: null,
          remarks: null,
          is_private: null,
          type: null,
          parent: null,
          extent: null,
          coord_det_precision: null,
          coord_det_method: null,
          coord_det_agent: null,
          country: null,
          stratigraphy_top: null,
          stratigraphy_base: null,
        },
        block: {
          info: true,
          map: true,
          additionalInfo: true,
          description: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        locality_reference: { count: 0, results: [] },
        locality_synonym: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        locality_stratigraphy: { count: 0, results: [] },
        locality_description: {
          count: 0,
          results: [],
        },
        searchParameters: {
          locality_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["reference"],
            sortDesc: [true],
          },
          locality_synonym: {
            page: 1,
            paginateBy: 25,
            sortBy: ["synonym"],
            sortDesc: [true],
          },
          attachment_link: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true],
          },
          locality_stratigraphy: {
            page: 1,
            paginateBy: 25,
            sortBy: ["depth_base", "depth_top"],
            sortDesc: [false, false],
          },
          locality_description: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    updateLocation(location) {
      this.locality.latitude = location.lat.toFixed(6);
      this.locality.longitude = location.lng.toFixed(6);
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "locality", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },
  },
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
