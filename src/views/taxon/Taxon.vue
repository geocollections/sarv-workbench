<template>
  <div class="taxon">
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
            $t("common.generalInfo")
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
                :items="autocomplete.taxon_rank"
                :loading="autocomplete.loaders.taxon_rank"
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
                @input="updateHierarchyString"
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
                :items="autocomplete.taxon_rank"
                :loading="autocomplete.loaders.taxon_rank"
                :item-text="rankLabel"
                :label="$t('taxon.rank_original')"
              />
            </v-col>
          </v-row>

          <!-- TYPE_TAXON and TYPE_TAXON_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="taxon.type_taxon"
                :color="bodyActiveColor"
                :items="autocomplete.type_taxon"
                :loading="autocomplete.loaders.type_taxon"
                item-text="taxon"
                :label="$t('taxon.type_taxon_id')"
                is-link
                route-object="taxon"
                is-searchable
                v-on:search:items="autocompleteTypeTaxonSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="taxon.type_taxon_txt"
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

          <!-- STRATIGRAPHY_BASE and STRATIGRAPHY_TOP -->
          <v-row no-gutters>
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
                :label="$t('common.owner')"
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
              <editor v-model="taxon.remarks" :label="$t('common.remarks')" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED FILES -->
    <v-card
      v-if="$route.meta.isEdit"
      class="mt-2"
      id="block-files"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{ $t("reference.relatedTables.attachment") }}</span>
          <v-icon right>fas fa-folder-open</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.files = !block.files"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <file-input
                show-existing
                :files-from-object="taxon.attachments"
                @update:existing-files="taxon.attachments = $event"
                @file-uploaded="addFiles"
                accept-multiple
                :record-options="$route.meta.isEdit"
                open-file
                acceptable-format="*/*"
                :is-draggable="$route.meta.isEdit"
                show-attachment-link
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS  -->
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
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <taxon-subclass-table
            v-if="$route.meta.isEdit"
            v-show="activeTab === 'taxon'"
            :response="relatedData.taxon"
            :search-parameters="relatedData.searchParameters.taxon"
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

          <taxon-image-table
            v-show="activeTab === 'taxon_image'"
            :response="relatedData.taxon_image"
            :search-parameters="relatedData.searchParameters.taxon_image"
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
            :items-per-page="relatedData.searchParameters[activeTab].itemsPerPage"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { mapActions } from "vuex";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import FileInput from "@/components/partial/inputs/FileInput";
import TaxonSubclassTable from "@/components/taxon/relatedTables/TaxonSubclassTable";
import TaxonSynonymTable from "@/components/taxon/relatedTables/TaxonSynonymTable";
import TaxonTypeSpecimenTable from "@/components/taxon/relatedTables/TaxonTypeSpecimenTable";
import TaxonOccurrenceTable from "@/components/taxon/relatedTables/TaxonOccurrenceTable";
import TaxonOpinionTable from "@/components/taxon/relatedTables/TaxonOpinionTable";
import TaxonCommonNameTable from "@/components/taxon/relatedTables/TaxonCommonNameTable";
import TaxonDescriptionTable from "@/components/taxon/relatedTables/TaxonDescriptionTable";
import TaxonPageTable from "@/components/taxon/relatedTables/TaxonPageTable";
import TaxonImageTable from "@/components/taxon/relatedTables/TaxonImageTable";
import Editor from "@/components/partial/inputs/Editor";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Taxon",

  components: {
    Pagination,
    Editor,
    TaxonImageTable,
    TaxonPageTable,
    TaxonDescriptionTable,
    TaxonCommonNameTable,
    TaxonOpinionTable,
    TaxonOccurrenceTable,
    TaxonTypeSpecimenTable,
    TaxonSynonymTable,
    TaxonSubclassTable,
    FileInput,
    CheckboxWrapper,
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  computed: {
    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

    filteredRelatedTabs() {
      return this.relatedTabs.filter((tab) => {
        if (!this.$route.meta.isEdit) {
          if (tab.name !== "taxon") return tab;
        } else return tab;
      });
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),
    ...mapActions("detail", ["saveFields", "resetFields"]),

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
          { name: "taxon", iconClass: "fas fa-pastafarianism" },
          { name: "taxon_synonym", iconClass: "far fa-clone" },
          { name: "taxon_type_specimen", iconClass: "fas fa-fish" },
          { name: "taxon_occurrence", iconClass: "fas fa-mountain" },
          { name: "taxon_opinion", iconClass: "far fa-lightbulb" },
          { name: "taxon_common_name", iconClass: "fas fa-signature" },
          { name: "taxon_description", iconClass: "far fa-comment-dots" },
          { name: "taxon_page", iconClass: "fas fa-pager" },
          { name: "taxon_image", iconClass: "far fa-image" },
        ],
        activeTab: "taxon",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["taxon_rank"],
        autocomplete: {
          loaders: {
            reference: false,
            rank: false,
            parent: false,
            fossil_group: false,
            rank_original: false,
            type_taxon: false,
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
            attachments: false,
            taxon_rank: false,
          },
          reference: [],
          rank: [],
          parent: [],
          fossil_group: [],
          rank_original: [],
          type_taxon: [],
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
          attachments: [],
          taxon_rank: [],
        },
        requiredFields: ["taxon"],
        taxon: {
          id: null,
          taxon: null,
          author_year: null,
          taxon_epithet: null,
          taxon_original_name: null,
          reference: null,
          parent: null,
          fossil_group: null,
          hierarchy_string: null,
          rank: null,
          rank_original: null,
          type_taxon: null,
          type_taxon_txt: null,
          stratigraphy_base: null,
          stratigraphy_top: null,
          in_estonia: false,
          in_baltoscandia: false,
          is_fossil: false,
          is_private: false,
          is_valid: false,
          is_fossil_group: false,
          sort: null,
          taxon_id_pbdb: null,
          taxon_id_plutof: null,
          taxon_id_tol: null,
          taxon_id_eol: null,
          taxon_id_nrm: null,
          remarks: null,
          owner: null,
          is_authorized: false,
          user_authorized: null,
          attachments: [],
        },
        block: {
          info: true,
          details: true,
          additionalInfo: true,
          description: true,
          files: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        taxon: { count: 0, results: [] },
        taxon_synonym: { count: 0, results: [] },
        taxon_type_specimen: { count: 0, results: [] },
        taxon_occurrence: { count: 0, results: [] },
        taxon_opinion: { count: 0, results: [] },
        taxon_common_name: { count: 0, results: [] },
        taxon_description: { count: 0, results: [] },
        taxon_page: { count: 0, results: [] },
        taxon_image: { count: 0, results: [] },
        searchParameters: {
          taxon: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_synonym: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["year"],
            sortDesc: [true],
          },
          taxon_type_specimen: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_occurrence: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_opinion: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_common_name: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_description: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_page: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          taxon_image: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    addFiles(files, singleFileMetadata) {
      this.addFilesAsNewObjects(files, this.taxon, singleFileMetadata);
    },

    updateHierarchyString(parentTaxon) {
      if (this.$route.meta.isEdit && parentTaxon?.hierarchy_string) {
        this.taxon.hierarchy_string =
          parentTaxon.hierarchy_string + "-" + this.$route.params.id;
      }
    },
  },
};
</script>
