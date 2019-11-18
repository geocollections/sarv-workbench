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
    <fieldset class="border p-2 mb-2" ref="info" id="block-info">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.info }"
        @click="block.info = !block.info"
      >
        {{ $t("locality.generalInfo") }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.info">
          <!-- LOCALITY and LOCALITY ENG -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`locality`">{{ $t("locality.locality") }}:</label>
              <b-form-input
                id="locality"
                :state="isNotEmpty(locality.locality)"
                v-model="locality.locality"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`locality_en`"
                >{{ $t("locality.locality_en") }}:</label
              >
              <b-form-input
                id="locality_en"
                :state="isNotEmpty(locality.locality_en)"
                v-model="locality.locality_en"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- NUMBER, OTHER NUMBER, LOCALITY TYPE and LOCALITY BELONGS-->
          <div class="row">
            <div class="col-md-3">
              <label :for="`number`">{{ $t("locality.number") }}:</label>
              <b-form-input
                id="number"
                v-model="locality.number"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`code`">{{ $t("locality.code") }}:</label>
              <b-form-input
                id="code"
                v-model="locality.code"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-3">
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
            </div>

            <div class="col-md-3">
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
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- MAP -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-map">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.map }"
        @click="block.map = !block.map"
      >
        {{ $t("locality.map") }}
        <i class="fas fa-map"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.map">
          <!-- LATITUDE, LONGITUDE and ELEVATION -->
          <div class="row">
            <div class="col-6 col-sm-4">
              <label :for="`latitude`">{{ $t("locality.longitude") }}:</label>
              <b-form-input
                id="latitude"
                v-model="locality.latitude"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-6 col-sm-4">
              <label :for="`longitude`">{{ $t("locality.longitude") }}:</label>
              <b-form-input
                id="longitude"
                v-model="locality.longitude"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-sm-4">
              <label :for="`elevation`">{{ $t("locality.elevation") }}:</label>
              <b-form-input
                id="elevation"
                v-model="locality.elevation"
                type="number"
                step="0.01"
              ></b-form-input>
            </div>
          </div>

          <!-- MAP -->
          <div class="row">
            <div class="col">
              <v-switch
                v-model="showCollapseMap"
                hide-details
                class="vuetify-switch my-2"
                :label="showCollapseMap ? 'Map enabled' : 'Map disabled'"
              ></v-switch>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <b-collapse v-model="showCollapseMap" id="collapseMap">
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
              </b-collapse>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- ADDITIONAL INFO -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-additionalInfo">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.additionalInfo }"
        @click="block.additionalInfo = !block.additionalInfo"
      >
        {{ $t("locality.additionalInfo") }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.additionalInfo">
          <!-- COORDINATE X, EXTENT and COUNTRY-->
          <div class="row">
            <div class="col-md-4">
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
            </div>

            <div class="col-md-4">
              <label :for="`depth`">{{ $t("locality.depth") }}:</label>
              <b-form-input
                id="depth"
                v-model="locality.depth"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-4">
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
            </div>
          </div>

          <!-- COORD PRECISION, COORD METHOD and COORD AGENT -->
          <div class="row">
            <div class="col-md-4">
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
            </div>

            <div class="col-md-4">
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
            </div>

            <div class="col-md-4">
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
            </div>
          </div>

          <!-- STRAT TOP AND STRAT TOP FREE-->
          <div class="row">
            <div class="col-sm-6">
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
            </div>

            <div class="col-sm-6">
              <label :for="`stratigraphy_top_free`"
                >{{ $t("locality.stratigraphy_top_free") }}:</label
              >
              <b-form-input
                id="stratigraphy_top_free"
                v-model="locality.stratigraphy_top_free"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- STRAT LOWER AND STRAT LOWER FREE-->
          <div class="row">
            <div class="col-sm-6">
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
            </div>

            <div class="col-sm-6">
              <label :for="`stratigraphy_base_free`"
                >{{ $t("locality.stratigraphy_base_free") }}:</label
              >
              <b-form-input
                id="stratigraphy_base_free"
                v-model="locality.stratigraphy_base_free"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- MAAAMET PA AND EELIS ID -->
          <div class="row">
            <div class="col-sm-6">
              <label :for="`maaamet_pa_id`"
                >{{ $t("locality.maaamet_pa_id") }}:</label
              >
              <b-form-input
                id="maaamet_pa_id"
                v-model="locality.maaamet_pa_id"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-sm-6">
              <label :for="`eelis`">{{ $t("locality.eelis") }}:</label>
              <b-form-input
                id="eelis"
                v-model="locality.eelis"
                type="text"
              ></b-form-input>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- DESCRIPTION -->
    <fieldset class="border p-2 mb-2" ref="info" id="block-description">
      <legend
        class="w-auto mb-0"
        :class="{ 'text-primary': !block.description }"
        @click="block.description = !block.description"
      >
        {{ $t("locality.description") }}
        <i class="fas fa-pen-fancy"></i>
      </legend>

      <transition name="fade">
        <div v-if="block.description">
          <!-- DESCRIPTION -->
          <div class="row">
            <div class="col-sm-12">
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
            </div>
          </div>

          <!-- ADDITIONAL INFO -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t("locality.remarks") }}:</label>
              <b-form-textarea
                id="remarks"
                v-model="locality.remarks"
                type="text"
                size="sm"
                :rows="1"
                :max-rows="20"
              ></b-form-textarea>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- COORDINATE Y AND COORD SYSTEM -->
    <!--
    <div class="row">

      <div class="col-sm-2">
        <label :for="`coordx`">{{ $t('locality.coordx') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordx" v-model="locality.coordx" type="number"></b-form-input>
      </div>

      <div class="col-sm-2">
        <label :for="`coordy`">{{ $t('locality.coordy') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coordy" v-model="locality.coordy" type="number"></b-form-input>
      </div>


      <div class="col-sm-2">
        <label :for="`coord_system`">{{ $t('locality.coord_system') }}:</label>
      </div>

      <div class="col-sm-4 mb-2">
        <b-form-input id="coord_system" v-model="locality.coord_system" type="text"></b-form-input>
      </div>
    </div>
    -->

    <!-- CHECKBOXES -->
    <div class="row mt-3 mb-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="locality.is_private">
          {{ $t("locality.private") }}
        </b-form-checkbox>
      </div>
    </div>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col">
        <ul class="nav nav-tabs nav-fill mb-3">
          <li class="nav-item" v-for="tab in relatedTabs" :key="tab.name">
            <a
              href="#"
              @click.prevent="setTab(tab.name)"
              class="nav-link"
              :class="{ active: activeTab === tab.name }"
            >
              <span>{{ $t("locality.relatedTables." + tab.name) }}</span>

              <span>
                <sup>
                  <b-badge pill variant="light"
                    >{{ relatedData[tab.name].length }}&nbsp;</b-badge
                  >
                </sup>
              </span>

              <span><i :class="tab.iconClass"></i></span>
            </a>
          </li>
        </ul>

        <div class="row" v-if="$route.meta.isEdit">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select
              v-model="relatedData.searchParameters[activeTab].paginateBy"
              class="mb-3"
              size="sm"
            >
              <option :value="10">{{
                this.$t("main.pagination", { num: "10" })
              }}</option>
              <option :value="25">{{
                this.$t("main.pagination", { num: "25" })
              }}</option>
              <option :value="50">{{
                this.$t("main.pagination", { num: "50" })
              }}</option>
              <option :value="100">{{
                this.$t("main.pagination", { num: "100" })
              }}</option>
              <option :value="250">{{
                this.$t("main.pagination", { num: "250" })
              }}</option>
              <option :value="500">{{
                this.$t("main.pagination", { num: "500" })
              }}</option>
              <option :value="1000">{{
                this.$t("main.pagination", { num: "1000" })
              }}</option>
            </b-form-select>
          </div>

          <div class="col-sm-12 col-md-3 export-center">
            <!-- EXPORT BUTTON? -->
          </div>

          <div
            class="col-sm-12 col-md-6 pagination-center"
            v-if="
              relatedData[activeTab] !== null &&
                relatedData[activeTab].length > 0
            "
          >
            <b-pagination
              size="sm"
              align="right"
              :limit="5"
              :hide-ellipsis="true"
              :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.searchParameters[activeTab].page"
              :per-page="relatedData.searchParameters[activeTab].paginateBy"
            >
            </b-pagination>
          </div>
        </div>

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
      </div>
    </div>
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
        }
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

        this.$emit("related-data-info", this.relatedTabs.map(tab => tab.name));
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
        uploadableObject.latitude = objectToUpload.latitude.toFixed(6);
      if (this.isNotEmpty(objectToUpload.longitude))
        uploadableObject.longitude = objectToUpload.longitude.toFixed(6);

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
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
