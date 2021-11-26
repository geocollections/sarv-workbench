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
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('accession.agent_andis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="accession.agent_vottis"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('accession.agent_vottis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="accession.agent_kinnitas"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('accession.agent_kinnitas')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
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
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchAccessionDetail } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import DateWrapper from "../partial/inputs/DateWrapper";
import { mapState } from "vuex";

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

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.accessionSearchParameters,
        request: "FETCH_ACCESSIONS",
        title: "header.accessions",
        object: "accession",
        field: "number",
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
    ...mapState("search", ["accessionSearchParameters"]),
  },

  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "number",
          "date_signed",
          "date_confirmed",
          "agent_andis",
          "agent_vottis",
          "agent_kinnitas",
          "agent_kinnitas",
          "number_items",
          "description",
          "remarks",
        ],
        autocomplete: {
          loaders: {
            agent: false,
          },
          agent: [],
        },
        accession: {},
        requiredFields: ["number"],
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
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);

        fetchAccessionDetail(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "accession", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.accession);
            this.removeUnnecessaryFields(this.accession, this.copyFields);

            this.$emit("data-loaded", this.accession);
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
      if (this.isNotEmpty(obj.agent_andis)) {
        this.accession.agent_andis = {
          id: obj.agent_andis,
          agent: obj.agent_andis__agent,
        };
        this.autocomplete.agent.push(this.accession.agent_andis);
      }
      if (this.isNotEmpty(obj.agent_vottis)) {
        this.accession.agent_vottis = {
          id: obj.agent_vottis,
          agent: obj.agent_vottis__agent,
        };
        this.autocomplete.agent.push(this.accession.agent_vottis);
      }
      if (this.isNotEmpty(obj.agent_kinnitas)) {
        this.accession.agent_kinnitas = {
          id: obj.agent_kinnitas,
          agent: obj.agent_kinnitas__agent,
        };
        this.autocomplete.agent.push(this.accession.agent_kinnitas);
      }
    },
  },
};
</script>

<style scoped></style>
