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
                :items="autocomplete.list_maakond"
                :loading="autocomplete.loaders.list_maakond"
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
          <div v-if="activeTab === 'site'">
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
                  :show-map="myShowMap && block.site"
                  :gps-coords="true"
                  mode="multiple"
                  module="area"
                  v-bind:location="{ lat: null, lng: null }"
                  :locations="relatedData.site.results"
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
                  :table-data="relatedData.site.results"
                ></export-buttons>
              </v-card>
            </v-card>

            <v-row no-gutters v-if="relatedData.site.count > 0">
              <v-col cols="12" class="px-1">
                <site-table
                  :response="relatedData.site"
                  :search-parameters="relatedData.searchParameters.site"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                  :headers="siteTranslatedHeaders"
                  @update:options="handleUpdateOptions({...$event, activeTab: 'site'})"
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
            v-if="$route.meta.isEdit && activeTab !== 'site' && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :items-per-page="relatedData.searchParameters[activeTab].itemsPerPage"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
        </v-card>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import Editor from "@/components/partial/inputs/Editor";
import MapComponent from "@/components/partial/MapComponent";
import ExportButtons from "@/components/partial/export/ExportButtons";
import { mapActions, mapState } from "vuex";
import SiteTable from "@/components/site/SiteTable";
import AreaLocalityReferenceTable from "@/components/area/relatedTables/AreaLocalityReferenceTable";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  computed: {
    ...mapState("map", ["showMap"]),
    ...mapState({
      siteHeaders(state) {
        return state.site.headers;
      },
    }),

    siteTranslatedHeaders() {
      return this.siteHeaders.map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        };
      });
    },

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },

    computedRelatedTabs() {
      return this.relatedTabs.filter((tab) => tab.name !== "site");
    },
  },

  methods: {
    ...mapActions("map", ["updateShowMap"]),
    ...mapActions("search", ["updateActiveTab"]),

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
          { name: "site", iconClass: "fas fa-globe-americas" },
          { name: "locality_reference", iconClass: "fas fa-book" },
        ],
        activeTab: "site",
        listOfAutocompleteTables: ["area_type", "list_maakond"],
        autocomplete: {
          loaders: {
            area_type: false,
            list_maakond: false,
          },
          language: [],
          area_type: [],
          list_maakond: [],
        },
        requiredFields: ["name"],
        area: {
          id: null,
          name: null,
          name_en: null,
          area_type: null,
          maardla: null,
          eelis: null,
          egf: null,
          area_ha: null,
          deposit_area_ha: null,
          maakond: null,
          description: null,
          description_en: null,
          remarks: null,
        },
        block: {
          info: true,
          site: true,
        },
        relatedData: this.setDefaultRelatedData(),
      };
    },

    setDefaultRelatedData() {
      return {
        site: {
          count: 0,
          results: [],
        },
        locality_reference: {
          count: 0,
          results: [],
        },
        searchParameters: {
          site: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
          locality_reference: {
            page: 1,
            itemsPerPage: 25,
            sortBy: ["reference"],
            sortDesc: [true],
          },
        },
      };
    },
  },
};
</script>
