<template>
  <div class="analysis_parameter">
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
            :class="
              validate('analysis_parameter') ? 'green--text' : 'red--text'
            "
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="
              validate('analysis_parameter') ? 'green--text' : 'red--text'
            "
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
          <!-- PARAMETER -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.parameter"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.parameter')"
                use-state
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis_parameter.parent_parameter"
                :color="bodyActiveColor"
                :items="autocomplete.analysis_parameter"
                :loading="autocomplete.loaders.analysis_parameter"
                :item-text="parameterNameLabel"
                :label="$t('analysis_parameter.parent_parameter')"
                is-link
                route-object="analysis_parameter"
                is-searchable
                v-on:search:items="autocompleteAnalysisParameterSearch"
              />
            </v-col>
          </v-row>

          <!-- NAME and NAME (EN) -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.parameter_name"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.parameter_name')"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.parameter_name_en"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.parameter_name_en')"
              />
            </v-col>
          </v-row>
          <!-- HTML, INDEX and SYNONYMS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.parameter_html"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.parameter_html')"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.parameter_index"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.parameter_index')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="analysis_parameter.synonyms"
                :color="bodyActiveColor"
                :label="$t('analysis_parameter.synonyms')"
              />
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
          <span>{{ $t("common.description") }}</span>
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
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="analysis_parameter.remarks"
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
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { fetchAnalysisParameter } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import { mapState } from "vuex";

export default {
  name: "AnalysisParameter",
  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },
  props: {
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
  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],
  data() {
    return this.setInitialData();
  },
  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.analysis_parameterSearchParameters,
        request: "FETCH_ANALYSIS_PARAMETERS",
        title: "header.analysis_parameter",
        object: "analysis_parameter",
        field: "parameter",
      });
    }

    this.loadFullInfo();
  },
  watch: {
    "$route.params.id": {
      handler: function () {
        this.setInitialData();
        this.reloadData();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("search", ["analysis_parameterSearchParameters"]),
  },
  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "parameter",
          "parameter_name",
          "parameter_name_en",
          "parameter_html",
          "parameter_index",
          "synonyms",
          "parent_parameter",
          "remarks",
        ],
        autocomplete: {
          loaders: {
            analysis_parameter: false,
          },
          analysis_parameter: [],
        },
        requiredFields: ["parameter"],
        analysis_parameter: {},
        block: {
          info: true,
          description: true,
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
        this.setLoadingType("fetch");
        fetchAnalysisParameter(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(
              this,
              "analysis_parameter",
              this.handleResponse(response)[0]
            );
            this.fillAutocompleteFields(this.analysis_parameter);

            this.removeUnnecessaryFields(
              this.analysis_parameter,
              this.copyFields
            );
            this.$emit("data-loaded", this.analysis_parameter);
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

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.parent_parameter)) {
        this.analysis_parameter.parent_parameter = {
          id: obj.parent_parameter,
          parameter_name: obj.parent_parameter__parameter_name,
          parameter_name_en: obj.parent_parameter__parameter_name_en,
        };
        this.autocomplete.analysis_parameter.push(
          this.analysis_parameter.parent_parameter
        );
      }
    },
  },
};
</script>

<style scoped></style>
