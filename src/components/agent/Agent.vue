<template>
  <div class="agent">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('agent') ? 'green--text' : 'red--text'">{{
            $t("agent.generalInfo")
          }}</span>
          <v-icon right :class="validate('agent') ? 'green--text' : 'red--text'"
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- NAME -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`agent`">{{ $t("agent.agent") }}:</label>
              <b-form-input
                size="sm"
                id="agent"
                v-model="agent.agent"
                :state="isNotEmpty(agent.agent)"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TYPE and INSTITUTION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`type`">{{ $t("agent.type") }}:</label>
              <vue-multiselect
                v-model="agent.type"
                id="type"
                :options="autocomplete.agent_type"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`institution`">{{ $t("agent.institution") }}:</label>
              <vue-multiselect
                id="agent"
                v-model="agent.institution"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.institution"
                :options="autocomplete.institution"
                @search-change="autocompleteInstitutionSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- FORENAME and SURENAME -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`forename`">{{ $t("agent.forename") }}:</label>
              <b-form-input
                size="sm"
                id="agent"
                v-model="agent.forename"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`surename`">{{ $t("agent.surename") }}:</label>
              <b-form-input
                size="sm"
                id="agent"
                v-model="agent.surename"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SPECIMEN DETAILS -->
    <v-card
      class="mt-2"
      id="block-details"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.details = !block.details"
        >
          <span>{{ $t("agent.details") }}</span>
          <v-icon right>fas fa-info</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.details = !block.details"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.details ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="px-1 pt-1 pb-2">
          <!-- INSTITUTION_NAME and INSTITUTION_NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`institution_name`"
                >{{ $t("agent.institution_name") }}:</label
              >
              <b-form-input
                size="sm"
                id="institution_name"
                v-model="agent.institution_name"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`institution_name_en`"
                >{{ $t("agent.institution_name_en") }}:</label
              >
              <b-form-input
                size="sm"
                id="institution_name_en"
                v-model="agent.institution_name_en"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- TITLE, PROFESSION and PROFESSION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`title`">{{ $t("agent.title") }}:</label>
              <b-form-input
                size="sm"
                id="title"
                v-model="agent.title"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`profession`">{{ $t("agent.profession") }}:</label>
              <b-form-input
                size="sm"
                id="profession"
                v-model="agent.profession"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`profession_en`"
                >{{ $t("agent.profession_en") }}:</label
              >
              <b-form-input
                size="sm"
                id="profession_en"
                v-model="agent.profession_en"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- ADDRESS, ADDRESS1 and ADDRESS2 -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`address`">{{ $t("agent.address") }}:</label>
              <b-form-input
                size="sm"
                id="address"
                v-model="agent.address"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`address1`">{{ $t("agent.address1") }}:</label>
              <b-form-input
                size="sm"
                id="address1"
                v-model="agent.address1"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`address2`">{{ $t("agent.address2") }}:</label>
              <b-form-input
                size="sm"
                id="address2"
                v-model="agent.address2"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- HTTP and ORCID -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`http`">{{ $t("agent.http") }}:</label>
              <b-form-input
                size="sm"
                id="http"
                v-model="agent.http"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`orcid`">{{ $t("agent.orcid") }}:</label>
              <b-form-input
                size="sm"
                id="orcid"
                v-model="agent.orcid"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- COUNTRY and COUNTRY_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`country`">{{ $t("agent.country") }}:</label>
              <vue-multiselect
                v-model="agent.country"
                id="country"
                :options="autocomplete.list_country"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`country_txt`">{{ $t("agent.country_txt") }}:</label>
              <b-form-input
                size="sm"
                id="country_txt"
                v-model="agent.country_txt"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- PHONE and EMAIL -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`phone`">{{ $t("agent.phone") }}:</label>
              <b-form-input
                size="sm"
                id="phone"
                v-model="agent.phone"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`email`">{{ $t("agent.email") }}:</label>
              <b-form-input
                size="sm"
                id="email"
                v-model="agent.email"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- DATE_BORN and DATE_DECEASED -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`date_born`">{{ $t("agent.date_born") }}:</label>
              <v-menu
                v-model="menuDateBorn"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    hide-details
                    v-model="agent.date_born"
                    prepend-inner-icon="far fa-calendar-alt"
                    :color="bodyActiveColor"
                    clearable
                    dense
                    flat
                    solo
                    class="white"
                    style="border: 1px solid #ced4da !important;"
                    clear-icon="fas fa-times"
                    readonly
                    :class="bodyActiveColor + '--text'"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="agent.date_born"
                  @input="menuDateBorn = false"
                  :color="bodyActiveColor"
                  :header-color="`${bodyActiveColor} darken-3`"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`date_deceased`"
                >{{ $t("agent.date_deceased") }}:</label
              >
              <v-menu
                v-model="menuDateDeceased"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    hide-details
                    v-model="agent.date_deceased"
                    prepend-inner-icon="far fa-calendar-alt"
                    :color="bodyActiveColor"
                    clearable
                    dense
                    flat
                    solo
                    class="white"
                    style="border: 1px solid #ced4da !important;"
                    clear-icon="fas fa-times"
                    readonly
                    :class="bodyActiveColor + '--text'"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="agent.date_deceased"
                  @input="menuDateDeceased = false"
                  :color="bodyActiveColor"
                  :header-color="`${bodyActiveColor} darken-3`"
                  scrollable
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <!-- OLD_NAME and NEW_NAME -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`old_name`">{{ $t("agent.old_name") }}:</label>
              <b-form-input
                size="sm"
                id="old_name"
                v-model="agent.old_name"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`new_name`">{{ $t("agent.new_name") }}:</label>
              <b-form-input
                size="sm"
                id="new_name"
                v-model="agent.new_name"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("agent.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("agent.remarks") }}:</label>
              <editor :data.sync="agent.remarks" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {fetchAgent, fetchListAgentType, fetchListCountry} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import Editor from "../partial/editor/Editor";
import Spinner from "vue-simple-spinner";

export default {
  name: "Agent",
  components: {
    Editor,
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
  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],
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
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "agentSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_AGENTS",
        title: "header.agents",
        object: "agent",
        field: "agent",
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
        searchHistory: "agentSearchHistory",
        copyFields: [
          "id",
          "agent",
          "type",
          "forename",
          "surename",
          "institution",
          "institution_name",
          "institution_name_en",
          "title",
          "profession",
          "profession_en",
          "address",
          "address1",
          "address2",
          "http",
          "orcid",
          "country",
          "country_txt",
          "phone",
          "email",
          "date_born",
          "date_deceased",
          "old_name",
          "new_name",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            agent_type: false,
            institution: false,
            list_country: false
          },
          agent_type: [],
          institution: [],
          list_country: []
        },
        requiredFields: ["agent"],
        agent: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          details: true,
          description: true
        },
        menuDateBorn: false,
        menuDateDeceased: false
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "agent");
        fetchAgent(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.agent = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.agent);

            this.removeUnnecessaryFields(this.agent, this.copyFields);
            this.$emit("data-loaded", this.agent);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
    },

    loadAutocompleteFields() {
      fetchListCountry().then(
        response =>
          (this.autocomplete.list_country = this.handleResponse(response))
      );

      fetchListAgentType().then(response => this.autocomplete.agent_type = this.handleResponse(response))
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.institution))
        uploadableObject.institution = objectToUpload.institution.id;
      if (this.isNotEmpty(objectToUpload.country))
        uploadableObject.country = objectToUpload.country.id;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.agent.type = {
        id: obj.type,
        value: obj.type__value,
        value_en: obj.type__value_en
      };
      this.agent.institution = {
        id: obj.institution,
        agent: obj.institution__agent
      };
      this.agent.country = {
        id: obj.country,
        value: obj.country__value,
        value_en: obj.country__value_en
      };
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        agent: null,
        forename: null,
        surename: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["agent"],
        sortDesc: [false]
      };
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
