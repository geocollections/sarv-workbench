<template>
  <div class="site">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- GENERAL INFO -->
    <v-card class="mt-2" id="block-info">
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("site.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- NAME and PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`name`">{{ $t("site.name") }}:</label>
              <b-form-input
                size="sm"
                id="name"
                v-model="site.name"
                type="text"
                maxlength="100"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`project`">{{ $t("site.project") }}:</label>
              <vue-multiselect
                v-model="site.project"
                id="project"
                :label="nameLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.project"
                :options="autocomplete.project"
                @search-change="autocompleteProjectSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- DATE_START and DATE_END -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_start`"
                >{{ $t("site.date_start") }} (yyyy-mm-dd hh:mm):</label
              >
              <datepicker
                id="date_start"
                v-model="site.date_start"
                :use-utc="true"
                lang="en"
                :first-day-of-week="1"
                format="YYYY-MM-DD HH:mm"
                confirm
                type="datetime"
                :typeable="true"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_end`"
                >{{ $t("site.date_end") }} (yyyy-mm-dd hh:mm):</label
              >
              <datepicker
                id="date_end"
                v-model="site.date_end"
                :use-utc="true"
                lang="en"
                :first-day-of-week="1"
                format="YYYY-MM-DD HH:mm"
                confirm
                type="datetime"
                :typeable="true"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LOCALITY INFO -->
    <v-card class="mt-2" id="block-location">
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
        <v-spacer></v-spacer>
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
        <div v-show="block.location" class="px-1 pt-1 pb-2">
          <!-- LATITUDE, LONGITUDE and LOCATION_ACCURACY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`latitude`">{{ $t("site.latitude") }}:</label>
              <b-form-input
                size="sm"
                id="latitude"
                v-model="site.latitude"
                :state="isNotEmpty(site.latitude)"
                type="number"
                step="0.000001"
                @input="handleCoordinateChange"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`longitude`">{{ $t("site.longitude") }}:</label>
              <b-form-input
                size="sm"
                id="longitude"
                v-model="site.longitude"
                :state="isNotEmpty(site.longitude)"
                type="number"
                step="0.000001"
                @input="handleCoordinateChange"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`location_accuracy`"
                >{{ $t("site.location_accuracy") }}:</label
              >
              <b-form-input
                size="sm"
                id="location_accuracy"
                v-model="site.location_accuracy"
                type="number"
                min="0"
              ></b-form-input>
            </v-col>
          </v-row>

          <v-card
            class="d-flex flex-row justify-content-start mt-1 mx-3"
            flat
            tile
          >
            <v-card flat tile class="align-self-center mr-2">
              <v-switch
                v-model="showCollapseMap"
                hide-details
                id="map-switch"
                class="vuetify-switch my-1"
              ></v-switch>
            </v-card>

            <v-card flat tile class="align-self-center">
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

          <transition enter-active-class="animated fadeIn faster">
            <v-row no-gutters v-show="showCollapseMap" class="mt-2">
              <v-col cols="12" class="px-1">
                <map-component
                  v-if="showCollapseMap && !isLatitudeUndefinedInEditView"
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
            <v-col cols="12" md="4" class="px-1">
              <label :for="`elevation`">{{ $t("site.elevation") }}:</label>
              <b-form-input
                size="sm"
                id="elevation"
                v-model="site.elevation"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`elevation_accuracy`"
                >{{ $t("site.elevation_accuracy") }}:</label
              >
              <b-form-input
                size="sm"
                id="elevation_accuracy"
                v-model="site.elevation_accuracy"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`coord_det_method`"
                >{{ $t("site.coord_det_method") }}:</label
              >
              <vue-multiselect
                v-model="site.coord_det_method"
                id="coord_det_method"
                :options="autocomplete.coordMethod"
                track-by="id"
                class="high-z-index"
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

          <!-- EXTENT, DEPTH and LOCALITY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`extent`">{{ $t("site.extent") }}:</label>
              <b-form-input
                size="sm"
                id="extent"
                v-model="site.extent"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`depth`">{{ $t("site.depth") }}:</label>
              <b-form-input
                size="sm"
                id="depth"
                v-model="site.depth"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`locality`">{{ $t("site.locality") }}:</label>
              <vue-multiselect
                v-model="site.locality"
                id="locality"
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
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong>
                    {{
                      $i18n.locale === "ee"
                        ? option.locality
                        : option.locality_en
                    }}</strong
                  ></template
                >
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- REMARKS_LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks_location`"
                >{{ $t("site.remarks_location") }}:</label
              >
              <editor :data.sync="site.remarks_location" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DESCRIPTION -->
    <v-card class="mt-2" id="block-description">
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters class="mb-2">
            <v-col cols="12" class="px-1">
              <editor :data.sync="site.description" />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <editor :data.sync="site.remarks" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- FILES -->
    <v-card class="mt-2" id="block-files" v-if="$route.meta.isEdit && site.id">
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
        <div v-show="block.files" class="px-1 pt-1 pb-2">
          <multimedia-component
            v-on:file-uploaded="addFiles"
            :recordOptions="true"
            style="margin-right: -10px; margin-left: -10px"
            class="multimedia-component"
          />
          <file-table
            :attachments="relatedData.attachment_link"
            :object="'site'"
            v-if="relatedData.attachment_link.length > 0"
          />
        </div>
      </transition>
    </v-card>

    <!-- SAMPLES -->
    <v-card class="mt-2" id="block-samples" v-if="$route.meta.isEdit && site.id">
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.samples = !block.samples">
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
        <div v-show="block.samples" class="px-1 pt-1 pb-2">
          <add-new-sample :sendingData="sendingData"></add-new-sample>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <v-btn
                class="mb-2"
                :to="{ name: 'Sample add', query: { site: JSON.stringify(site) }}"
                target="newSiteWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
              >{{ $t("add.new") }}</v-btn>
            </v-col>

            <linked-sample-table
              :siteID="$route.params.id"
              :samples="relatedData.sample"
              style="margin-right: -10px; margin-left: -10px"
            ></linked-sample-table>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Datepicker from "vue2-datepicker";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchSites,
  fetchSite,
  fetchListCoordinateMethod,
  fetchSiteAttachment,
  fetchLinkedSamples,
  fetchLastSiteName
} from "../../assets/js/api/apiCalls";
import MultimediaComponent from "../partial/MultimediaComponent";
import MapComponent from "../partial/MapComponent";
import FileTable from "../partial/FileTable";
import LinkedSampleTable from "../sample/LinkedSampleTable";
import AddNewSample from "./addNewSampleModal";
import sidebarMixin from "../../mixins/sidebarMixin";
import Editor from "../partial/editor/Editor";

export default {
  name: "Site",
  components: {
    Editor,
    AddNewSample,
    LinkedSampleTable,
    FileTable,
    MapComponent,
    MultimediaComponent,
    Datepicker,
    Spinner
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
    sidebarUserAction() {
      return this.$store.state["sidebarUserAction"];
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
      this.$set(this.site, "date_start", new Date());

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
  methods: {
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
        attachmentLinkSaved: -1,
        block: {
          info: !this.$route.meta.isEdit,
          location: this.$route.meta.isEdit,
          description: false,
          files: true,
          samples: true
        }
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
        this.loadRelatedData("sample");
      } else {
        // this.block.info = true
        // this.setLocationDataIfExists();
        // this.setSiteNameAndProjectIfPreviousExists();
        // this.loadListOfExistingProjects();
      }
      this.$root.$on(
        "add-or-edit-site-from-modal",
        this.handleUserChoiceFromModal
      );
    },

    setDefaultRalatedData() {
      return {
        attachment_link: [],
        sample: [],
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
        // New format!!! I believe it is better for future updates
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 25,
            orderBy: "-id"
          },
          sample: {
            page: 1,
            paginateBy: 25,
            orderBy: "-id"
          }
        }
      };
    },

    formatDataForUpload(objectToUpload, saveRelatedData = false) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.date_start))
        uploadableObject.date_start = this.formatDateForUpload(
          objectToUpload.date_start,
          false
        );
      if (this.isNotEmpty(objectToUpload.date_end))
        uploadableObject.date_end = this.formatDateForUpload(
          objectToUpload.date_end,
          false
        );

      if (this.isNotEmpty(objectToUpload.location_accuracy))
        uploadableObject.location_accuracy =
          typeof uploadableObject.location_accuracy === "string"
            ? parseFloat(objectToUpload.location_accuracy).toFixed(2)
            : objectToUpload.location_accuracy.toFixed(2);

      if (this.isNotEmpty(objectToUpload.project))
        uploadableObject.project = objectToUpload.project.id;
      if (this.isNotEmpty(objectToUpload.coord_det_method))
        uploadableObject.coord_det_method = objectToUpload.coord_det_method.id;
      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.latitude))
        uploadableObject.latitude = parseFloat(objectToUpload.latitude).toFixed(
          6
        );
      if (this.isNotEmpty(objectToUpload.longitude))
        uploadableObject.longitude = parseFloat(
          objectToUpload.longitude
        ).toFixed(6);

      if (saveRelatedData) {
        uploadableObject.related_data = {};
        uploadableObject.related_data.attachment = this.relatedData.attachment_link;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },
    fillAutocompleteFields(obj) {
      this.site.project = {
        name: obj.project__name,
        name_en: obj.project__name_en,
        id: obj.project
      };
      this.site.coord_det_method = {
        value: obj.coord_det_method__value,
        value_en: obj.coord_det_method__value_en,
        id: obj.coord_det_method
      };
      this.site.locality = {
        id: obj.locality__id,
        locality_en: obj.locality__locality_en,
        locality: obj.locality__locality
      };
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
        // Todo: update to so that it would use searchParameters object
        query = fetchSiteAttachment(
          this.$route.params.id,
          this.relatedData.page.attachment_link
        );
      } else if (object === "sample") {
        query = fetchLinkedSamples(
          this.relatedData.searchParameters.sample,
          this.$route.params.id
        );
      }
      return new Promise(resolve => {
        query.then(response => {
          this.relatedData.count[object] = response.body.count;
          this.relatedData[object] = this.handleResponse(response);
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

    fetchList(localStorageData) {
      let params =
        this.isNotEmpty(localStorageData) &&
        localStorageData !== "fallbackValue"
          ? localStorageData
          : this.searchParameters;
      return new Promise(resolve => {
        resolve(fetchSites(params));
      });
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

    setSiteName(projectId) {
      fetchLastSiteName(projectId).then(response => {
        if (response.body.results && response.body.results.length > 0) {
          let newName = this.calculateNextName(response.body.results[0].name);
          this.$set(this.site, "name", newName);
        }
      });
    },

    setSiteNameAndProjectIfPreviousExists() {
      return new Promise(resolve => {
        if (this.createRelationWith.data === null) resolve(false);
        let project = this.createRelationWith.data;
        fetchLastSiteName(project.id).then(response => {
          let resp = response.body.results;
          if (resp && resp.length > 0) {
            let newName = this.calculateNextName(resp[0].name);
            this.$set(this.site, "name", newName);
            this.$set(this.site, "date_start", new Date());
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
    }
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.reloadData();
      },
      deep: true
    },
    sidebarUserAction(newVal) {
      this.$_handleUserAction(newVal, "site", this.site);
    }
  }
};
</script>

<style scoped>
.tooltip .fade {
  background-color: red !important;
}

label {
  margin: 0;
  color: #546e7a;
  font-size: 0.8rem;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

/* Multiselect component size override */
.site >>> .multiselect {
  min-height: 31px;
  height: 31px;
}

.site >>> .multiselect__tags {
  min-height: 31px;
  height: 31px;
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
