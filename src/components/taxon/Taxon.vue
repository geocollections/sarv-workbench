<template>
  <div class="taxon">
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
          <span :class="validate('taxon') ? 'green--text' : 'red--text'">{{
            $t("taxon.generalInfo")
          }}</span>
          <v-icon right :class="validate('taxon') ? 'green--text' : 'red--text'"
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
          <!-- TAXON, AUTHOR_YEAR and REFERENCE  -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="taxon.taxon"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="taxon.author_year"
                :color="bodyActiveColor"
                :label="$t('taxon.author_year')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('taxon.reference_original')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>
          </v-row>

          <!-- RANK, PARENT and TAXON_EPITHET  -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.rank"
                :color="bodyActiveColor"
                :items="autocomplete.rank"
                :loading="autocomplete.loaders.rank"
                :item-text="rankLabel"
                :label="$t('taxon.rank')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.parent"
                :color="bodyActiveColor"
                :items="autocomplete.parent"
                :loading="autocomplete.loaders.parent"
                item-text="taxon"
                :label="$t('taxon.parent')"
                is-link
                route-object="taxon"
                is-searchable
                v-on:search:items="autocompleteTaxonParentSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="taxon.taxon_epithet"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_epithet')"
              />
            </v-col>
          </v-row>

          <!-- HIERARCHY_STRING, FOSSIL_GROUP and IS_FOSSIL_GROUP  -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="taxon.hierarchy_string"
                :color="bodyActiveColor"
                :label="$t('taxon.hierarchy_string')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.fossil_group"
                :color="bodyActiveColor"
                :items="autocomplete.fossil_group"
                :loading="autocomplete.loaders.fossil_group"
                item-text="taxon"
                :label="$t('taxon.fossil_group')"
                is-link
                route-object="taxon"
                is-searchable
                v-on:search:items="autocompleteTaxonFossilGroupSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <checkbox-wrapper
                v-model="taxon.is_fossil_group"
                :color="bodyActiveColor"
                :label="$t('taxon.is_fossil_group')"
                @change="taxon.is_fossil_group = !taxon.is_fossil_group"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- TAXON INFO -->
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
          <span>{{ $t("taxon.details") }}</span>
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
        <div v-show="block.details" class="pa-1">
          <!-- TAXON_ORIGINAL_NAME and RANK_ORIGINAL -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="taxon.taxon_original_name"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_original_name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.rank_original"
                :color="bodyActiveColor"
                :items="autocomplete.rank_original"
                :loading="autocomplete.loaders.rank_original"
                :item-text="rankLabel"
                :label="$t('taxon.rank_original')"
              />
            </v-col>
          </v-row>

          <!-- TYPE_TAXON_ID and TYPE_TAXON -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.type_taxon_id"
                :color="bodyActiveColor"
                :items="autocomplete.type_taxon_id"
                :loading="autocomplete.loaders.type_taxon_id"
                item-text="taxon"
                :label="$t('taxon.type_taxon_id')"
                is-link
                route-object="taxon"
                is-searchable
                v-on:search:items="autocompleteTypeTaxonIdSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="taxon.type_taxon"
                :color="bodyActiveColor"
                :label="$t('taxon.type_taxon')"
              />
            </v-col>
          </v-row>

          <!-- IS_FOSSIL, IS_VALID, IN_ESTONIA and IN_BALTOSCANDIA -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="taxon.is_fossil"
                :color="bodyActiveColor"
                :label="$t('taxon.is_fossil')"
                @change="taxon.is_fossil = !taxon.is_fossil"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="taxon.is_valid"
                :color="bodyActiveColor"
                :label="$t('taxon.is_valid')"
                @change="taxon.is_valid = !taxon.is_valid"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="taxon.in_estonia"
                :color="bodyActiveColor"
                :label="$t('taxon.in_estonia')"
                @change="taxon.in_estonia = !taxon.in_estonia"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="taxon.in_baltoscandia"
                :color="bodyActiveColor"
                :label="$t('taxon.in_baltoscandia')"
                @change="taxon.in_baltoscandia = !taxon.in_baltoscandia"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_TOP and STRATIGRAPHY_BASE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('taxon.stratigraphy_top')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('taxon.stratigraphy_base')"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- ADDITIONAL INFO -->
    <v-card
      class="mt-2"
      id="block-additionalInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.additionalInfo = !block.additionalInfo"
        >
          <span>{{ $t("taxon.additionalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.additionalInfo = !block.additionalInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.additionalInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="pa-1">
          <!-- TAXON_ID_PBDB, TAXON_ID_PLUTOF, TAXON_ID_TOL, TAXON_ID_EOL and TAXON_ID_NRM -->
          <v-row no-gutters>
            <v-col class="pa-1" cols="12" md="">
              <input-wrapper
                v-model="taxon.taxon_id_pbdb"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_id_pbdb')"
                type="number"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="">
              <input-wrapper
                v-model="taxon.taxon_id_plutof"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_id_plutof')"
                type="number"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="">
              <input-wrapper
                v-model="taxon.taxon_id_tol"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_id_tol')"
                type="number"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="">
              <input-wrapper
                v-model="taxon.taxon_id_eol"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_id_eol')"
                type="number"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="">
              <input-wrapper
                v-model="taxon.taxon_id_nrm"
                :color="bodyActiveColor"
                :label="$t('taxon.taxon_id_nrm')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- OWNER, IS_AUTHORIZED, USER_AUTHORIZED, SORT -->
          <v-row no-gutters>
            <v-col class="pa-1" cols="12" md="3">
              <input-wrapper
                v-model="taxon.owner"
                :color="bodyActiveColor"
                :label="$t('taxon.owner')"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="3">
              <checkbox-wrapper
                v-model="taxon.is_authorized"
                :color="bodyActiveColor"
                :label="$t('taxon.is_authorized')"
                @change="taxon.is_authorized = !taxon.is_authorized"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="3">
              <input-wrapper
                v-model="taxon.user_authorized"
                :color="bodyActiveColor"
                :label="$t('taxon.user_authorized')"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="3">
              <input-wrapper
                v-model="taxon.sort"
                :color="bodyActiveColor"
                :label="$t('taxon.sort')"
                type="number"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS-->
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
          <span>{{ $t("taxon.description") }}</span>
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
                v-model="taxon.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS  -->
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
          v-for="tab in filteredRelatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("taxon.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2 blue--text"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <taxon-subclass-table
            v-if="$route.meta.isEdit"
            v-show="activeTab === 'taxon_subclass'"
            :response="relatedData.taxon_subclass"
            :search-parameters="relatedData.searchParameters.taxon_subclass"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-synonym-table
            v-show="activeTab === 'taxon_synonym'"
            :response="relatedData.taxon_synonym"
            :search-parameters="relatedData.searchParameters.taxon_synonym"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-type-specimen-table
            v-show="activeTab === 'taxon_type_specimen'"
            :response="relatedData.taxon_type_specimen"
            :search-parameters="
              relatedData.searchParameters.taxon_type_specimen
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-occurrence-table
            v-show="activeTab === 'taxon_occurrence'"
            :response="relatedData.taxon_occurrence"
            :search-parameters="relatedData.searchParameters.taxon_occurrence"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-opinion-table
            v-show="activeTab === 'taxon_opinion'"
            :response="relatedData.taxon_opinion"
            :search-parameters="relatedData.searchParameters.taxon_opinion"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-common-name-table
            v-show="activeTab === 'taxon_common_name'"
            :response="relatedData.taxon_common_name"
            :search-parameters="relatedData.searchParameters.taxon_common_name"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-description-table
            v-show="activeTab === 'taxon_description'"
            :response="relatedData.taxon_description"
            :search-parameters="relatedData.searchParameters.taxon_description"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <taxon-page-table
            v-show="activeTab === 'taxon_page'"
            :response="relatedData.taxon_page"
            :search-parameters="relatedData.searchParameters.taxon_page"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'taxon_image'">
            <file-upload
              show-existing
              :files-from-object="relatedData.taxon_image.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :is-draggable="$route.meta.isEdit"
            />
          </div>

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"
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
                    relatedData[activeTab].count /
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
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="taxon.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="taxon.is_private = !taxon.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchTaxon,
  fetchTaxonSubclass,
  fetchTaxonCommonName,
  fetchTaxonDescription,
  fetchTaxonImage,
  fetchTaxonOccurrence,
  fetchTaxonOpinion,
  fetchTaxonPage,
  fetchTaxonRank,
  fetchTaxonSynonym,
  fetchTaxonTypeSpecimen
} from "../../assets/js/api/apiCalls";
import Spinner from "vue-simple-spinner";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileUpload from "../partial/inputs/FileInput";
import TaxonSubclassTable from "./relatedTables/TaxonSubclassTable";
import TaxonSynonymTable from "./relatedTables/TaxonSynonymTable";
import requestsMixin from "../../mixins/requestsMixin";
import TaxonTypeSpecimenTable from "./relatedTables/TaxonTypeSpecimenTable";
import TaxonOccurrenceTable from "./relatedTables/TaxonOccurrenceTable";
import TaxonOpinionTable from "./relatedTables/TaxonOpinionTable";
import TaxonCommonNameTable from "./relatedTables/TaxonCommonNameTable";
import TaxonDescriptionTable from "./relatedTables/TaxonDescriptionTable";
import TaxonPageTable from "./relatedTables/TaxonPageTable";

export default {
  name: "Taxon",

  components: {
    TaxonPageTable,
    TaxonDescriptionTable,
    TaxonCommonNameTable,
    TaxonOpinionTable,
    TaxonOccurrenceTable,
    TaxonTypeSpecimenTable,
    TaxonSynonymTable,
    TaxonSubclassTable,
    FileUpload,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    Spinner
  },

  props: {
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin
  ],

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
        searchHistory: "taxonSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_TAXA",
        title: "header.taxa",
        object: "taxon",
        field: "taxon",
        databaseId: this.databaseId,
        block: this.block
      });
    } else {
      // Adding taxon default values from local storage
      const taxonHistory = this.$localStorage.get("taxon", "fallbackValue");
      if (
        taxonHistory !== "fallbackValue" &&
        Object.keys(taxonHistory).length !== 0 &&
        taxonHistory.constructor === Object
      ) {
        this.taxon = taxonHistory;
      }
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler() {
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

    filteredRelatedTabs() {
      return this.relatedTabs.filter(tab => {
        if (!this.$route.meta.isEdit) {
          if (tab.name !== "taxon_subclass") return tab;
        } else return tab;
      });
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
          { name: "taxon_subclass", iconClass: "fas fa-pastafarianism" },
          { name: "taxon_synonym", iconClass: "far fa-clone" },
          { name: "taxon_type_specimen", iconClass: "fas fa-fish" },
          { name: "taxon_occurrence", iconClass: "fas fa-mountain" },
          { name: "taxon_opinion", iconClass: "far fa-lightbulb" },
          { name: "taxon_common_name", iconClass: "fas fa-signature" },
          { name: "taxon_description", iconClass: "far fa-comment-dots" },
          { name: "taxon_page", iconClass: "fas fa-pager" },
          { name: "taxon_image", iconClass: "far fa-image" }
        ],
        searchHistory: "taxonSearchHistory",
        activeTab: this.$route.meta.isEdit ? "taxon_subclass" : "taxon_synonym",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "taxon",
          "author_year",
          "taxon_epithet",
          "taxon_original_name",
          "reference",
          "parent",
          "fossil_group",
          "hierarchy_string",
          "rank",
          "rank_original",
          "type_taxon_id",
          "type_taxon",
          "stratigraphy_base",
          "stratigraphy_top",
          "in_estonia",
          "in_baltoscandia",
          "is_fossil",
          "is_private",
          "is_valid",
          "is_fossil_group",
          "sort",
          "taxon_id_pbdb",
          "taxon_id_plutof",
          "taxon_id_tol",
          "taxon_id_eol",
          "taxon_id_nrm",
          "remarks",
          "owner",
          "is_authorized",
          "user_authorized"
        ],
        autocomplete: {
          loaders: {
            reference: false,
            rank: false,
            parent: false,
            fossil_group: false,
            rank_original: false,
            type_taxon_id: false,
            stratigraphy_top: false,
            stratigraphy_base: false,
            agent: false,
            taxon_type_type: false,
            specimen: false,
            locality: false,
            stratigraphy: false,
            opinion_type: false,
            taxon: false,
            language: false,
            attachment: false
          },
          reference: [],
          rank: [],
          parent: [],
          fossil_group: [],
          rank_original: [],
          type_taxon_id: [],
          stratigraphy_top: [],
          stratigraphy_base: [],
          agent: [],
          taxon_type_type: [],
          specimen: [],
          locality: [],
          stratigraphy: [],
          opinion_type: [],
          taxon: [],
          language: [],
          attachment: []
        },
        requiredFields: ["taxon"],
        taxon: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          details: true,
          additionalInfo: true,
          description: true
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
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "taxon");
        fetchTaxon(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.taxon = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.taxon);

            this.removeUnnecessaryFields(this.taxon, this.copyFields);
            this.$emit("data-loaded", this.taxon);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);
      }
    },

    loadAutocompleteFields() {
      fetchTaxonRank().then(response => {
        this.autocomplete.rank = this.handleResponse(response);
        this.autocomplete.rank_original = this.handleResponse(response);
      });
    },

    setDefaultRelatedData() {
      return {
        taxon_subclass: { count: 0, results: [] },
        taxon_synonym: { count: 0, results: [] },
        taxon_type_specimen: { count: 0, results: [] },
        taxon_occurrence: { count: 0, results: [] },
        taxon_opinion: { count: 0, results: [] },
        taxon_common_name: { count: 0, results: [] },
        taxon_description: { count: 0, results: [] },
        taxon_page: { count: 0, results: [] },
        taxon_image: { count: 0, results: [] },
        searchParameters: {
          taxon_subclass: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_synonym: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_type_specimen: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_occurrence: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_opinion: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_common_name: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_description: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_page: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          taxon_image: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true]
          }
        }
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach(key => {
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

      // Adding related data only on add view
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name === "taxon_image") {
              uploadableObject.related_data.attachment = this.relatedData.taxon_image.results;
            } else {
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
              ].results;
            }
        });
      } else {
        uploadableObject.related_data = {};
        uploadableObject.related_data.attachment = this.relatedData.taxon_image.results;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.reference)) {
        this.taxon.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
        this.autocomplete.reference.push(this.taxon.reference);
      }
      if (this.isNotEmpty(obj.rank)) {
        this.taxon.rank = {
          id: obj.rank,
          rank: obj.rank__rank,
          rank_en: obj.rank__rank_en
        };
      }
      if (this.isNotEmpty(obj.rank_original)) {
        this.taxon.rank_original = {
          id: obj.rank_original,
          rank: obj.rank_original__rank,
          rank_en: obj.rank_original__rank_en
        };
      }
      if (this.isNotEmpty(obj.parent)) {
        this.taxon.parent = { id: obj.parent, taxon: obj.parent__taxon };
        this.autocomplete.parent.push(this.taxon.parent);
      }
      if (this.isNotEmpty(obj.fossil_group)) {
        this.taxon.fossil_group = {
          id: obj.fossil_group,
          taxon: obj.fossil_group__taxon
        };
        this.autocomplete.fossil_group.push(this.taxon.fossil_group);
      }
      if (this.isNotEmpty(obj.type_taxon_id)) {
        this.taxon.type_taxon_id = {
          id: obj.type_taxon_id,
          taxon: obj.type_taxon
        };
        this.autocomplete.type_taxon_id.push(this.taxon.type_taxon_id);
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        this.taxon.stratigraphy_top = {
          id: obj.stratigraphy_top,
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en
        };
        this.autocomplete.stratigraphy_top.push(this.taxon.stratigraphy_top);
      }
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        this.taxon.stratigraphy_base = {
          id: obj.stratigraphy_base,
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en
        };
        this.autocomplete.stratigraphy_base.push(this.taxon.stratigraphy_base);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "taxon_subclass") {
        query = fetchTaxonSubclass(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_subclass
        );
      } else if (object === "taxon_synonym") {
        query = fetchTaxonSynonym(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_synonym
        );
      } else if (object === "taxon_type_specimen") {
        query = fetchTaxonTypeSpecimen(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_type_specimen
        );
      } else if (object === "taxon_occurrence") {
        query = fetchTaxonOccurrence(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_occurrence
        );
      } else if (object === "taxon_opinion") {
        query = fetchTaxonOpinion(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_opinion
        );
      } else if (object === "taxon_common_name") {
        query = fetchTaxonCommonName(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_common_name
        );
      } else if (object === "taxon_description") {
        query = fetchTaxonDescription(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_description
        );
      } else if (object === "taxon_page") {
        query = fetchTaxonPage(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_page
        );
      } else if (object === "taxon_image") {
        query = fetchTaxonImage(
          this.$route.params.id,
          this.relatedData.searchParameters.taxon_image
        );
      }

      query.then(response => {
        if (object === "taxon_image") {
          let taxonImageResponse = this.handleResponse(response);

          this.relatedData.taxon_image.results = taxonImageResponse.map(
            image => {
              return {
                id: image.attachment,
                author__agent: image.attachment__author__agent,
                original_filename: image.attachment__original_filename,
                description: image.attachment__description,
                description_en: image.attachment__description_en,
                remarks: image.attachment__remarks,
                uuid_filename: image.attachment__uuid_filename,
                attachment_format__value:
                  image.attachment__attachment_format__value
              };
            }
          );
        } else {
          this.relatedData[object].results = this.handleResponse(response);
        }
        this.relatedData[object].count = response.data.count;
      });
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        taxon: null,
        author_year: null,
        taxon_epithet: null,
        parent__taxon: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "taxon");
    },

    addExistingFiles(files) {
      this.relatedData.taxon_image.count = files.length;
      this.relatedData.taxon_image.results = files;
    }
  }
};
</script>

<style scoped></style>
