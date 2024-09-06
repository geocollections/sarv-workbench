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
import InputWrapper from "../partial/inputs/InputWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchTaxonPagesDetail } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import Editor from "../partial/inputs/Editor";
import { mapState } from "vuex";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";

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

  mixins: [formManipulation, autocompleteMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.taxon_pagesSearchParameters,
        request: "FETCH_TAXON_PAGES",
        title: "header.taxon_pages",
        object: "taxon_page",
        field: "title",
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
    ...mapState("search", ["taxon_pagesSearchParameters"]),
  },

  methods: {
    setInitialData() {
      return {
        copyFields: [
          "id",
          "frontpage",
          "language",
          "frontpage_title",
          "title",
          "on_frontpage",
          "taxon",
          "content",
          "author",
        ],
        autocomplete: {
          loaders: {
            taxon: false,
            agent: false,
          },
          taxon: [],
          agent: [],
        },
        taxon_page: {},
        requiredFields: ["taxon"],
        block: {
          info: true,
        },
      };
    },
    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.taxon)) {
        this.taxon_page.taxon = {
          id: obj.taxon,
          taxon: obj.taxon__taxon,
        };
        this.autocomplete.taxon.push(this.taxon_page.taxon);
      }
      if (this.isNotEmpty(obj.author)) {
        this.taxon_page.author = {
          id: obj.agent,
          agent: obj.author__agent,
        };
        this.autocomplete.agent.push(this.taxon_page.author);
      }
    },
    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchTaxonPagesDetail(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "taxon_page", this.handleResponse(response)[0]);
            this.fillAutocompleteFields(this.taxon_page);
            this.removeUnnecessaryFields(this.taxon_page, this.copyFields);
            this.$emit("data-loaded", this.taxon_page);
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
  },
};
</script>

<style scoped></style>
