<template>
  <div>
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- LOCALITY and LOCALITY ENG -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`locality`">{{ $t("locality.locality") }}:</label>
              <b-form-input
                size="sm"
                id="locality"
                :state="isNotEmpty(locality.locality)"
                v-model="locality.locality"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`locality_en`"
                >{{ $t("locality.locality_en") }}:</label
              >
              <b-form-input
                size="sm"
                id="locality_en"
                :state="isNotEmpty(locality.locality_en)"
                v-model="locality.locality_en"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- NUMBER, OTHER NUMBER, LOCALITY TYPE and LOCALITY BELONGS-->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`number`">{{ $t("locality.number") }}:</label>
              <b-form-input
                size="sm"
                id="number"
                v-model="locality.number"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`code`">{{ $t("locality.code") }}:</label>
              <b-form-input
                size="sm"
                id="code"
                v-model="locality.code"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`type`">{{ $t("locality.type") }}:</label>
              <vue-multiselect
                v-model="locality.type"
                v-if="isNotEmpty(autocomplete.localityTypes)"
                id="type"
                :options="autocomplete.localityTypes"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`parent`">{{ $t("locality.parent") }}:</label>
              <vue-multiselect
                v-model="locality.parent"
                id="parent"
                :label="localityLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.locality"
                :options="autocomplete.locality"
                @search-change="autocompleteLocalitySearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[localityLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- MAP -->
    <v-card
      class="mt-2"
      id="block-map"
      :color="bodyColor.split('-')[0] + '-5'"
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
        <div v-show="block.map" class="px-1 pt-1 pb-2">
          <!-- LATITUDE, LONGITUDE and ELEVATION -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`latitude`">{{ $t("locality.longitude") }}:</label>
              <b-form-input
                size="sm"
                id="latitude"
                v-model="locality.latitude"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`longitude`">{{ $t("locality.longitude") }}:</label>
              <b-form-input
                size="sm"
                id="longitude"
                v-model="locality.longitude"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`elevation`">{{ $t("locality.elevation") }}:</label>
              <b-form-input
                size="sm"
                id="elevation"
                v-model="locality.elevation"
                type="number"
                step="0.01"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- MAP SWITCH -->
          <v-card
            class="d-flex flex-row justify-content-start mt-1 mx-3"
            flat
            :color="bodyColor.split('-')[0] + '-5'"
            tile
          >
            <v-card
              flat
              tile
              class="align-self-center mr-2"
              :color="bodyColor.split('-')[0] + '-5'"
            >
              <v-switch
                v-model="showCollapseMap"
                hide-details
                id="map-switch"
                class="vuetify-switch my-1"
              ></v-switch>
            </v-card>

            <v-card
              flat
              tile
              class="align-self-center"
              :color="bodyColor.split('-')[0] + '-5'"
            >
              <label class="m-0" :for="`map-switch`">
                <i class="far fa-map"></i>
                {{
                  showCollapseMap
                    ? $t("site.mapEnabled")
                    : $t("site.mapDisabled")
                }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <transition enter-active-class="animated fadeIn faster">
            <v-row no-gutters v-show="showCollapseMap" class="mt-2">
              <v-col cols="12" class="px-1">
                <map-component
                  v-if="showCollapseMap"
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
      :color="bodyColor.split('-')[0] + '-5'"
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
        <div v-show="block.additionalInfo" class="px-1 pt-1 pb-2">
          <!-- COORDINATE X, EXTENT and COUNTRY-->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`extent`">{{ $t("locality.extent") }}:</label>
              <vue-multiselect
                v-model="locality.extent"
                id="extent"
                :options="autocomplete.extent"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`depth`">{{ $t("locality.depth") }}:</label>
              <b-form-input
                size="sm"
                id="depth"
                v-model="locality.depth"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`country`">{{ $t("locality.country") }}:</label>
              <vue-multiselect
                v-model="locality.country"
                id="country"
                :options="autocomplete.country"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- COORD PRECISION, COORD METHOD and COORD AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`coord_det_precision`"
                >{{ $t("locality.coord_det_precision") }}:</label
              >
              <vue-multiselect
                v-model="locality.coord_det_precision"
                id="coord_det_precision"
                :options="autocomplete.coordPrecision"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`coord_det_method`"
                >{{ $t("locality.coord_det_method") }}:</label
              >
              <vue-multiselect
                v-model="locality.coord_det_method"
                id="coord_det_method"
                :options="autocomplete.coordMethod"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`coord_det_agent`"
                >{{ $t("locality.coord_det_agent") }}:</label
              >
              <vue-multiselect
                v-model="locality.coord_det_agent"
                id="coord_det_agent"
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
          </v-row>

          <!-- STRAT TOP AND STRAT TOP FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`stratigraphy_top`"
                >{{ $t("locality.stratigraphy_top") }}:</label
              >
              <vue-multiselect
                v-model="locality.stratigraphy_top"
                id="stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :label="stratigraphyLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :options="autocomplete.stratigraphy_top"
                @search-change="autocompleteStratigraphyTopSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`stratigraphy_top_free`"
                >{{ $t("locality.stratigraphy_top_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="stratigraphy_top_free"
                v-model="locality.stratigraphy_top_free"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- STRAT LOWER AND STRAT LOWER FREE-->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`stratigraphy_base`"
                >{{ $t("locality.stratigraphy_base") }}:</label
              >
              <vue-multiselect
                v-model="locality.stratigraphy_base"
                id="stratigraphy_base"
                :label="stratigraphyLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.stratigraphy_base"
                :options="autocomplete.stratigraphy_base"
                @search-change="autocompleteStratigraphyBaseSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`stratigraphy_base_free`"
                >{{ $t("locality.stratigraphy_base_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="stratigraphy_base_free"
                v-model="locality.stratigraphy_base_free"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- MAAAMET PA AND EELIS ID -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`maaamet_pa_id`"
                >{{ $t("locality.maaamet_pa_id") }}:</label
              >
              <b-form-input
                size="sm"
                id="maaamet_pa_id"
                v-model="locality.maaamet_pa_id"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`eelis`">{{ $t("locality.eelis") }}:</label>
              <b-form-input
                size="sm"
                id="eelis"
                v-model="locality.eelis"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DESCRIPTION -->
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks_location`"
                >{{ $t("locality.remarks_location") }}:</label
              >
              <b-form-textarea
                id="remarks_location"
                v-model="locality.remarks_location"
                type="text"
                size="sm"
                :rows="1"
                :max-rows="20"
              ></b-form-textarea>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("locality.remarks") }}:</label>
              <b-form-textarea
                id="remarks"
                v-model="locality.remarks"
                type="text"
                size="sm"
                :rows="1"
                :max-rows="20"
              ></b-form-textarea>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-3">
      <v-col>
        <v-checkbox
          v-model="locality.is_private"
          id="is_private"
          :label="$t('locality.private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>

    <!-- SHOWING RELATED_DATA -->
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
          <span>{{ $t("locality.relatedTables." + tab.name) }}</span>
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
          <locality-reference
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <locality-synonym
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <locality-attachment
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <locality-stratigraphy
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
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import copyForm from "../../mixins/copyForm";
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
  fetchLocalityStratigraphy,
  fetchLocalities
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import LocalityReference from "./relatedTables/LocalityReference";
import LocalitySynonym from "./relatedTables/LocalitySynonym";
import LocalityAttachment from "./relatedTables/LocalityAttachment";
import LocalityStratigraphy from "./relatedTables/LocalityStratigraphy";
import MapComponent from "../partial/MapComponent";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";

export default {
  name: "Locality",

  components: {
    LocalityStratigraphy,
    LocalityAttachment,
    LocalitySynonym,
    LocalityReference,
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

  mixins: [formManipulation, copyForm, autocompleteMixin, formSectionsMixin],

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
    ...mapState(["databaseId"]),

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
        showCollapseMap: true,
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

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      }

      if (this.activeRelatedDataTab) this.setTab(this.activeRelatedDataTab);
      else this.setTab("locality_reference");
    },

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
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
          response =>
            (this.autocomplete.country = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        locality_reference: [],
        locality_synonym: [],
        attachment_link: [],
        locality_stratigraphy: [],
        copyFields: {
          locality_reference: ["reference", "pages", "figures", "remarks"],
          locality_synonym: ["synonym", "reference", "pages", "remarks"],
          attachment_link: ["attachment", "remarks"],
          locality_stratigraphy: [
            "stratigraphy",
            "depth_base",
            "depth_top",
            "reference",
            "agent",
            "year",
            "current"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          locality_reference: {
            page: 1,
            paginateBy: 25,
            orderBy: "id"
          },
          locality_synonym: {
            page: 1,
            paginateBy: 25,
            orderBy: "id"
          },
          attachment_link: {
            page: 1,
            paginateBy: 25,
            orderBy: "id"
          },
          locality_stratigraphy: {
            page: 1,
            paginateBy: 25,
            orderBy: "id"
          }
        },
        count: {
          locality_reference: 0,
          locality_synonym: 0,
          attachment_link: 0,
          locality_stratigraphy: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        locality_reference: {},
        locality_synonym: {},
        attachment_link: {},
        locality_stratigraphy: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.elevation))
        uploadableObject.elevation = objectToUpload.elevation.toFixed(1);
      // Todo: Add else null for lat and long if some errors (04.09.2019)
      if (this.isNotEmpty(objectToUpload.latitude))
        uploadableObject.latitude = parseFloat(objectToUpload.latitude).toFixed(
          6
        );
      if (this.isNotEmpty(objectToUpload.longitude))
        uploadableObject.longitude = parseFloat(
          objectToUpload.longitude
        ).toFixed(6);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;
      if (this.isNotEmpty(objectToUpload.extent))
        uploadableObject.extent = objectToUpload.extent.id;
      if (this.isNotEmpty(objectToUpload.coord_det_precision))
        uploadableObject.coord_det_precision =
          objectToUpload.coord_det_precision.id;
      if (this.isNotEmpty(objectToUpload.coord_det_method))
        uploadableObject.coord_det_method = objectToUpload.coord_det_method.id;
      if (this.isNotEmpty(objectToUpload.coord_det_agent))
        uploadableObject.coord_det_agent = objectToUpload.coord_det_agent.id;
      if (this.isNotEmpty(objectToUpload.country))
        uploadableObject.country = objectToUpload.country.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy_top))
        uploadableObject.stratigraphy_top = objectToUpload.stratigraphy_top.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy_base))
        uploadableObject.stratigraphy_base =
          objectToUpload.stratigraphy_base.id;

      // if (this.databaseId) uploadableObject.database = this.databaseId;

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
      this.locality.type = {
        value: obj.type__value,
        value_en: obj.type__value_en,
        id: obj.type__id
      };
      this.locality.parent = {
        locality: obj.parent__locality,
        locality_en: obj.parent__locality_en,
        id: obj.parent__id
      };
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
      this.locality.coord_det_agent = {
        agent: obj.coord_det_agent__agent,
        id: obj.coord_det_agent__id
      };
      this.locality.country = {
        value: obj.country__value,
        value_en: obj.country__value_en,
        id: obj.country__id
      };
      this.locality.stratigraphy_top = {
        stratigraphy: obj.stratigraphy_top__stratigraphy,
        stratigraphy_en: obj.stratigraphy_top__stratigraphy_en,
        id: obj.stratigraphy_top__id
      };
      this.locality.stratigraphy_base = {
        stratigraphy: obj.stratigraphy_base__stratigraphy,
        stratigraphy_en: obj.stratigraphy_base__stratigraphy_en,
        id: obj.stratigraphy_base__id
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      obj.reference = {
        reference: obj.reference__reference,
        id: obj.reference
      };
      obj.stratigraphy = {
        stratigraphy: obj.stratigraphy__stratigraphy,
        stratigraphy_en: obj.stratigraphy__stratigraphy_en,
        id: obj.stratigraphy__id
      };
      obj.agent = { agent: obj.agent__agent, id: obj.agent };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }

      if (this.isNotEmpty(obj.stratigraphy)) {
        newObject.stratigraphy = obj.stratigraphy.id;
        newObject.stratigraphy__stratigraphy = obj.stratigraphy.stratigraphy;
        newObject.stratigraphy__stratigraphy_en =
          obj.stratigraphy.stratigraphy_en;
      }

      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }

      if (this.isNotEmpty(obj.attachment)) {
        newObject.attachment = obj.attachment.id;
        newObject.attachment__original_filename =
          obj.attachment.original_filename;
      }

      return newObject;
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

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[type] = this.handleResponse(response);
          this.relatedData.count[type] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.locality = this.locality.id;
      if (this.isNotEmpty(uploadableObject.reference)) {
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      }
      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }
      if (this.isNotEmpty(uploadableObject.stratigraphy)) {
        uploadableObject.stratigraphy = uploadableObject.stratigraphy.id
          ? uploadableObject.stratigraphy.id
          : uploadableObject.stratigraphy;
      }
      if (this.isNotEmpty(uploadableObject.agent)) {
        uploadableObject.agent = uploadableObject.agent.id
          ? uploadableObject.agent.id
          : uploadableObject.agent;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    updateLocation(location) {
      this.locality.latitude = location.lat.toFixed(6);
      this.locality.longitude = location.lng.toFixed(6);
    },
    fetchList(localStorageData) {
      let params =
        this.isNotEmpty(localStorageData) &&
        localStorageData !== "fallbackValue"
          ? localStorageData
          : this.searchParameters;
      return new Promise(resolve => {
        resolve(fetchLocalities(params));
      });
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
