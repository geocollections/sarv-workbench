<template>
  <div class="visit">
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
            :class="validate('visit', 'visit') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('visit', 'visit') ? 'green--text' : 'red--text'"
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
          <!-- VISITOR and VISITOR_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="visit.visitor"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('visit.visitor')"
                use-custom-state
                :error="
                  !(isNotEmpty(visit.visitor) || isNotEmpty(visit.visitor_free))
                "
                :success="
                  isNotEmpty(visit.visitor) || isNotEmpty(visit.visitor_free)
                "
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="visit.visitor_free"
                :color="bodyActiveColor"
                :label="$t('visit.visitor_free')"
                use-custom-state
                :error="
                  !(isNotEmpty(visit.visitor) || isNotEmpty(visit.visitor_free))
                "
                :success="
                  isNotEmpty(visit.visitor) || isNotEmpty(visit.visitor_free)
                "
              />
            </v-col>
          </v-row>

          <!-- DATE_ARRIVED and DATE_LEFT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="visit.date_arrived"
                :color="bodyActiveColor"
                :label="$t('visit.date_arrived')"
                v-on:date:clear="visit.date_arrived = null"
                v-on:date:update="
                  updateUserInputtedDate('date_arrived', $event)
                "
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="visit.date_left"
                :color="bodyActiveColor"
                :label="$t('visit.date_left')"
                v-on:date:clear="visit.date_left = null"
                v-on:date:update="updateUserInputtedDate('date_left', $event)"
              />
            </v-col>
          </v-row>

          <!-- VISITOR_INSTITUTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="visit.visitor_institution"
                :color="bodyActiveColor"
                :items="autocomplete.institution"
                :loading="autocomplete.loaders.institution"
                item-text="agent"
                :label="$t('visit.visitor_institution')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteInstitutionSearch"
              />
            </v-col>
          </v-row>

          <!-- VISITOR_COUNTRY -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="visit.visitor_country"
                :color="bodyActiveColor"
                :items="autocomplete.list_country"
                :loading="autocomplete.loaders.list_country"
                :item-text="commonLabel"
                :label="$t('visit.visitor_country')"
              />
            </v-col>
          </v-row>

          <!-- HOST -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="visit.host"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('visit.host')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- PURPOSE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="visit.purpose"
                :color="bodyActiveColor"
                :label="$t('visit.purpose')"
              />
            </v-col>
          </v-row>

          <!-- COLLECTIONS_STUDIED and ITEMS_STUDIED -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="visit.collections_studied"
                :color="bodyActiveColor"
                :label="$t('visit.collections_studied')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="visit.items_studied"
                :color="bodyActiveColor"
                :label="$t('visit.items_studied')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="visit.remarks"
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
import {
  fetchListAgentType,
  fetchListCountry,
  fetchVisit,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

import DateWrapper from "../partial/inputs/DateWrapper";
import { mapState } from "vuex";

export default {
  name: "Visit",

  components: {
    DateWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
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

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.visitSearchParameters,
        request: "FETCH_VISITS",
        title: "header.visits",
        object: "visit",
        field: "visitor__agent",
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        this.reloadData();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", ["visitSearchParameters"]),
  },

  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "visitor",
          "visitor_free",
          "date_arrived",
          "date_left",
          "visitor_institution",
          "visitor_country",
          "host",
          "purpose",
          "collections_studied",
          "items_studied",
          "remarks",
        ],
        autocomplete: {
          loaders: {
            agent: false,
            institution: false,
            list_country: false,
          },
          agent: [],
          institution: [],
          list_country: [],
        },
        visit: {},
        requiredFields: [],
        optionalFields: {
          visit: ["visitor", "visitor_free"],
        },
        block: {
          info: true,
        },
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);

        fetchVisit(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "visit", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.visit);
            this.removeUnnecessaryFields(this.visit, this.copyFields);

            this.$emit("data-loaded", this.visit);
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

    loadAutocompleteFields() {
      fetchListCountry().then(
        (response) =>
          (this.autocomplete.list_country = this.handleResponse(response))
      );
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach((key) => {
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
      if (this.isNotEmpty(obj.visitor)) {
        this.visit.visitor = {
          id: obj.visitor,
          agent: obj.visitor__agent,
        };
        this.autocomplete.agent.push(this.visit.visitor);
      }
      if (this.isNotEmpty(obj.visitor_institution)) {
        this.visit.visitor_institution = {
          id: obj.visitor_institution,
          agent: obj.visitor_institution__agent,
        };
        this.autocomplete.institution.push(this.visit.visitor_institution);
      }
      if (this.isNotEmpty(obj.host)) {
        this.visit.host = {
          id: obj.host,
          agent: obj.host__agent,
        };
        this.autocomplete.agent.push(this.visit.host);
      }
      this.visit.country = {
        id: obj.country,
        value: obj.visitor_country__value,
        value_en: obj.visitor_country__value_en,
      };
    },
  },
};
</script>

<style scoped></style>
