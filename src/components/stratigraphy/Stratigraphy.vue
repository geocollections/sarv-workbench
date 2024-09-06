<template>
  <div class="stratigraphy">
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
            :class="validate('stratigraphy') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('stratigraphy') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer />
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- STRATIGRAPHY and STRATIGRAPHY_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.stratigraphy"
                :color="bodyActiveColor"
                :label="$t('common.stratigraphy')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.stratigraphy_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.stratigraphy_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_ORIGINAL, AUTHOR_FREE and YEAR -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.stratigraphy_original"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.stratigraphy_original')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.author_free"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.author_free')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- ETYMON and ETYMON_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.etymon"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.etymon')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.etymon_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.etymon_en')"
              />
            </v-col>
          </v-row>

          <!-- ORIGINAL_LOCALITY and ORIGINAL_RANK -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.original_locality"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.original_locality')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.original_rank"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.original_rank')"
              />
            </v-col>
          </v-row>

          <!-- INDEX_MAIN, INDEX_MAIN_HMTL, INDEX_ADDITIONAL and INDEX_ADDITIONAL_HTML -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.index_main"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.index_main')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.index_main_html"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.index_main_html')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.index_additional"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.index_additional')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.index_additional_html"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.index_additional_html')"
              />
            </v-col>
          </v-row>

          <!-- MAAAMET_KOOD, INDEX_OLD -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.maaamet_kood"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.maaamet_kood')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.index_old"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.index_old')"
              />
            </v-col>
          </v-row>

          <!-- COLOR_CODE_CGMW and COLOR_CODE_ADDITIONAL -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.color_code_cgmw"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.color_code_cgmw')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.color_code_additional"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.color_code_additional')"
              />
            </v-col>
          </v-row>

          <!-- PARENT, AGE_CHRONOSTRATIGRAPHY and HIERARCHY_STRING -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.parent"
                :color="bodyActiveColor"
                :items="autocomplete.parent_stratigraphy"
                :loading="autocomplete.loaders.parent_stratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('stratigraphy.parent')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyParentSearch"
                @input="updateHierarchyString"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.age_chronostratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.age_chronostratigraphy"
                :loading="autocomplete.loaders.age_chronostratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('stratigraphy.age_chronostratigraphy')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteAgeChronostratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.hierarchy_string"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.hierarchy_string')"
              />
            </v-col>
          </v-row>

          <!-- TYPE and RANK -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.type"
                :color="bodyActiveColor"
                :items="autocomplete.list_stratigraphy_type"
                :loading="autocomplete.loaders.list_stratigraphy_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.rank"
                :color="bodyActiveColor"
                :items="autocomplete.list_stratigraphy_rank"
                :loading="autocomplete.loaders.list_stratigraphy_rank"
                :item-text="commonLabel"
                :label="$t('stratigraphy.rank')"
              />
            </v-col>
          </v-row>

          <!-- SCOPE and STATUS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.scope"
                :color="bodyActiveColor"
                :items="autocomplete.list_stratigraphy_scope"
                :loading="autocomplete.loaders.list_stratigraphy_scope"
                :item-text="commonLabel"
                :label="$t('stratigraphy.scope')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.status"
                :color="bodyActiveColor"
                :items="autocomplete.list_stratigraphy_status"
                :loading="autocomplete.loaders.list_stratigraphy_status"
                :item-text="commonLabel"
                :label="$t('stratigraphy.status')"
              />
            </v-col>
          </v-row>

          <!-- REGION and REGION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.region"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.region')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.region_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.region_en')"
              />
            </v-col>
          </v-row>

          <!-- LITHOLOGY and LITHOLOGY_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.lithology"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.lithology')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.lithology_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.lithology_en')"
              />
            </v-col>
          </v-row>

          <!-- MAX_THICKNESS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.max_thickness"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.max_thickness')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- AGE_BASE, AGE_TOP, AGE_PRECISION and AGE_REFERENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.age_base"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.age_base')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.age_top"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.age_top')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.age_precision"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.age_precision')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="stratigraphy.age_reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('stratigraphy.age_reference')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>
          </v-row>

          <!-- IS_PRIVATE, SORT_WITHIN_PARENT, APPROVED_ICS and APPROVED_ESK -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="stratigraphy.is_private"
                :color="bodyActiveColor"
                :label="$t('common.is_private')"
                @change="stratigraphy.is_private = !stratigraphy.is_private"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.sort_within_parent"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.sort_within_parent')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="stratigraphy.approved_ics"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.approved_ics')"
                @change="stratigraphy.approved_ics = !stratigraphy.approved_ics"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="stratigraphy.approved_esk"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.approved_esk')"
                @change="stratigraphy.approved_esk = !stratigraphy.approved_esk"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DESCRIPTION -->
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
          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof stratigraphy.description !== 'undefined'"
                v-model="stratigraphy.description"
                :label="$t('common.description')"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof stratigraphy.description_en !== 'undefined'"
                v-model="stratigraphy.description_en"
                :label="$t('common.description_en')"
              />
            </v-col>
          </v-row>

          <!-- DEFINITION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof stratigraphy.definition !== 'undefined'"
                v-model="stratigraphy.definition"
                :label="$t('stratigraphy.definition')"
              />
            </v-col>
          </v-row>

          <!-- DEFINITION_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof stratigraphy.definition_en !== 'undefined'"
                v-model="stratigraphy.definition_en"
                :label="$t('stratigraphy.definition')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
      v-if="$route.meta.isEdit"
      class="related-tabs mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('n-')[0] + 'n-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
        hide-slider
      >
        <v-tab
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("stratigraphy.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <stratigraphy-reference-table
            v-show="activeTab === 'stratigraphy_reference'"
            :response="relatedData.stratigraphy_reference"
            :search-parameters="
              relatedData.searchParameters.stratigraphy_reference
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <stratigraphy-stratotype-table
            v-show="activeTab === 'stratigraphy_stratotype'"
            :response="relatedData.stratigraphy_stratotype"
            :search-parameters="
              relatedData.searchParameters.stratigraphy_stratotype
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <stratigraphy-synonym-table
            v-show="activeTab === 'stratigraphy_synonym'"
            :response="relatedData.stratigraphy_synonym"
            :search-parameters="
              relatedData.searchParameters.stratigraphy_synonym
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <!-- PAGINATION -->
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            v-on:update:page="
              relatedData.searchParameters[activeTab].page = $event
            "
            v-on:update:paginateBy="
              relatedData.searchParameters[activeTab].paginateBy = $event
            "
          />
        </v-card>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";

import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchListLanguages,
  fetchListStratigraphyRank,
  fetchListStratigraphyScope,
  fetchListStratigraphyStatus,
  fetchListStratigraphyType,
  fetchListStratotypeType,
  fetchStratigraphy,
  fetchStratigraphyReferences,
  fetchStratigraphyStratotypes,
  fetchStratigraphySynonyms,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import StratigraphySynonymTable from "./relatedTables/StratigraphySynonymTable";
import requestsMixin from "../../mixins/requestsMixin";
import StratigraphyReferenceTable from "./relatedTables/StratigraphyReferenceTable";
import StratigraphyStratotypeTable from "./relatedTables/StratigraphyStratotypeTable";
import Editor from "../partial/inputs/Editor";
import { mapActions, mapState } from "vuex";
import Pagination from "@/components/partial/Pagination";

export default {
  name: "Stratigraphy",

  components: {
    Pagination,
    Editor,
    StratigraphyStratotypeTable,
    StratigraphyReferenceTable,
    StratigraphySynonymTable,
    CheckboxWrapper,
    AutocompleteWrapper,
    TextareaWrapper,
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.stratigraphySearchParameters,
        request: "FETCH_STRATIGRAPHY",
        title: "header.stratigraphies",
        object: "stratigraphy",
        field: "stratigraphy_en",
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
    "relatedData.searchParameters": {
      handler: function () {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", ["stratigraphySearchParameters"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "stratigraphy_reference", iconClass: "fas fa-book" },
          { name: "stratigraphy_stratotype", iconClass: "fas fa-cut" },
          { name: "stratigraphy_synonym", iconClass: "fas fa-list-ol" },
        ],
        activeTab: "stratigraphy_reference",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "stratigraphy",
          "stratigraphy_en",
          "stratigraphy_original",
          "author_free",
          "year",
          "etymon",
          "etymon_en",
          "original_locality",
          "original_rank",
          "index_main",
          "index_main_html",
          "index_additional",
          "index_additional_html",
          "color_code_cgmw",
          "color_code_additional",
          "hierarchy_string",
          "parent",
          "type",
          "rank",
          "scope",
          "status",
          "region",
          "region_en",
          "lithology",
          "lithology_en",
          "max_thickness",
          "description",
          "description_en",
          "definition",
          "definition_en",
          "age_base",
          "age_top",
          "age_precision",
          "age_reference",
          "age_chronostratigraphy",
          "sort_within_parent",
          "approved_ics",
          "approved_esk",
          "is_private",
          "remarks",
          "index_old",
          "maaamet_kood",
        ],
        autocomplete: {
          loaders: {
            parent_stratigraphy: false,
            list_stratigraphy_type: false,
            list_stratigraphy_rank: false,
            list_stratigraphy_scope: false,
            list_stratigraphy_status: false,
            reference: false,
            age_chronostratigraphy: false,
            locality: false,
            list_language: false,
          },
          parent_stratigraphy: [],
          list_stratigraphy_type: [],
          list_stratigraphy_rank: [],
          list_stratigraphy_scope: [],
          list_stratigraphy_status: [],
          reference: [],
          age_chronostratigraphy: [],
          locality: [],
          list_language: [],
        },
        requiredFields: ["stratigraphy", "stratigraphy_en"],
        stratigraphy: {},
        block: {
          info: true,
          description: true,
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields(true, true);

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchStratigraphy(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "stratigraphy", this.handleResponse(response)[0]);
            // this.stratigraphy = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.stratigraphy);

            this.removeUnnecessaryFields(this.stratigraphy, this.copyFields);
            this.$emit("data-loaded", this.stratigraphy);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListStratigraphyType().then(
          (response) =>
            (this.autocomplete.list_stratigraphy_type =
              this.handleResponse(response))
        );
        fetchListStratigraphyRank().then(
          (response) =>
            (this.autocomplete.list_stratigraphy_rank =
              this.handleResponse(response))
        );
        fetchListStratigraphyScope().then(
          (response) =>
            (this.autocomplete.list_stratigraphy_scope =
              this.handleResponse(response))
        );
        fetchListStratigraphyStatus().then(
          (response) =>
            (this.autocomplete.list_stratigraphy_status =
              this.handleResponse(response))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchListStratotypeType().then(
          (response) =>
            (this.autocomplete.list_stratotype_type =
              this.handleResponse(response))
        );
        fetchListLanguages().then(
          (response) =>
            (this.autocomplete.list_language = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        stratigraphy_reference: { count: 0, results: [] },
        stratigraphy_stratotype: { count: 0, results: [] },
        stratigraphy_synonym: { count: 0, results: [] },
        searchParameters: {
          stratigraphy_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["reference"],
            sortDesc: [true],
          },
          stratigraphy_stratotype: {
            page: 1,
            paginateBy: 10,
            sortBy: ["locality"],
            sortDesc: [true],
          },
          stratigraphy_synonym: {
            page: 1,
            paginateBy: 10,
            sortBy: ["synonym"],
            sortDesc: [true],
          },
        },
      };
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

      if (!this.isNotEmpty(uploadableObject.age_base))
        uploadableObject.age_base = null;
      if (!this.isNotEmpty(uploadableObject.age_top))
        uploadableObject.age_top = null;
      if (!this.isNotEmpty(uploadableObject.age_precision))
        uploadableObject.age_precision = null;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach((tab) => {
          if (this.relatedData[tab.name].count > 0) {
            uploadableObject.related_data[tab.name] =
              this.relatedData[tab.name].results;

            uploadableObject.related_data[tab.name].forEach((item) => {
              Object.keys(item).forEach((key) => {
                if (typeof item[key] === "object" && item[key] !== null) {
                  item[key] = item[key].id ? item[key].id : null;
                }
              });
            });
          }
        });
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.parent)) {
        this.stratigraphy.parent = {
          id: obj.parent,
          stratigraphy: obj.parent__stratigraphy,
          stratigraphy_en: obj.parent__stratigraphy_en,
          hierarchy_string: obj.parent__hierarchy_string,
        };
        this.autocomplete.parent_stratigraphy.push(this.stratigraphy.parent);
      }
      if (this.isNotEmpty(obj.age_reference)) {
        this.stratigraphy.age_reference = {
          id: obj.age_reference,
          reference: obj.age_reference__reference,
        };
        this.autocomplete.reference.push(this.stratigraphy.age_reference);
      }
      if (this.isNotEmpty(obj.age_chronostratigraphy)) {
        this.stratigraphy.age_chronostratigraphy = {
          id: obj.age_chronostratigraphy,
          stratigraphy: obj.age_chronostratigraphy__stratigraphy,
          stratigraphy_en: obj.age_chronostratigraphy__stratigraphy_en,
        };
        this.autocomplete.age_chronostratigraphy.push(
          this.stratigraphy.age_chronostratigraphy
        );
      }
      if (this.isNotEmpty(obj.type)) {
        this.stratigraphy.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en,
        };
      }
      if (this.isNotEmpty(obj.rank)) {
        this.stratigraphy.rank = {
          id: obj.rank,
          value: obj.rank__value,
          value_en: obj.rank__value_en,
        };
      }
      if (this.isNotEmpty(obj.scope)) {
        this.stratigraphy.scope = {
          id: obj.scope,
          value: obj.scope__value,
          value_en: obj.scope__value_en,
        };
      }
      if (this.isNotEmpty(obj.status)) {
        this.stratigraphy.status = {
          id: obj.status,
          value: obj.status__value,
          value_en: obj.status__value_en,
        };
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "stratigraphy_reference") {
        query = fetchStratigraphyReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.stratigraphy_reference
        );
      } else if (object === "stratigraphy_stratotype") {
        query = fetchStratigraphyStratotypes(
          this.$route.params.id,
          this.relatedData.searchParameters.stratigraphy_stratotype
        );
      } else if (object === "stratigraphy_synonym") {
        query = fetchStratigraphySynonyms(
          this.$route.params.id,
          this.relatedData.searchParameters.stratigraphy_synonym
        );
      }

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },

    updateHierarchyString(parent) {
      if (this.$route.meta.isEdit && parent?.hierarchy_string) {
        this.stratigraphy.hierarchy_string =
          parent.hierarchy_string + "-" + this.$route.params.id;
      }
    },
  },
};
</script>

<style scoped />
