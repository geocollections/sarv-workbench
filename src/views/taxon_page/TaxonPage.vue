<template>
  <div class="taxon-page">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('taxon_page') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('taxon_page') ? 'green--text' : 'red--text'"
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
          <!-- TAXON -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon_page.taxon"
                :color="bodyActiveColor"
                :items="autocomplete.taxon"
                :loading="autocomplete.loaders.taxon"
                item-text="taxon"
                :label="$t('taxon_page.taxon')"
                is-link
                use-state
                route-object="taxon"
                is-searchable
                v-on:search:items="autocompleteTaxonSearch"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- LANGUAGE -->
            <v-col cols="6" class="pa-1">
              <input-wrapper
                v-model="taxon_page.language"
                :color="bodyActiveColor"
                :label="$t('common.language')"
              />
            </v-col>
            <!-- TITLE -->
            <v-col cols="6" class="pa-1">
              <input-wrapper
                v-model="taxon_page.title"
                :color="bodyActiveColor"
                :label="$t('taxon_page.title')"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- FRONTPAGE -->
            <v-col cols="6" class="pa-1">
              <input-wrapper
                v-model="taxon_page.frontpage"
                :color="bodyActiveColor"
                :label="$t('taxon_page.frontpage')"
              />
            </v-col>
            <!-- FRONTPAGE TITLE -->
            <v-col cols="6" class="pa-1">
              <input-wrapper
                v-model="taxon_page.frontpage_title"
                :color="bodyActiveColor"
                :label="$t('taxon_page.frontpage_title')"
              />
            </v-col>
          </v-row>

          <!-- AUTHOR -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon_page.author"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('common.author')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- ON FRONTPAGE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <checkbox-wrapper
                v-model="taxon_page.on_frontpage"
                :color="bodyActiveColor"
                :label="$t('taxon_page.on_frontpage')"
                @change="taxon_page.on_frontpage = !taxon_page.on_frontpage"
              />
            </v-col>
          </v-row>

          <!-- CONTENT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="taxon_page.content"
                :color="bodyActiveColor"
                :label="$t('taxon_page.content')"
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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import Editor from "@/components/partial/inputs/Editor";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";

export default {
  name: "TaxonPage",

  components: {
    InputWrapper,
    CheckboxWrapper,
    Editor,
    AutocompleteWrapper,
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
            taxon: false,
            agent: false,
          },
          taxon: [],
          agent: [],
        },
        taxon_page: {
          id: null,
          frontpage: null,
          language: null,
          frontpage_title: null,
          title: null,
          on_frontpage: null,
          taxon: null,
          content: null,
          author: null,
        },
        requiredFields: ["taxon"],
        block: {
          info: true,
        },
      };
    },
  },
};
</script>

<style scoped></style>
