<template>
  <div class="site">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    />

    <!-- CONVERT TO LOCALITY -->
    <v-row v-if="$route.meta.isEdit">
      <v-col cols="12" class="text-right">
        <v-btn
          color="blue"
          dark
          small
          @click="$parent.$emit('button-clicked', 'COPY_TO_LOCALITY', 'site')"
        >
          <v-icon left small>fas fa-map-marked-alt</v-icon>
          {{ $t("site.copyToLocality") }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("site.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer />
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NAME and PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="site.name"
                :color="bodyActiveColor"
                :label="$t('site.name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="site.project"
                :color="bodyActiveColor"
                :items="autocomplete.project"
                :loading="autocomplete.loaders.project"
                :item-text="nameLabel"
                :label="$t('site.project')"
                is-link
                route-object="project"
                is-searchable
                v-on:search:items="autocompleteProjectSearch"
              />
            </v-col>
          </v-row>

          <!-- DATE_START and DATE_END -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.date_start"
                :color="bodyActiveColor"
                :label="$t('site.date_start_info')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.date_end"
                :color="bodyActiveColor"
                :label="$t('site.date_end_info')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LOCALITY INFO -->
    <v-card
      class="mt-2"
      id="block-location"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.location = !block.location"
        >
          <span :class="validate('site') ? 'green--text' : 'red--text'">{{
            $t("site.location")
          }}</span>
          <v-icon right :class="validate('site') ? 'green--text' : 'red--text'"
            >fas fa-globe</v-icon
          >
        </div>
        <v-spacer />
        <v-btn
          icon
          @click="block.location = !block.location"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.location ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.location" class="pa-1">
          <!-- LATITUDE, LONGITUDE and LOCATION_ACCURACY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.latitude"
                :color="bodyActiveColor"
                :label="$t('common.latitude')"
                use-state
                type="number"
                step="0.000001"
                @input="handleCoordinateChange"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.longitude"
                :color="bodyActiveColor"
                :label="$t('common.longitude')"
                use-state
                type="number"
                step="0.000001"
                @input="handleCoordinateChange"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.location_accuracy"
                :color="bodyActiveColor"
                :label="$t('site.location_accuracy')"
                type="number"
                min="0"
              />
            </v-col>
          </v-row>

          <!-- MAP SWITCH -->
          <v-card
            class="d-flex flex-row justify-content-start mb-1 mx-3"
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
                  v-if="showMap && !isLatitudeUndefinedInEditView"
                  :gps-coords="true"
                  mode="single"
                  module="site"
                  v-bind:locations="[]"
                  v-bind:location="{
                    lat: site.latitude ? site.latitude.toString() : null,
                    lng: site.longitude ? site.longitude.toString() : null
                  }"
                  v-on:update-coordinates="updateLocation"
                />
              </v-col>
            </v-row>
          </transition>

          <!-- ELEVATION, ELEVATION_ACCURACY and COORD_DET_METHOD -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.elevation"
                :color="bodyActiveColor"
                :label="$t('site.elevation')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.elevation_accuracy"
                :color="bodyActiveColor"
                :label="$t('site.elevation_accuracy')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="site.coord_det_method"
                :color="bodyActiveColor"
                :items="autocomplete.coordMethod"
                :loading="autocomplete.loaders.coordMethod"
                :item-text="commonLabel"
                :label="$t('site.coord_det_method')"
              />
            </v-col>
          </v-row>

          <!-- EXTENT, DEPTH and LOCALITY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.extent"
                :color="bodyActiveColor"
                :label="$t('site.extent')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.depth"
                :color="bodyActiveColor"
                :label="$t('site.depth')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="site.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('site.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>
          </v-row>

          <!-- REMARKS_LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="site.remarks_location"
                :color="bodyActiveColor"
                :label="$t('site.remarks_location')"
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
          <span>{{ $t("site.description") }} | {{ $t("site.remarks") }}</span>
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
                v-model="site.description"
                :color="bodyActiveColor"
                :label="$t('site.description')"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="site.remarks"
                :color="bodyActiveColor"
                :label="$t('site.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- FILES -->
    <v-card
      class="mt-2"
      id="block-files"
      v-if="$route.meta.isEdit && site.id"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{ $t("site.files") }}</span>
          <v-icon right>fas fa-folder-open</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.files = !block.files"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="pa-1">
          <file-upload
            show-existing
            :files-from-object="relatedData.attachment_link"
            v-on:update:existing-files="addExistingFiles"
            v-on:file-uploaded="addFiles"
            accept-multiple
          />
        </div>
      </transition>
    </v-card>

    <!-- SAMPLES -->
    <v-card
      class="mt-2"
      id="block-samples"
      v-if="$route.meta.isEdit && site.id"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.samples = !block.samples"
        >
          <span>{{ $t("site.relatedSamples") }}</span>
          <v-icon right>fas fa-vial</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.samples = !block.samples"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.samples ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.samples" class="pa-1">
          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-content-start mb-3"
            flat
            tile
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card flat tile class="mx-1">
              <v-btn
                :to="{
                  name: 'Sample add',
                  query: { site: JSON.stringify(site) }
                }"
                target="newSiteWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
            </v-card>

            <v-card flat tile class="mx-1" v-if="relatedData.samples.count > 0">
              <export-buttons
                filename="sample"
                :table-data="relatedData.samples.results"
                clipboard-class="sample-table"
                :body-active-color="bodyActiveColor"
              ></export-buttons>
            </v-card>
          </v-card>

          <!-- PAGINATION -->
          <div
            v-if="relatedData.samples.count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between px-1"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters.sample.paginateBy"
                color="blue"
                dense
                :items="paginateByOptionsTranslated"
                item-color="blue"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters.sample.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.samples.count /
                      relatedData.searchParameters.sample.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <sample-table
                ref="table"
                :response="relatedData.samples"
                :search-parameters="relatedData.searchParameters.sample"
                v-if="relatedData.samples.count > 0"
                :body-active-color="bodyActiveColor"
                :body-color="bodyColor"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchSite,
  fetchListCoordinateMethod,
  fetchSiteAttachment,
  fetchLinkedSamples,
  fetchLastSiteName
} from "../../assets/js/api/apiCalls";
import MapComponent from "../partial/MapComponent";
import sidebarMixin from "../../mixins/sidebarMixin";
import SampleTable from "../sample/SampleTable";
import ExportButtons from "../partial/export/ExportButtons";
import debounce from "lodash/debounce";
import { mapState } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
// eslint-disable-next-line no-unused-vars
import moment from "moment";
import { toastInfo } from "../../assets/js/iziToast/iziToast";
import FileUpload from "../partial/inputs/FileInput";

export default {
  name: "Site",
  components: {
    FileUpload,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    SampleTable,
    MapComponent,
    Spinner,
    ExportButtons
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    }
  },
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    sidebarMixin
  ],
  data() {
    return this.setInitialData();
  },
  computed: {
    ...mapState(["sidebarUserAction", "mapSettings"]),

    showMap: {
      get() {
        return this.mapSettings.showMap;
      },
      set(value) {
        this.$store.dispatch("updateMapState", value);
      }
    },

    // Checks if site object has latitude key and is edit view, using this check while rendering mapComponent,
    // because I don't want mapComponent to render if site object is still empty (haven't got data from API yet)
    isLatitudeUndefinedInEditView() {
      return (
        typeof this.site.latitude === "undefined" && this.$route.meta.isEdit
      );
    },

    activeProject() {
      return this.$store.state["activeProject"];
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
        searchHistory: "siteSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_SITES",
        title: "header.sites",
        object: "site",
        field: "name",
        block: this.block
      });
    } else {
      // Add view
      this.$set(this.site, "date_start", this.getCurrentFormattedDate());

      if (this.activeProject) {
        this.site.project = {
          id: this.activeProject.id,
          name: this.activeProject.name,
          name_en: this.activeProject.name_en
        };
        this.setSiteName(this.site.project.id);
      }
    }

    // Getting project (only from project view when user presses 'add site button' in detail view or in sidebar)
    if (this.$route.params.project) {
      const dataFromProject = this.$route.params.project;

      this.site.project = {
        id: dataFromProject.id,
        name: dataFromProject.name,
        name_en: dataFromProject.name_en
      };
      this.setSiteName(dataFromProject.id);
    }

    this.loadFullInfo();
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.meta.isEdit) {
      this.$store.dispatch("setActiveSite", this.site);
    }
    next();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      }
    },
    sidebarUserAction(newVal) {
      this.handleUserAction(newVal, "site", this.site);
    },
    "relatedData.searchParameters.sample": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(
            newVal,
            this.fetchLinkedSamplesWrapper,
            "samples"
          );
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    fetchLinkedSamplesWrapper() {
      return new Promise(resolve => {
        resolve(
          fetchLinkedSamples(
            this.relatedData.searchParameters.sample,
            this.$route.params.id
          )
        );
      });
    },

    setInitialData() {
      return {
        searchHistory: "siteSearchHistory",
        relatedData: this.setDefaultRalatedData(),
        copyFields: [
          "id",
          "name",
          "name_en",
          "project",
          "date_start",
          "date_end",
          "coord_det_method",
          "locality",
          "latitude",
          "longitude",
          "location_accuracy",
          "elevation",
          "elevation_accuracy",
          "extent",
          "depth",
          "remarks_location",
          "description",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            project: false,
            attachment: false,
            coordMethod: false,
            locality: false
          },
          project: [],
          attachment: [],
          coordMethod: [],
          locality: []
        },
        requiredFields: ["latitude", "longitude"],
        site: {},
        previousRecord: {},
        nextRecord: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: !this.$route.meta.isEdit,
          location: this.$route.meta.isEdit,
          description: false,
          files: true,
          samples: true
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
      fetchListCoordinateMethod().then(response => {
        this.autocomplete.coordMethod = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "site");

        fetchSite(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.site = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.site);
            this.removeUnnecessaryFields(this.site, this.copyFields);

            this.site.related_data = {};
            this.$emit("data-loaded", this.site);
            this.sendingData = false;
            // this.getListRecords('site')
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        this.loadRelatedData("attachment_link");
      }
      this.$root.$on(
        "add-or-edit-site-from-modal",
        this.handleUserChoiceFromModal
      );
    },

    setDefaultRalatedData() {
      return {
        attachment_link: [],
        samples: {
          count: 0,
          results: []
        },
        new: {
          attachment_link: []
        },
        page: {
          attachment_link: 1
        },
        count: {
          attachment_link: 0,
          sample: 0
        },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 25,
            orderBy: "-id"
          },
          sample: {
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

      if (this.isNotEmpty(uploadableObject.date_start)) {
        if (!this.isValidDateTime(uploadableObject.date_start)) {
          this.site.date_start = null;
          uploadableObject.date_start = null;
          toastInfo({ text: "Field 'Date start' is invalid" });
        }
      }
      if (this.isNotEmpty(uploadableObject.date_end)) {
        if (!this.isValidDateTime(uploadableObject.date_end)) {
          this.site.date_end = null;
          uploadableObject.date_end = null;
          toastInfo({ text: "Field 'Date end' is invalid" });
        }
      }
      if (this.isNotEmpty(objectToUpload.location_accuracy))
        uploadableObject.location_accuracy =
          typeof uploadableObject.location_accuracy === "string"
            ? parseFloat(objectToUpload.location_accuracy).toFixed(2)
            : objectToUpload.location_accuracy.toFixed(2);
      else uploadableObject.location_accuracy = null;
      if (this.isNotEmpty(objectToUpload.latitude))
        uploadableObject.latitude = parseFloat(objectToUpload.latitude).toFixed(
          6
        );
      else uploadableObject.latitude = null;
      if (this.isNotEmpty(objectToUpload.longitude))
        uploadableObject.longitude = parseFloat(
          objectToUpload.longitude
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

      uploadableObject.related_data = {};
      uploadableObject.related_data.attachment = this.relatedData.attachment_link;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },
    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.project)) {
        this.site.project = {
          name: obj.project__name,
          name_en: obj.project__name_en,
          id: obj.project
        };
        this.autocomplete.project.push(this.site.project);
      }
      this.site.coord_det_method = {
        value: obj.coord_det_method__value,
        value_en: obj.coord_det_method__value_en,
        id: obj.coord_det_method
      };
      if (this.isNotEmpty(obj.locality__id)) {
        this.site.locality = {
          id: obj.locality__id,
          locality_en: obj.locality__locality_en,
          locality: obj.locality__locality
        };
        this.autocomplete.locality.push(this.site.locality);
      }
    },

    fillRelatedDataAutocompleteFields(obj, type) {
      if (obj === undefined) return;
      let relatedData = cloneDeep(obj);
      obj = [];
      relatedData.forEach(entity => {
        if (type === "attachment_link" || type === "sample") obj.push(entity);
      });
      return obj;
    },

    loadRelatedData(object) {
      let query;

      if (object === "attachment_link") {
        query = fetchSiteAttachment(
          this.$route.params.id,
          this.relatedData.page.attachment_link
        );
      }
      return new Promise(resolve => {
        query.then(response => {
          this.relatedData.count[object] = response.data.count;
          this.relatedData[object] = this.handleResponse(response);

          if (object === "attachment_link") {
            this.autocomplete.attachment = this.relatedData[object];
          }
          // this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.site = this.site.id;

      // console.log(JSON.stringify(uploadableObject));
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        name: null,
        project: null,
        projectId: null,
        page: 1,
        paginateBy: 8,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    customLabelForAttachment(option) {
      return this.$i18n.locale === "ee"
        ? `${option.id} - (${option.description}) (${option.author__agent})`
        : `${option.id} - (${option.description_en}) (${option.author__agent})`;
    },

    addRelatedDataAttachment(option) {
      if (typeof this.relatedData.attachment_link === "undefined")
        this.relatedData.attachment_link = [];
      this.relatedData.attachment_link.push(option);
    },

    updateLocation(location, method, GPSPosition) {
      this.$set(this.site, "latitude", location.lat.toFixed(6));
      this.$set(this.site, "longitude", location.lng.toFixed(6));
      // this.site.latitude = location.lat.toFixed(6);
      // this.site.longitude = location.lng.toFixed(6);

      // If user chooses coordinates from map by clicking or dragging the marker then reset gps accuracy and coord_det_method
      if (method === "GPS") {
        this.$set(this.site, "location_accuracy", GPSPosition.coords.accuracy);
        this.$set(this.site, "coord_det_method", {
          id: 6,
          value: "GPS",
          value_en: "GPS"
        });
      } else {
        this.$set(this.site, "location_accuracy", null);
        this.$set(this.site, "coord_det_method", null);
      }
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "site");
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link = files;
    },

    setSiteName(projectId) {
      fetchLastSiteName(projectId).then(response => {
        if (response.data.results && response.data.results.length > 0) {
          let newName = this.calculateNextName(response.data.results[0].name);
          this.$set(this.site, "name", newName);
        }
      });
    },

    setSiteNameAndProjectIfPreviousExists() {
      return new Promise(resolve => {
        if (this.createRelationWith.data === null) resolve(false);
        let project = this.createRelationWith.data;
        fetchLastSiteName(project.id).then(response => {
          let resp = response.data.results;
          if (resp && resp.length > 0) {
            let newName = this.calculateNextName(resp[0].name);
            this.$set(this.site, "name", newName);
            this.$set(this.site, "date_start", this.getCurrentFormattedDate());
            this.$set(this.site, "project", {
              name: project.name,
              name_en: project.name_en,
              id: project.id
            });
            resolve(true);
          } else resolve(false);
        });
      });
    },

    handleUserChoiceFromModal(choice) {
      console.log(choice);
      let vm = this;
      if (choice === "SAVE_AND_LEAVE") {
        this.add(false, "site", true).then(() => {
          vm.$root.$emit("close-new-site-modal");
        });
      } else if (choice === "SAVE") {
        this.add(true, "site");
      }
    },

    // Resetting accuracy and coord det method because user changed coordinates manually
    handleCoordinateChange() {
      this.site.location_accuracy = null;
      this.site.coord_det_method = null;
    },

    searchRelatedData: debounce(function(
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then(response => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.data.count;
          this.relatedData[relatedObject].results = response.data.results;
        }
      });
    },
    500)
  }
};
</script>

<style scoped>
.tooltip .fade {
  background-color: red !important;
}

label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

/* Multiselect component size override */
.site >>> .multiselect {
  min-height: 31px;
  /*height: 31px;*/
}

.site >>> .multiselect__tags {
  min-height: 31px;
  /*height: 31px;*/
  padding: 4px 40px 4px 8px;
}

.site >>> .multiselect__select {
  min-height: 29px;
  height: 29px;
}

.site >>> .multiselect__single {
  padding: 0;
  margin-bottom: 0;
  font-size: 0.875rem;
}

.site >>> .multiselect__placeholder {
  padding: 0;
  margin-bottom: 0;
}
</style>
