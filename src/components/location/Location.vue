<template>
  <div class="location">
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
          <!-- LOCATION, PARENT_LOCATION, NUMBER_ITEMS and NUMBER_ITEMS_REGISTERED -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.location"
                :color="bodyActiveColor"
                :label="$t('location.location')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="location.parent_location"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('location.location_location')"
                is-link
                route-object="location"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.number_items"
                :color="bodyActiveColor"
                :label="$t('location.number_items')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.number_items_registered"
                :color="bodyActiveColor"
                :label="$t('location.number_items_registered')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- AUTHOR, STRATIGRAPHY_FREE and DATE_COLLECTED_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
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

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="location.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('common.stratigraphy')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="location.date_collected_free"
                :color="bodyActiveColor"
                :label="$t('location.date_collected_free')"
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
import { mapState } from "vuex";

export default {
  name: "Location",

  components: { TextareaWrapper, AutocompleteWrapper, InputWrapper },

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
      this.setActiveSearchParameters({
        search: this.locationSearchParameters,
        request: "FETCH_LOCATIONS",
        title: "header.locations",
        object: "location",
        field: "location"
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

  computed: {
    ...mapState("search", ["locationSearchParameters"])
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "locationSearchHistory",
        copyFields: [
          "id",
          "location",
          "parent_location",
          "number_items",
          "number_items_registered",
          "agent",
          "stratigraphy_free",
          "date_collected_free",
          "contents",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            storage: false
          },
          agent: [],
          storage: []
        },
        location: {},
        requiredFields: ["location"],
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
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchLocation(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "location", this.handleResponse(response)[0]);
            // this.location = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.location);
            this.removeUnnecessaryFields(this.location, this.copyFields);

            this.$emit("data-loaded", this.location);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
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
      if (this.isNotEmpty(obj.parent_location)) {
        this.location.parent_location = {
          id: obj.parent_location,
          location: obj.parent_location__location
        };
        this.autocomplete.storage.push(this.location.parent_location);
      }
    }
  }
};
</script>

<style scoped></style>
