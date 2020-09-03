<template>
  <div class="site">
    <!-- CONVERT TO LOCALITY -->
    <v-row v-if="$route.meta.isEdit">
      <v-col cols="12" class="text-right">
        <v-btn
          :color="bodyActiveColor"
          dark
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
          <span>{{ $t("common.generalInfo") }}</span>
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
          <!-- NAME, NAME_EN, NUMBER and TYPE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site.number"
                :color="bodyActiveColor"
                :label="$t('common.number')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="site.site_type"
                :color="bodyActiveColor"
                :items="autocomplete.site_type"
                :loading="autocomplete.loaders.site_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>
          </v-row>

          <!-- DATE_START, DATE_END and DATE_FREE -->
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

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.date_free"
                :color="bodyActiveColor"
                :label="$t('site.date_free')"
              />
            </v-col>
          </v-row>

          <!-- AREA and PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="site.area"
                :color="bodyActiveColor"
                :items="autocomplete.area"
                :loading="autocomplete.loaders.area"
                :item-text="nameLabel"
                :label="$t('site.area')"
                is-link
                route-object="area"
                is-searchable
                v-on:search:items="autocompleteAreaSearch"
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
                v-model="myShowMap"
                hide-details
                id="map-switch"
                class="vuetify-switch my-1"
              />
            </v-card>

            <v-card
              flat
              tile
              class="align-self-center"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <label class="m-0" :for="`map-switch`">
                <i class="far fa-map" />
                {{ myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled") }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <transition enter-active-class="animated fadeIn faster">
            <v-row no-gutters v-show="myShowMap" class="mt-1">
              <v-col cols="12" class="pa-1">
                <map-component
                  :show-map="myShowMap && block.location"
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
                :label="$t('common.depth')"
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

          <!-- COORDX, COORDY and EPSG -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.coordx"
                :color="bodyActiveColor"
                :label="$t('site.coordx')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.coordy"
                :color="bodyActiveColor"
                :label="$t('site.coordy')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site.epsg"
                :color="bodyActiveColor"
                :label="$t('site.epsg')"
                type="number"
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
          <span
            >{{ $t("common.description") }} | {{ $t("common.remarks") }}</span
          >
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer />
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
                :label="$t('common.description')"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="site.remarks"
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
          <div v-show="activeTab === 'attachment_link'">
            <file-upload
              show-existing
              :record-options="$route.meta.isEdit"
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />
          </div>

          <div v-show="activeTab === 'samples'" class="pa-1">
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

              <v-card
                flat
                tile
                class="mx-1"
                v-if="relatedData.samples.count > 0"
              >
                <export-buttons
                  filename="sample"
                  :table-data="relatedData.samples.results"
                  clipboard-class="sample-table"
                  :body-active-color="bodyActiveColor"
                />
              </v-card>
            </v-card>

            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <sample-table
                  ref="table"
                  :response="relatedData.samples"
                  :search-parameters="relatedData.searchParameters.samples"
                  v-if="relatedData.samples.count > 0"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                  v-on:update:sorting="
                    relatedData.searchParameters[activeTab][$event.key] =
                      $event.value
                  "
                />
              </v-col>
            </v-row>
          </div>

          <site-locality-description-table
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

          <site-locality-reference-table
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

    <!-- SITE_GROUNDWATER -->
    <v-card
      v-if="$route.meta.isEdit && isUserAllowedTo('add', 'site_groundwater')"
      class="mt-2"
      id="block-groundwater"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.groundwater = !block.groundwater"
        >
          <span>{{ $t("site.groundwater") }}</span>
          <v-icon right>fas fa-water</v-icon>
        </div>
        <v-spacer />
        <v-btn
          icon
          @click="block.groundwater = !block.groundwater"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.groundwater ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.groundwater" class="pa-1">
          <!-- TYPE_TXT, AQUIFER_STSTEM and AQUIFER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.type_txt"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.type_txt')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.aquifer_system"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.aquifer_system')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.aquifer"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.aquifer')"
              />
            </v-col>
          </v-row>

          <!-- WELL_DEPTH and FILTER_TYPE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.well_depth"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.well_depth')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_type"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_type')"
              />
            </v-col>
          </v-row>

          <!-- FILTER_TOP, FILTER_BOTTOM, FILTER_TOP_Z, FILTER_BOTTOM_Z -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_top"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_top')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_bottom"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_bottom')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_top_z"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_top_z')"
                type="number"
                step="0.01"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.filter_bottom_z"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.filter_bottom_z')"
                type="number"
                step="0.01"
              />
            </v-col>
          </v-row>

          <!-- KATASTER_ID, KESKONNAREGISTER_ID and URL_VEKA -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.kataster_id"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.kataster_id')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.keskkonnaregister_id"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.keskkonnaregister_id')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.url_veka"
                :color="bodyActiveColor"
                :label="$t('site_groundwater.url_veka')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="site_groundwater.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- SAVE GROUNDWATER DATA -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <v-btn
                :color="!isNotEmpty(this.site_groundwater) ? 'red' : 'green'"
                dark
                @click="saveGroundwater"
                :title="$t('site_groundwater.save')"
                retain-focus-on-click
                :small="$vuetify.breakpoint.smAndDown"
                class="text-none"
              >
                <v-icon :small="$vuetify.breakpoint.smAndDown" left
                  >fas fa-save</v-icon
                >
                <span>{{ $t("site_groundwater.save") }}</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchSite,
  fetchListCoordinateMethod,
  fetchSiteAttachment,
  fetchLinkedSamples,
  fetchLastSiteName,
  fetchSiteLocalityDescriptions,
  fetchSiteLocalityReferences,
  fetchSiteGroundwaterUsingSite,
  postRequest,
  fetchListSiteType
} from "../../assets/js/api/apiCalls";
import MapComponent from "../partial/MapComponent";
import sidebarMixin from "../../mixins/sidebarMixin";
import SampleTable from "../sample/SampleTable";
import ExportButtons from "../partial/export/ExportButtons";
import debounce from "lodash/debounce";
import { mapActions, mapGetters, mapState } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import FileUpload from "../partial/inputs/FileInput";
import requestsMixin from "../../mixins/requestsMixin";
import SiteLocalityDescriptionTable from "./relatedTables/SiteLocalityDescriptionTable";
import SiteLocalityReferenceTable from "./relatedTables/SiteLocalityReferenceTable";

export default {
  name: "Site",
  components: {
    SiteLocalityReferenceTable,
    SiteLocalityDescriptionTable,
    FileUpload,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    SampleTable,
    MapComponent,
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
    sidebarMixin,
    requestsMixin
  ],
  data() {
    return this.setInitialData();
  },
  computed: {
    ...mapState("search", [
      "siteSearchParameters",
      "sidebarUserAction",
      "activeProject"
    ]),

    ...mapState("map", ["showMap"]),

    ...mapGetters("user", ["isUserAllowedTo"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      }
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
      this.setActiveSearchParameters({
        search: this.siteSearchParameters,
        request: "FETCH_SITES",
        title: "header.sites",
        object: "site",
        field: "name"
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

      // Getting project (only from project view when user presses 'add site button' in detail view or in sidebar)
      if (this.$route.query.project) {
        const dataFromProject = JSON.parse(this.$route.query.project);

        this.site.project = {
          id: dataFromProject.id,
          name: dataFromProject.name,
          name_en: dataFromProject.name_en
        };
        this.autocomplete.project.push(this.site.project);
        this.setSiteName(dataFromProject.id);
      }
      if (this.$route.query.area) {
        const dataFromArea = JSON.parse(this.$route.query.area);

        this.site.area = {
          id: dataFromArea.id,
          name: dataFromArea.name,
          name_en: dataFromArea.name_en
        };
        this.autocomplete.area.push(this.site.area);
      }
    }

    this.loadFullInfo();
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.meta.isEdit) {
      this.setActiveSite(this.site);
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
    "relatedData.searchParameters": {
      handler: function() {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["setActiveSite", "updateActiveTab"]),
    ...mapActions("map", ["updateShowMap"]),

    saveGroundwater() {
      if (this.isNotEmpty(this.site_groundwater)) {
        let uploadableObject = cloneDeep(this.site_groundwater);

        if (this.$route.params.id)
          uploadableObject.site = this.$route.params.id;

        let url = "";
        if (uploadableObject.id) {
          url = "change/site_groundwater/" + uploadableObject.id;
        } else url = "add/site_groundwater/";

        delete uploadableObject.id;

        Object.keys(uploadableObject).forEach(key => {
          if (typeof uploadableObject[key] === "undefined")
            uploadableObject[key] = null;
          else if (
            typeof uploadableObject[key] === "string" &&
            uploadableObject[key].length === 0
          ) {
            uploadableObject[key] = null;
          }
        });

        let formData = new FormData();
        formData.append("data", JSON.stringify(uploadableObject));

        postRequest(url, formData)
          .then(response => {
            if (response.status === 200) {
              if (response.data) {
                if (response.data.error) {
                  this.toastError({ text: response.data.error });
                } else {
                  if (this.$i18n.locale === "ee") {
                    this.toastSuccess({ text: response.data.message_et });
                  } else {
                    this.toastSuccess({ text: response.data.message });
                  }
                }
              }
            }
          })
          .catch(err => {
            this.toastError({ text: this.$t("messages.uploadError") });
          });
      } else {
        this.toastInfo({ text: this.$t("site_groundwater.dataMissing") });
      }
    },

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "samples", iconClass: "fas fa-vial" },
          { name: "locality_description", iconClass: "fas fa-align-left" },
          { name: "locality_reference", iconClass: "fas fa-book" }
        ],
        activeTab: "attachment_link",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "name",
          "name_en",
          "site_type",
          "number",
          "project",
          "date_start",
          "date_end",
          "date_free",
          "coord_det_method",
          "locality",
          "coordx",
          "coordy",
          "epsg",
          "latitude",
          "longitude",
          "location_accuracy",
          "elevation",
          "elevation_accuracy",
          "extent",
          "depth",
          "remarks_location",
          "description",
          "remarks",
          "area"
        ],
        siteGroundwaterCopyFields: [
          "id",
          "site",
          "aquifer_system",
          "aquifer",
          "well_depth",
          "type_txt",
          "filter_type",
          "filter_top",
          "filter_top_z",
          "filter_bottom",
          "filter_bottom_z",
          "url_veka",
          "remarks",
          "kataster_id",
          "keskkonnaregister_id"
        ],
        autocomplete: {
          loaders: {
            project: false,
            attachment: false,
            coordMethod: false,
            locality: false,
            area: false,
            site_type: false
          },
          project: [],
          attachment: [],
          coordMethod: [],
          locality: [],
          area: [],
          site_type: []
        },
        requiredFields: ["latitude", "longitude"],
        site: {},
        site_groundwater: {},
        block: {
          info: !this.$route.meta.isEdit,
          location: this.$route.meta.isEdit,
          description: false,
          groundwater: false
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

      fetchListSiteType().then(response => {
        this.autocomplete.site_type = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.$emit("set-object", "site");

        fetchSite(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "site", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.site);
            this.removeUnnecessaryFields(this.site, this.copyFields);

            this.updateDateFields(this.site);

            this.$emit("data-loaded", this.site);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        fetchSiteGroundwaterUsingSite(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$set(
              this,
              "site_groundwater",
              this.handleResponse(response)[0]
            );
            this.removeUnnecessaryFields(
              this.site_groundwater,
              this.siteGroundwaterCopyFields
            );
          }
        });

        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRelatedData() {
      return {
        attachment_link: {
          count: 0,
          results: []
        },
        samples: {
          count: 0,
          results: []
        },
        locality_description: {
          count: 0,
          results: []
        },
        locality_reference: {
          count: 0,
          results: []
        },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 25,
            orderBy: "-id"
          },
          samples: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          locality_description: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          locality_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["reference"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(uploadableObject.date_start)) {
        if (this.isValidDateTime(uploadableObject.date_start)) {
          uploadableObject.date_start = this.formatDateForUpload(
            uploadableObject.date_start
          );
        } else {
          this.site.date_start = null;
          uploadableObject.date_start = null;
          this.toastInfo({ text: "Field 'Date start' is invalid" });
        }
      }
      if (this.isNotEmpty(uploadableObject.date_end)) {
        if (this.isValidDateTime(uploadableObject.date_end)) {
          uploadableObject.date_end = this.formatDateForUpload(
            uploadableObject.date_end
          );
        } else {
          this.site.date_end = null;
          uploadableObject.date_end = null;
          this.toastInfo({ text: "Field 'Date end' is invalid" });
        }
      }

      if (this.isNotEmpty(objectToUpload.location_accuracy))
        uploadableObject.location_accuracy =
          typeof uploadableObject.location_accuracy === "string"
            ? parseFloat(objectToUpload.location_accuracy).toFixed(2)
            : objectToUpload.location_accuracy.toFixed(2);
      else uploadableObject.location_accuracy = null;

      if (this.isNotEmpty(objectToUpload.elevation_accuracy))
        uploadableObject.elevation_accuracy =
          typeof uploadableObject.elevation_accuracy === "string"
            ? parseFloat(objectToUpload.elevation_accuracy).toFixed(2)
            : objectToUpload.elevation_accuracy.toFixed(2);
      else uploadableObject.elevation_accuracy = null;

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

      // Adding related data only on add view
      uploadableObject.related_data = {};
      if (!this.$route.meta.isEdit) {
        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name !== "samples") {
              if (tab.name === "attachment_link") {
                uploadableObject.related_data.attachment = this.relatedData.attachment_link.results.map(
                  item => {
                    return { id: item.id };
                  }
                );
              } else {
                uploadableObject.related_data[tab.name] = this.relatedData[
                  tab.name
                ].results;

                uploadableObject.related_data[tab.name].forEach(item => {
                  Object.keys(item).forEach(key => {
                    if (typeof item[key] === "object" && item[key] !== null) {
                      item[key] = item[key].id ? item[key].id : null;
                    }
                  });
                });
              }
            }
        });
      } else {
        if (this.relatedData.attachment_link.results.length > 0) {
          uploadableObject.related_data.attachment = this.relatedData.attachment_link.results.map(
            item => {
              return { id: item.id };
            }
          );
        } else uploadableObject.related_data.attachment = null;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.area)) {
        this.site.area = {
          name: obj.area__name,
          name_en: obj.area__name_en,
          id: obj.area
        };
        this.autocomplete.area.push(this.site.area);
      }
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
      this.site.site_type = {
        value: obj.site_type__value,
        value_en: obj.site_type__value_en,
        id: obj.site_type
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

    loadRelatedData(object) {
      let query;

      if (object === "attachment_link") {
        query = fetchSiteAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (object === "samples") {
        query = fetchLinkedSamples(
          this.relatedData.searchParameters.samples,
          this.$route.params.id
        );
      } else if (object === "locality_description") {
        query = fetchSiteLocalityDescriptions(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_description
        );
      } else if (object === "locality_reference") {
        query = fetchSiteLocalityReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.locality_reference
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    customLabelForAttachment(option) {
      return this.$i18n.locale === "ee"
        ? `${option.id} - (${option.description}) (${option.author__agent})`
        : `${option.id} - (${option.description_en}) (${option.author__agent})`;
    },

    updateLocation(location, method, GPSPosition) {
      this.site.latitude = location.lat.toFixed(6);
      this.site.longitude = location.lng.toFixed(6);

      // If user chooses coordinates from map by clicking or dragging the marker then reset gps accuracy and coord_det_method
      if (method === "GPS") {
        this.site.location_accuracy = GPSPosition.coords.accuracy;
        this.site.coord_det_method = {
          id: 6,
          value: "GPS",
          value_en: "GPS"
        };
      } else {
        this.site.location_accuracy = null;
        this.site.coord_det_method = null;
      }
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "site", singleFileMetadata);
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },

    setSiteName(projectId) {
      fetchLastSiteName(projectId).then(response => {
        if (response.data.results && response.data.results.length > 0) {
          let newName = this.calculateNextName(response.data.results[0].name);
          this.site.name = newName;
        }
      });
    },

    handleUserChoiceFromModal(choice) {
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

    updateDateFields(site) {
      site.date_start = this.unformatISOStringToDate(site.date_start);
      site.date_end = this.unformatISOStringToDate(site.date_end);
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
    50)
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
