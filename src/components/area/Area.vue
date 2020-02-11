<template>
  <div class="area">
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

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="area.description"
                :label="$t('common.description')"
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

    <!-- SITES -->
    <v-card
      class="mt-2"
      id="block-sites"
      v-if="$route.meta.isEdit"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.sites = !block.sites">
          <span>{{ $t("project.sites") }}</span>
          <v-icon right>fas fa-globe-americas</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.sites = !block.sites"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.sites ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.sites" class="px-1 pt-1 pb-2">
          <!-- MAP SWITCH -->
          <v-card
            class="d-flex flex-row justify-content-start mt-1 mx-3"
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
            <v-row no-gutters v-show="showMap" class="mt-2">
              <v-col cols="12" class="px-1">
                <map-component
                  :show-map="showMap && block.sites"
                  :gps-coords="true"
                  mode="multiple"
                  module="area"
                  v-bind:location="{ lat: null, lng: null }"
                  :locations="relatedData.sites.results"
                />
              </v-col>
            </v-row>
          </transition>

          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-content-start mt-2 mb-3"
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
                  query: { area: JSON.stringify(area) }
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

          <!-- PAGINATION -->
          <div
            v-if="relatedData.sites.count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters.sites.paginateBy"
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
                v-model="relatedData.searchParameters.sites.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.sites.count /
                      relatedData.searchParameters.sites.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

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
      </transition>
    </v-card>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import {
  fetchArea,
  fetchLinkedAreaSites,
  fetchListAreaTypes,
  fetchListMaakond
} from "../../assets/js/api/apiCalls";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import Editor from "../partial/inputs/Editor";
import MapComponent from "../partial/MapComponent";
import ExportButtons from "../partial/export/ExportButtons";
import debounce from "lodash/debounce";
import { mapState } from "vuex";
import SiteTable from "../site/SiteTable";
export default {
  name: "Area",

  components: {
    SiteTable,
    ExportButtons,
    MapComponent,
    Editor,
    TextareaWrapper,
    InputWrapper,
    AutocompleteWrapper,
    Spinner
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
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

  mixins: [formManipulation, autocompleteMixin],

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
        searchHistory && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "areaSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_AREAS",
        title: "header.areas",
        object: "area",
        field: "name",
        databaseId: this.databaseId,
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  computed: {
    ...mapState(["mapSettings"]),

    showMap: {
      get() {
        return this.mapSettings.showMap;
      },
      set(value) {
        this.$store.dispatch("updateMapState", value);
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

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters.sites": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(newVal, this.fetchLinkedSiteWrapper, "sites");
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    fetchLinkedSiteWrapper() {
      return new Promise(resolve => {
        resolve(
          fetchLinkedAreaSites(
            this.relatedData.searchParameters.sites,
            this.$route.params.id
          )
        );
      });
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
    50),

    setInitialData() {
      return {
        searchHistory: "areaSearchHistory",
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
          "remarks"
          // "polygon"
        ],
        autocomplete: {
          loaders: {
            area_type: false,
            maakond: false
          },
          language: [],
          area_type: [],
          maakond: []
        },
        requiredFields: ["name"],
        area: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          sites: true
        },
        relatedData: this.setDefaultRalatedData(),
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
      fetchListAreaTypes().then(response => {
        this.autocomplete.area_type = this.handleResponse(response);
      });

      fetchListMaakond().then(response => {
        this.autocomplete.maakond = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        fetchArea(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "area", this.handleResponse(response)[0]);
            // this.area = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.area);
            this.removeUnnecessaryFields(this.area, this.copyFields);

            this.$emit("data-loaded", this.area);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRalatedData() {
      return {
        sites: {
          count: 0,
          results: []
        },
        searchParameters: {
          sites: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

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

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.area.area_type = {
        id: obj.area_type,
        name: obj.area_type__name,
        name_en: obj.area_type__name_en
      };
      this.area.maakond = {
        id: obj.maakond,
        maakond: obj.maakond__maakond,
        maakond_en: obj.maakond__maakond_en
      };
    },

    setDefaultSearchParameters() {
      return {
        name: null,
        type: null,
        area_ha: null,
        maakond: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["name"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped />
