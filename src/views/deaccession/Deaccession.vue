<template>
  <div class="deaccession">
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
            :class="validate('deaccession') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('deaccession') ? 'green--text' : 'red--text'"
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
          <!-- NUMBER, DATE_SIGNED and DATE_CONFIRMED -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="deaccession.number"
                :color="bodyActiveColor"
                :label="$t('deaccession.number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="deaccession.date_signed"
                :color="bodyActiveColor"
                :label="$t('deaccession.date_signed')"
                v-on:date:clear="deaccession.date_signed = null"
                v-on:date:update="updateUserInputtedDate('date_signed', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="deaccession.date_confirmed"
                :color="bodyActiveColor"
                :label="$t('deaccession.date_confirmed')"
                v-on:date:clear="deaccession.date_confirmed = null"
                v-on:date:update="
                  updateUserInputtedDate('date_confirmed', $event)
                "
              />
            </v-col>
          </v-row>

          <!-- AGENT_KANDIS and AGENT_KINNITAS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="deaccession.agent_kandis"
                :color="bodyActiveColor"
                :items="autocomplete.agent_kandis"
                :loading="autocomplete.loaders.agent_kandis"
                item-text="agent"
                :label="$t('deaccession.agent_kandis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="
                  autocompleteAgentSearch($event, 'agent_kandis')
                "
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="deaccession.agent_kinnitas"
                :color="bodyActiveColor"
                :items="autocomplete.agent_kinnitas"
                :loading="autocomplete.loaders.agent_kinnitas"
                item-text="agent"
                :label="$t('deaccession.agent_kinnitas')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="
                  autocompleteAgentSearch($event, 'agent_kinnitas')
                "
              />
            </v-col>
          </v-row>

          <!-- NUMBER_ITEMS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="deaccession.number_items"
                :color="bodyActiveColor"
                :label="$t('deaccession.number_items')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="deaccession.description"
                :color="bodyActiveColor"
                :label="$t('deaccession.description')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="deaccession.remarks"
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
  name: "Deaccession",

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
        autocomplete: {
          loaders: {
            agent_kandis: false,
            agent_kinnitas: false,
          },
          agent_kandis: [],
          agent_kinnitas: [],
        },
        deaccession: {
          id: null,
          number: null,
          date_signed: null,
          date_confirmed: null,
          agent_kandis: null,
          agent_kinnitas: null,
          number_items: null,
          description: null,
          remarks: null,
        },
        requiredFields: ["number"],
        block: {
          info: true,
        },
      };
    },
  },
};
</script>

<style scoped></style>
