<template>
  <div class="analysis_method">
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
            :class="validate('analysis_method') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('analysis_method') ? 'green--text' : 'red--text'"
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
                v-model="analysis_method.analysis_method"
                :color="bodyActiveColor"
                :label="$t('analysis_method.analysis_method')"
                use-state
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="analysis_method.method_en"
                :color="bodyActiveColor"
                :label="$t('analysis_method.method_en')"
              />
            </v-col>
          </v-row>

          <!-- NAME and NAME (EN) -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="analysis_method.parent_method"
                :color="bodyActiveColor"
                :items="autocomplete.parent_method"
                :loading="autocomplete.loaders.parent_method"
                :item-text="analysisMethodLabel"
                :label="$t('analysis_method.parent_method')"
                is-link
                route-object="analysis_method"
                is-searchable
                v-on:search:items="
                  autocompleteAnalysisMethodSearch($event, 'parent_method')
                "
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
                v-model="analysis_method.remarks"
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
  name: "AnalysisMethod",
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
        autocomplete: {
          loaders: {
            parent_method: false,
          },
          parent_method: [],
        },
        requiredFields: ["analysis_method"],
        analysis_method: {
          id: null,
          analysis_method: null,
          method_en: null,
          parent_method: null,
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
