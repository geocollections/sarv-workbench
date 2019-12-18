<template>
  <div class="stratigraphy">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    />

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
            >{{ $t("preparation.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('stratigraphy') ? 'green--text' : 'red--text'"
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
          <!-- STRATIGRAPHY and STRATIGRAPHY_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="stratigraphy.stratigraphy"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.stratigraphy')"
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
                :label="$t('stratigraphy.type')"
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

          <!-- DESCRIPTION and DESCRIPTION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.description"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.description')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.description_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.description_en')"
              />
            </v-col>
          </v-row>

          <!-- DEFINITION and DEFINITION_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.definition"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.definition')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.definition_en"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.definition_en')"
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

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="stratigraphy.remarks"
                :color="bodyActiveColor"
                :label="$t('stratigraphy.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
    <v-card
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
            v-if="relatedData.count[tab.name] > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData.count[tab.name] }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pa-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <stratigraphy-reference
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <stratigraphy-stratotype
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <stratigraphy-synonym
            v-if="false"
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <stratigraphy-synonym-table
            v-if="activeTab === 'stratigraphy_synonym'"
            :response="{count: relatedData.count.stratigraphy_synonym, results: relatedData.stratigraphy_synonym}"
            :autocomplete="autocomplete"
            :search-parameters="relatedData.searchParameters.stratigraphy_synonym"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:fill-autocompletes="fillRelatedDataAutocompleteFields"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters[activeTab].page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.count[activeTab] /
                      relatedData.searchParameters[activeTab].paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- IS_PRIVATE -->
    <!--    <v-row no-gutters class="mt-2">-->
    <!--      <v-col>-->
    <!--        <checkbox-wrapper-->
    <!--          v-model="stratigraphy.is_private"-->
    <!--          :color="bodyActiveColor"-->
    <!--          :label="$t('common.is_private')"-->
    <!--          @change="stratigraphy.is_private = !stratigraphy.is_private"-->
    <!--        />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
  </div>
</template>

<script>
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
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
  fetchStratigraphySynonyms
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import StratigraphyReference from "./relatedTables/StratigraphyReference";
import StratigraphyStratotype from "./relatedTables/StratigraphyStratotype";
import StratigraphySynonym from "./relatedTables/StratigraphySynonym";
import StratigraphySynonymTable from "./relatedTables/StratigraphySynonymTable";

export default {
  name: "Stratigraphy",

  components: {
    StratigraphySynonymTable,
    StratigraphySynonym,
    StratigraphyStratotype,
    StratigraphyReference,
    CheckboxWrapper,
    AutocompleteWrapper,
    TextareaWrapper,
    InputWrapper,
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
        searchHistory: "stratigraphySearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_STRATIGRAPHY",
        title: "header.stratigraphies",
        object: "stratigraphy",
        field: "name",
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
    },
    "relatedData.searchParameters": {
      handler: function() {
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState(["databaseId"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    addRelatedItem(payload) {
      console.log(payload)
    },

    editRelatedItem(payload) {
      console.log(payload)
    },

    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "stratigraphy_reference", iconClass: "fas fa-book" },
          { name: "stratigraphy_stratotype", iconClass: "fas fa-cut" },
          { name: "stratigraphy_synonym", iconClass: "fas fa-list-ol" }
        ],
        searchHistory: "stratigraphySearchHistory",
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
          "remarks"
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
            list_language: false
          },
          parent_stratigraphy: [],
          list_stratigraphy_type: [],
          list_stratigraphy_rank: [],
          list_stratigraphy_scope: [],
          list_stratigraphy_status: [],
          reference: [],
          age_chronostratigraphy: [],
          locality: [],
          list_language: []
        },
        requiredFields: ["stratigraphy", "stratigraphy_en"],
        stratigraphy: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields(true, true);

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "stratigraphy");
        fetchStratigraphy(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.stratigraphy = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.stratigraphy);

            this.removeUnnecessaryFields(this.stratigraphy, this.copyFields);
            this.$emit("data-loaded", this.stratigraphy);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchListStratigraphyType().then(
          response =>
            (this.autocomplete.list_stratigraphy_type = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyRank().then(
          response =>
            (this.autocomplete.list_stratigraphy_rank = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyScope().then(
          response =>
            (this.autocomplete.list_stratigraphy_scope = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyStatus().then(
          response =>
            (this.autocomplete.list_stratigraphy_status = this.handleResponse(
              response
            ))
        );
      }

      if (relatedDataAutocompleteFields) {
        fetchListStratotypeType().then(
          response =>
            (this.autocomplete.list_stratotype_type = this.handleResponse(
              response
            ))
        );
        fetchListLanguages().then(
          response =>
            (this.autocomplete.list_language = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        stratigraphy_reference: [],
        stratigraphy_stratotype: [],
        stratigraphy_synonym: [],
        new: {
          stratigraphy_reference: [],
          stratigraphy_stratotype: [],
          stratigraphy_synonym: []
        },
        copyFields: {
          stratigraphy_reference: [
            "reference",
            "content",
            "content_en",
            "age_base",
            "age_base_error",
            "age_top",
            "is_preferred_age",
            "pages",
            "figures",
            "remarks"
          ],
          stratigraphy_stratotype: [
            "locality",
            "stratotype_type",
            "depth_base",
            "depth_top",
            "reference",
            "remarks"
          ],
          stratigraphy_synonym: ["synonym","language","reference","remarks"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          stratigraphy_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          stratigraphy_stratotype: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          stratigraphy_synonym: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          stratigraphy_reference: 0,
          stratigraphy_stratotype: 0,
          stratigraphy_synonym: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        stratigraphy_reference: {},
        stratigraphy_stratotype: {},
        stratigraphy_synonym: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;
      else uploadableObject.parent = null;
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      else uploadableObject.type = null;
      if (this.isNotEmpty(objectToUpload.rank))
        uploadableObject.rank = objectToUpload.rank.id;
      else uploadableObject.rank = null;
      if (this.isNotEmpty(objectToUpload.scope))
        uploadableObject.scope = objectToUpload.scope.id;
      else uploadableObject.scope = null;
      if (this.isNotEmpty(objectToUpload.status))
        uploadableObject.status = objectToUpload.status.id;
      else uploadableObject.status = null;
      if (this.isNotEmpty(objectToUpload.age_reference))
        uploadableObject.age_reference = objectToUpload.age_reference.id;
      else uploadableObject.age_reference = null;
      if (this.isNotEmpty(objectToUpload.age_chronostratigraphy))
        uploadableObject.age_chronostratigraphy =
          objectToUpload.age_chronostratigraphy.id;
      else uploadableObject.age_chronostratigraphy = null;

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            uploadableObject.related_data[tab.name] = this.relatedData[
              tab.name
            ];
        });
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.parent)) {
        this.stratigraphy.parent = {
          id: obj.parent,
          stratigraphy: obj.parent__stratigraphy,
          stratigraphy_en: obj.parent__stratigraphy_en
        };
        this.autocomplete.parent_stratigraphy.push(this.stratigraphy.parent);
      }
      if (this.isNotEmpty(obj.age_reference)) {
        this.stratigraphy.age_reference = {
          id: obj.age_reference,
          reference: obj.age_reference__reference
        };
        this.autocomplete.reference.push(this.stratigraphy.age_reference);
      }
      if (this.isNotEmpty(obj.age_chronostratigraphy)) {
        this.stratigraphy.age_chronostratigraphy = {
          id: obj.age_chronostratigraphy,
          stratigraphy: obj.age_chronostratigraphy__stratigraphy,
          stratigraphy_en: obj.age_chronostratigraphy__stratigraphy_en
        };
        this.autocomplete.age_chronostratigraphy.push(
          this.stratigraphy.age_chronostratigraphy
        );
      }
      if (this.isNotEmpty(obj.type)) {
        this.stratigraphy.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      }
      if (this.isNotEmpty(obj.rank)) {
        this.stratigraphy.rank = {
          id: obj.rank,
          value: obj.rank__value,
          value_en: obj.rank__value_en
        };
      }
      if (this.isNotEmpty(obj.scope)) {
        this.stratigraphy.scope = {
          id: obj.scope,
          value: obj.scope__value,
          value_en: obj.scope__value_en
        };
      }
      if (this.isNotEmpty(obj.status)) {
        this.stratigraphy.status = {
          id: obj.status,
          value: obj.status__value,
          value_en: obj.status__value_en
        };
      }
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.reference)){
        obj.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
        this.autocomplete.reference.push(obj.reference);
      }
      if (this.isNotEmpty(obj.locality)) {
        obj.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
        this.autocomplete.locality.push(obj.locality);
      }
      if (this.isNotEmpty(obj.stratotype_type))
        obj.stratotype_type = {
          id: obj.stratotype_type,
          value: obj.stratotype_type__value,
          value_en: obj.stratotype_type__value_en
        };
      if (this.isNotEmpty(obj.language))
        obj.language = {
          id: obj.language,
          value: obj.language__value,
          value_en: obj.language__value_en
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.locality)) {
        newObject.locality = obj.locality.id;
        newObject.locality__locality = obj.locality.locality;
        newObject.locality__locality_en = obj.locality.locality_en;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }
      if (this.isNotEmpty(obj.stratotype_type)) {
        newObject.stratotype_type = obj.stratotype_type.id;
        newObject.stratotype_type__value = obj.stratotype_type.value;
        newObject.stratotype_type__value_en = obj.stratotype_type.value_en;
      }
      if (this.isNotEmpty(obj.language)) {
        newObject.language = obj.language.id;
        newObject.language__value = obj.language.value;
        newObject.language__value_en = obj.language.value_en;
      }

      return newObject;
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

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.stratigraphy = this.stratigraphy.id;

      if (this.isNotEmpty(uploadableObject.locality)) {
        uploadableObject.locality = uploadableObject.locality.id
          ? uploadableObject.locality.id
          : uploadableObject.locality;
      }
      if (this.isNotEmpty(uploadableObject.reference)) {
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      }
      if (this.isNotEmpty(uploadableObject.stratotype_type)) {
        uploadableObject.stratotype_type = uploadableObject.stratotype_type.id
          ? uploadableObject.stratotype_type.id
          : uploadableObject.stratotype_type;
      }
      if (this.isNotEmpty(uploadableObject.language)) {
        uploadableObject.language = uploadableObject.language.id
          ? uploadableObject.language.id
          : uploadableObject.language;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        stratigraphy: null,
        type: null,
        rank: null,
        scope: null,
        parent: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
