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
                :items="autocomplete.parent_parameter"
                :loading="autocomplete.loaders.parent_parameter"
                :item-text="parameterNameLabel"
                :label="$t('analysis_parameter.parent_parameter')"
                is-link
                route-object="analysis_parameter"
                is-searchable
                v-on:search:items="
                  autocompleteAnalysisParameterSearch(
                    $event,
                    'parent_parameter'
                  )
                "
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
          <!-- HTML and SYNONYMS -->
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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "AnalysisParameter",
  components: {
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
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
  ],
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
            parent_parameter: false,
          },
          parent_parameter: [],
        },
        requiredFields: ["parameter"],
        analysis_parameter: {
          id: null,
          parameter: null,
          parameter_name: null,
          parameter_name_en: null,
          parameter_html: null,
          synonyms: null,
          parent_parameter: null,
          remarks: null,
        },
        block: {
          info: true,
          description: true,
        },
      };
    },
  },
};
</script>
