<template>
  <div class="accession">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('accession') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('accession') ? 'green--text' : 'red--text'"
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
                v-model="accession.number"
                :color="bodyActiveColor"
                :label="$t('accession.number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="accession.date_signed"
                :color="bodyActiveColor"
                :label="$t('accession.date_signed')"
                v-on:date:clear="accession.date_signed = null"
                v-on:date:update="updateUserInputtedDate('date_signed', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="accession.date_confirmed"
                :color="bodyActiveColor"
                :label="$t('accession.date_confirmed')"
                v-on:date:clear="accession.date_confirmed = null"
                v-on:date:update="
                  updateUserInputtedDate('date_confirmed', $event)
                "
              />
            </v-col>
          </v-row>

          <!-- AGENT_ANDIS, AGENT_VOTTIS and AGENT_KINNITAS -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="accession.agent_andis"
                :color="bodyActiveColor"
                :items="autocomplete.agent_andis"
                :loading="autocomplete.loaders.agent_andis"
                item-text="agent"
                :label="$t('accession.agent_andis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'agent_andis')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="accession.agent_vottis"
                :color="bodyActiveColor"
                :items="autocomplete.agent_vottis"
                :loading="autocomplete.loaders.agent_vottis"
                item-text="agent"
                :label="$t('accession.agent_vottis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'agent_vottis')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="accession.agent_kinnitas"
                :color="bodyActiveColor"
                :items="autocomplete.agent_kinnitas"
                :loading="autocomplete.loaders.agent_kinnitas"
                item-text="agent"
                :label="$t('accession.agent_kinnitas')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'agent_kinnitas')"
              />
            </v-col>
          </v-row>

          <!-- NUMBER_ITEMS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="accession.number_items"
                :color="bodyActiveColor"
                :label="$t('accession.number_items')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="accession.description"
                :color="bodyActiveColor"
                :label="$t('accession.description')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="accession.remarks"
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
import InputWrapper from "../../components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../../components/partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchAccessionDetail } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import DateWrapper from "../../components/partial/inputs/DateWrapper";
import { mapState } from "vuex";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "Accession",

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
        copyFields: [],
        autocomplete: {
          loaders: {
            agent_andis: false,
            agent_vottis: false,
            agent_kinnitas: false,
          },
          agent_andis: [],
          agent_vottis: [],
          agent_kinnitas: [],
        },
        accession: {
          id: null,
          number: null,
          date_signed: null,
          date_confirmed: null,
          agent_andis: null,
          agent_vottis: null,
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
