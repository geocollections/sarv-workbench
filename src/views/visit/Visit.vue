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
                :items="autocomplete.visitor"
                :loading="autocomplete.loaders.visitor"
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
                v-on:search:items="autocompleteAgentSearch($event, 'visitor')"
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
                :items="autocomplete.visitor_institution"
                :loading="autocomplete.loaders.visitor_institution"
                item-text="agent"
                :label="$t('visit.visitor_institution')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="
                  autocompleteInstitutionSearch($event, 'visitor_institution')
                "
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
                :items="autocomplete.host"
                :loading="autocomplete.loaders.host"
                item-text="agent"
                :label="$t('visit.host')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'host')"
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
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import DateWrapper from "@/components/partial/inputs/DateWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

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

  mixins: [formManipulation, autocompleteMixin, detailViewUtilsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  methods: {
    setInitialData() {
      return {
        listOfAutocompleteTables: ["list_country"],
        autocomplete: {
          loaders: {
            visitor: false,
            host: false,
            institution: false,
            list_country: false,
          },
          visitor: [],
          host: [],
          institution: [],
          list_country: [],
        },
        visit: {
          id: null,
          visitor: null,
          visitor_free: null,
          date_arrived: null,
          date_left: null,
          visitor_institution: null,
          visitor_country: null,
          host: null,
          purpose: null,
          collections_studied: null,
          items_studied: null,
          remarks: null,
        },
        requiredFields: [],
        optionalFields: {
          visit: ["visitor", "visitor_free"],
        },
        block: {
          info: true,
        },
      };
    },
  },
};
</script>
