<template>
  <div class="site">
    <!-- CONVERT TO LOCALITY -->
    <v-row v-if="$route.meta.isEdit">
      <v-col cols="12" class="text-right">
        <v-btn
          :color="bodyActiveColor"
          dark
          @click="$parent.$emit('button-clicked', 'COPY_TO_LOCALITY')"
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
            class="d-flex flex-row justify-start mb-1 mx-3"
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
                  lng: site.longitude ? site.longitude.toString() : null,
                }"
                v-on:update-coordinates="updateLocation"
              />
            </v-col>
          </v-row>

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
                :items="autocomplete.list_coordinate_method"
                :loading="autocomplete.loaders.list_coordinate_method"
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
          <div v-show="activeTab === 'attachment_link'">
            <file-input
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
              class="d-flex flex-row justify-start mb-3"
              flat
              tile
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-card flat tile class="mx-1">
                <v-btn
                  :to="{
                    name: 'Sample add',
                    query: { site: JSON.stringify(site) },
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

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-2">
      <v-col>
        <checkbox-wrapper
          v-model="site.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="site.is_private = !site.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import { fetchLastSiteName, postRequest } from "@/assets/js/api/apiCalls";
import MapComponent from "@/components/partial/MapComponent";
import sidebarMixin from "@/mixins/sidebarMixin";
import SampleTable from "@/components/sample/SampleTable";
import ExportButtons from "@/components/partial/export/ExportButtons";
import debounce from "lodash/debounce";
import { mapActions, mapGetters, mapState } from "vuex";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import SiteLocalityDescriptionTable from "@/components/site/relatedTables/SiteLocalityDescriptionTable";
import SiteLocalityReferenceTable from "@/components/site/relatedTables/SiteLocalityReferenceTable";
import toastMixin from "@/mixins/toastMixin";
import Pagination from "@/components/partial/Pagination";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Site",
  components: {
    CheckboxWrapper,
    Pagination,
    SiteLocalityReferenceTable,
    SiteLocalityDescriptionTable,
    FileInput,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    SampleTable,
    MapComponent,
    ExportButtons,
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
  },
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    sidebarMixin,
    toastMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],
  data() {
    return this.setInitialData();
  },
  computed: {
    ...mapState("search", ["sidebarUserAction", "activeProject"]),

    ...mapState("map", ["showMap"]),

    ...mapGetters("user", ["isUserAllowedTo"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },
  },
  created() {
    // USED BY SIDEBAR
    if (!this.$route.meta.isEdit) {
      // Add view
      this.$set(this.site, "date_start", this.getCurrentFormattedDate());

      if (this.activeProject) {
        this.site.project = {
          id: this.activeProject.id,
          name: this.activeProject.name,
          name_en: this.activeProject.name_en,
        };
        this.setSiteName(this.site.project.id);
      }

      // Getting project (only from project view when user presses 'add site button' in detail view or in sidebar)
      if (this.$route.query.project) {
        const dataFromProject = JSON.parse(this.$route.query.project);

        this.site.project = {
          id: dataFromProject.id,
          name: dataFromProject.name,
          name_en: dataFromProject.name_en,
        };
        this.autocomplete.project.push(this.site.project);
        this.setSiteName(dataFromProject.id);
      }
      if (this.$route.query.area) {
        const dataFromArea = JSON.parse(this.$route.query.area);

        this.site.area = {
          id: dataFromArea.id,
          name: dataFromArea.name,
          name_en: dataFromArea.name_en,
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
    sidebarUserAction(newVal) {
      this.handleUserAction(newVal, "site", this.site);
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

        Object.keys(uploadableObject).forEach((key) => {
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
          .then((response) => {
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
          .catch((err) => {
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
          object: this.$route.meta.object,
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
          { name: "locality_reference", iconClass: "fas fa-book" },
        ],
        activeTab: "attachment_link",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["list_coordinate_method", "site_type"],
        autocomplete: {
          loaders: {
            project: false,
            attachment: false,
            list_coordinate_method: false,
            locality: false,
            area: false,
            site_type: false,
          },
          project: [],
          attachment: [],
          list_coordinate_method: [],
          locality: [],
          area: [],
          site_type: [],
        },
        requiredFields: ["latitude", "longitude"],
        site: {
          id: null,
          name: null,
          name_en: null,
          site_type: null,
          number: null,
          project: null,
          date_start: null,
          date_end: null,
          date_free: null,
          coord_det_method: null,
          locality: null,
          coordx: null,
          coordy: null,
          epsg: null,
          latitude: null,
          longitude: null,
          location_accuracy: null,
          elevation: null,
          elevation_accuracy: null,
          extent: null,
          depth: null,
          remarks_location: null,
          description: null,
          remarks: null,
          area: null,
          is_private: null,
        },
        site_groundwater: {
          id: null,
          site: null,
          aquifer_system: null,
          aquifer: null,
          well_depth: null,
          type_txt: null,
          filter_type: null,
          filter_top: null,
          filter_top_z: null,
          filter_bottom: null,
          filter_bottom_z: null,
          url_veka: null,
          remarks: null,
          kataster_id: null,
          keskkonnaregister_id: null,
        },
        block: {
          info: !this.$route.meta.isEdit,
          location: this.$route.meta.isEdit,
          description: false,
          groundwater: false,
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
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    setDefaultRelatedData() {
      return {
        attachment_link: {
          count: 0,
          results: [],
        },
        samples: {
          count: 0,
          results: [],
        },
        locality_description: {
          count: 0,
          results: [],
        },
        locality_reference: {
          count: 0,
          results: [],
        },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 25,
            orderBy: "-id",
          },
          samples: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true],
          },
          locality_description: {
            page: 1,
            paginateBy: 25,
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
          value_en: "GPS",
        };
      } else {
        this.site.location_accuracy = null;
        this.site.coord_det_method = null;
      }
    },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, "site", singleFileMetadata);
    },

    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },

    setSiteName(projectId) {
      fetchLastSiteName(projectId).then((response) => {
        if (response.data.results && response.data.results.length > 0) {
          let newName = this.calculateNextName(response.data.results[0].name);
          this.site.name = newName;
        }
      });
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
  },
};
</script>

<style scoped>
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
