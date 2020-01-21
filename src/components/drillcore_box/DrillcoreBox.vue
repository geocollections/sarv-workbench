<template>
  <div class="drillcoreBox">
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
          <span
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
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
          <!-- DRILLCORE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.drillcore"
                :color="bodyActiveColor"
                :items="autocomplete.drillcore"
                :loading="autocomplete.loaders.drillcore"
                :item-text="drillcoreLabel"
                :label="$t('drillcore.drillcore')"
                is-link
                route-object="drillcore"
                is-searchable
                v-on:search:items="autocompleteDrillcoreSearch"
                use-state
              />
            </v-col>
          </v-row>

          <!-- NUMBER, NUMBER_METERS, DIAMETER and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number_meters"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number_meters')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.diameter"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.diameter')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_START, STRATIGRAPHY_BASE and STRATIGRAPHY_BASE_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_start"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_start')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_base')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_base_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_base_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_END, STRATIGRAPHY_TOP and STRATIGRAPHY_TOP_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_end"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_end')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_top')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_top_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_top_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_OTHER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.depth_other"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_other')"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_FREE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_free')"
              />
            </v-col>
          </v-row>

          <!-- LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.location"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.location')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
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
import { fetchDrillcoreBox } from "../../assets/js/api/apiCalls";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";

export default {
  name: "DrillcoreBox",

  components: {
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
        searchHistory: "drillcoreBoxSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DRILLCORE_BOXES",
        title: "header.drillcoreBoxes",
        object: "drillcore_box",
        field: "number",
        databaseId: this.databaseId,
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    }
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "drillcoreBoxSearchHistory",
        copyFields: [
          "id",
          "drillcore",
          "number",
          "number_meters",
          "diameter",
          "storage",
          "depth_start",
          "stratigraphy_base",
          "stratigraphy_base_free",
          "depth_end",
          "stratigraphy_top",
          "stratigraphy_top_free",
          "depth_other",
          "stratigraphy_free",
          "location",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            drillcore: false,
            storage: false,
            stratigraphy_base: false,
            stratigraphy_top: false
          },
          drillcore: [],
          storage: [],
          stratigraphy_base: [],
          stratigraphy_top: []
        },
        requiredFields: ["drillcore", "number"],
        drillcore_box: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        }
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        fetchDrillcoreBox(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.drillcore_box = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.drillcore_box);
            this.removeUnnecessaryFields(this.drillcore_box, this.copyFields);

            this.$emit("data-loaded", this.drillcore_box);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
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
      if (this.isNotEmpty(obj.drillcore)) {
        this.drillcore_box.drillcore = {
          drillcore: obj.drillcore__drillcore,
          drillcore_en: obj.drillcore__drillcore_en,
          id: obj.drillcore
        };
        this.autocomplete.drillcore.push(this.drillcore_box.drillcore);
      }
      if (this.isNotEmpty(obj.storage)) {
        this.drillcore_box.storage = {
          id: obj.storage,
          location: obj.storage__location
        };
        this.autocomplete.storage.push(this.drillcore_box.storage);
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        this.drillcore_box.stratigraphy_top = {
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en,
          id: obj.stratigraphy_top
        };
        this.autocomplete.stratigraphy_top.push(
          this.drillcore_box.stratigraphy_top
        );
      }
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        this.drillcore_box.stratigraphy_base = {
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en,
          id: obj.stratigraphy_base
        };
        this.autocomplete.stratigraphy_base.push(
          this.drillcore_box.stratigraphy_base
        );
      }
    },

    setDefaultSearchParameters() {
      return {
        storage: null,
        drillcore: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["drillcore"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped />
