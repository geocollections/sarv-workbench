<template>
  <div class="location">
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
          <span :class="validate('location') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('location') ? 'green--text' : 'red--text'"
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
          <!-- LOCATION and LOCATION_LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="location.location"
                :color="bodyActiveColor"
                :label="$t('location.location')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="location.location_location"
                :color="bodyActiveColor"
                :label="$t('location.location_location')"
              />
            </v-col>
          </v-row>

          <!-- DATE_COLLECTED_FREE and STRATIGRAPHY_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="location.date_collected_free"
                :color="bodyActiveColor"
                :label="$t('location.date_collected_free')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="location.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('common.stratigraphy')"
              />
            </v-col>
          </v-row>

          <!-- AGENT and NUMBER_ITEMS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="location.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('common.author')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="location.number_items"
                :color="bodyActiveColor"
                :label="$t('location.number_items')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- CONTENTS and REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="location.contents"
                :color="bodyActiveColor"
                :label="$t('location.contents')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="location.remarks"
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
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchLocation } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import Spinner from "vue-simple-spinner";

export default {
  name: "Location",

  components: { TextareaWrapper, AutocompleteWrapper, InputWrapper, Spinner },

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
      // let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "locationSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_LOCATIONS",
        title: "header.locations",
        object: "location",
        field: "location",
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
    }
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "locationSearchHistory",
        copyFields: [
          "id",
          "location",
          "location_location",
          "date_collected_free",
          "stratigraphy_free",
          "agent",
          "number_items",
          "contents",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            agent: false
          },
          agent: []
        },
        location: {},
        requiredFields: ["location"],
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
        fetchLocation(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "location", this.handleResponse(response)[0]);
            // this.location = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.location);
            this.removeUnnecessaryFields(this.location, this.copyFields);

            this.$emit("data-loaded", this.location);
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
      if (this.isNotEmpty(obj.agent)) {
        this.location.agent = {
          id: obj.agent,
          agent: obj.agent__agent
        };
        this.autocomplete.agent.push(this.location.agent);
      }
    },

    setDefaultSearchParameters() {
      return {
        location: null,
        location_location: null,
        stratigraphy_free: null,
        agent: null,
        user_added: null,
        date_added: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
