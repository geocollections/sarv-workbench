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
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('deaccession.agent_kandis')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="deaccession.agent_kinnitas"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('deaccession.agent_kinnitas')"
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
    <v-row no-gutters class="mt-2">
      <v-col class="d-flex">
        <autocomplete-wrapper
          class="ml-auto"
          v-model="deaccession.database"
          :color="bodyActiveColor"
          :items="autocomplete.database"
          :loading="autocomplete.loaders.database"
          :item-text="nameLabel"
          :label="$t('common.institution')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import {
  fetchDeaccessionDetail,
  fetchDatabase,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import DateWrapper from "../partial/inputs/DateWrapper";
import { mapState, mapGetters } from "vuex";

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

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.deaccessionSearchParameters,
        request: "FETCH_DEACCESSIONS",
        title: "header.deaccessions",
        object: "deaccession",
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
    ...mapState("search", ["deaccessionSearchParameters"]),
  },

  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "number",
          "date_signed",
          "date_confirmed",
          "agent_kandis",
          "agent_kinnitas",
          "number_items",
          "description",
          "remarks",
          "database",
        ],
        autocomplete: {
          loaders: {
            agent: false,
            database: false,
          },
          agent: [],
          database: [],
        },
        deaccession: {},
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

    loadAutocompleteFields() {
      fetchDatabase().then(
        (response) =>
          (this.autocomplete.database = this.handleResponse(response))
      );
    },
    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchDeaccessionDetail(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "deaccession", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.deaccession);
            this.removeUnnecessaryFields(this.deaccession, this.copyFields);

            this.$emit("data-loaded", this.deaccession);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
        if (this.getDatabaseId !== null) {
          this.deaccession.database = {
            id: this.getDatabaseId,
          };
        }
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
      this.deaccession.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };

      if (this.isNotEmpty(obj.agent_kandis)) {
        this.deaccession.agent_kandis = {
          id: obj.agent_kandis,
          agent: obj.agent_kandis__agent,
        };
        this.autocomplete.agent.push(this.deaccession.agent_kandis);
      }
      if (this.isNotEmpty(obj.agent_kinnitas)) {
        this.deaccession.agent_kinnitas = {
          id: obj.agent_kinnitas,
          agent: obj.agent_kinnitas__agent,
        };
        this.autocomplete.agent.push(this.deaccession.agent_kinnitas);
      }
    },
  },
};
</script>

<style scoped></style>
