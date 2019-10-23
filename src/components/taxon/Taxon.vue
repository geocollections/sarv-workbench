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
    <fieldset
      class="border-top px-2 mb-2"
      :style="!validate('taxon') ? 'border-color: #dc3545!important;' : ''"
      id="block-info"
    >
      <legend
        class="w-auto my-0"
        :class="{
          'text-primary': !block.info,
          'text-danger': !validate('taxon')
        }"
        @click="block.info = !block.info"
      >
        {{ $t("taxon.generalInfo") }}
        <i
          v-if="validate('taxon')"
          class="fas fa-project-diagram text-success"
        ></i>
        <i
          v-if="!validate('taxon')"
          class="fas fa-project-diagram text-danger"
        ></i>
      </legend>

      <transition name="fade">
        <div v-if="block.info">
          <!-- TAXON, AUTHOR_YEAR and REFERENCE  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`taxon`">{{ $t("taxon.taxon") }}:</label>
              <b-form-input
                id="taxon"
                v-model="taxon.taxon"
                type="text"
                :state="isNotEmpty(taxon.taxon)"
              ></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`author_year`">{{ $t("taxon.author_year") }}:</label>
              <b-form-input
                id="author_year"
                v-model="taxon.author_year"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`reference`">{{ $t("taxon.reference") }}:</label>
              <vue-multiselect
                id="reference"
                v-model="taxon.reference"
                label="reference"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.reference"
                :options="autocomplete.reference"
                @search-change="autocompleteReferenceSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.reference }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>
          </div>

          <!-- RANK, PARENT and TAXON_EPITHET  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`rank`">{{ $t("taxon.rank") }}:</label>
              <vue-multiselect
                v-model="taxon.rank"
                id="rank"
                :options="autocomplete.rank"
                track-by="id"
                :label="rankLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[rankLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`parent`">{{ $t("taxon.parent") }}:</label>
              <vue-multiselect
                id="parent"
                v-model="taxon.parent"
                label="taxon"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.parent"
                :options="autocomplete.parent"
                @search-change="autocompleteTaxonParentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`taxon_epithet`"
                >{{ $t("taxon.taxon_epithet") }}:</label
              >
              <b-form-input
                id="taxon_epithet"
                v-model="taxon.taxon_epithet"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- HIERARCHY_STRING, FOSSIL_GROUP and IS_FOSSIL_GROUP  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`hierarchy_string`"
                >{{ $t("taxon.hierarchy_string") }}:</label
              >
              <b-form-input
                id="hierarchy_string"
                v-model="taxon.hierarchy_string"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`fossil_group`"
                >{{ $t("taxon.fossil_group") }}:</label
              >
              <vue-multiselect
                id="fossil_group"
                v-model="taxon.fossil_group"
                label="taxon"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.fossil_group"
                :options="autocomplete.fossil_group"
                @search-change="autocompleteTaxonFossilGroupSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-4 checkboxes">
              <label style="visibility: hidden;" :for="`is_fossil_group`"
                >{{ $t("taxon.is_fossil_group") }}:</label
              >
              <v-checkbox
                v-model="taxon.is_fossil_group"
                :label="$t('taxon.is_fossil_group')"
                class="mt-0"
                hide-details
              ></v-checkbox>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- TAXON INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-details">
      <legend
        class="w-auto my-0"
        :class="{ 'text-primary': !block.details }"
        @click="block.details = !block.details"
      >
        {{ $t("taxon.details") }}
        <i class="fas fa-info"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.details">
          <!-- TAXON_ORIGINAL_NAME and RANK_ORIGINAL -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`taxon_original_name`"
                >{{ $t("taxon.taxon_original_name") }}:</label
              >
              <b-form-input
                id="taxon_original_name"
                v-model="taxon.taxon_original_name"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`rank_original`"
                >{{ $t("taxon.rank_original") }}:</label
              >
              <vue-multiselect
                v-model="taxon.rank_original"
                id="rank_original"
                :options="autocomplete.rank_original"
                track-by="id"
                :label="rankLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[rankLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>
          </div>

          <!-- TYPE_TAXON_ID and TYPE_TAXON -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`type_taxon_id`"
                >{{ $t("taxon.type_taxon_id") }}:</label
              >
              <vue-multiselect
                id="type_taxon_id"
                v-model="taxon.type_taxon_id"
                label="taxon"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.type_taxon_id"
                :options="autocomplete.type_taxon_id"
                @search-change="autocompleteTypeTaxonIdSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.taxon }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`type_taxon`">{{ $t("taxon.type_taxon") }}:</label>
              <b-form-input
                id="type_taxon"
                v-model="taxon.type_taxon"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- IS_FOSSIL, IS_VALID, IN_ESTONIA and IN_BALTOSCANDIA -->
          <div class="row checkboxes">
            <div class="col-md-3">
              <v-checkbox
                v-model="taxon.is_fossil"
                :label="$t('taxon.is_fossil')"
                hide-details
              ></v-checkbox>
            </div>

            <div class="col-md-3">
              <v-checkbox
                v-model="taxon.is_valid"
                :label="$t('taxon.is_valid')"
                hide-details
              ></v-checkbox>
            </div>

            <div class="col-md-3">
              <v-checkbox
                v-model="taxon.in_estonia"
                :label="$t('taxon.in_estonia')"
                hide-details
              ></v-checkbox>
            </div>

            <div class="col-md-3">
              <v-checkbox
                v-model="taxon.in_baltoscandia"
                :label="$t('taxon.in_baltoscandia')"
                hide-details
              ></v-checkbox>
            </div>
          </div>

          <!-- STRATIGRAPHY_TOP and STRATIGRAPHY_BASE -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`stratigraphy_top`"
                >{{ $t("taxon.stratigraphy_top") }}:</label
              >
              <vue-multiselect
                v-model="taxon.stratigraphy_top"
                id="stratigraphy_top"
                track-by="id"
                :label="stratigraphyLabel"
                :options="autocomplete.stratigraphy_top"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteStratigraphyTopSearch"
                :loading="autocomplete.loaders.stratigraphy_top"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`stratigraphy_base`"
                >{{ $t("taxon.stratigraphy_base") }}:</label
              >
              <vue-multiselect
                v-model="taxon.stratigraphy_base"
                id="stratigraphy_base"
                track-by="id"
                :label="stratigraphyLabel"
                :options="autocomplete.stratigraphy_base"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteStratigraphyBaseSearch"
                :loading="autocomplete.loaders.stratigraphy"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[stratigraphyLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- ADDITIONAL INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-additionalInfo">
      <legend
        class="w-auto my-0"
        :class="{ 'text-primary': !block.additionalInfo }"
        @click="block.additionalInfo = !block.additionalInfo"
      >
        {{ $t("taxon.additionalInfo") }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.additionalInfo">
          <!-- TAXON_ID_PBDB, TAXON_ID_PLUTOF, TAXON_ID_TOL, TAXON_ID_EOL and TAXON_ID_NRM -->
          <v-row class="mt-2">
            <v-col class="mb-2" cols="12" md="">
              <v-text-field
                v-model="taxon.taxon_id_pbdb"
                dense
                hide-details
                :label="$t('taxon.taxon_id_pbdb')"
                outlined
                type="number"
              ></v-text-field>
            </v-col>

            <v-col class="mb-2" cols="12" md="">
              <v-text-field
                v-model="taxon.taxon_id_plutof"
                dense
                hide-details
                :label="$t('taxon.taxon_id_plutof')"
                outlined
                type="number"
              ></v-text-field>
            </v-col>

            <v-col class="mb-2" cols="12" md="">
              <v-text-field
                v-model="taxon.taxon_id_tol"
                dense
                hide-details
                :label="$t('taxon.taxon_id_tol')"
                outlined
                type="number"
              ></v-text-field>
            </v-col>

            <v-col class="mb-2" cols="12" md="">
              <v-text-field
                v-model="taxon.taxon_id_eol"
                dense
                hide-details
                :label="$t('taxon.taxon_id_eol')"
                outlined
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="">
              <v-text-field
                v-model="taxon.taxon_id_nrm"
                dense
                hide-details
                :label="$t('taxon.taxon_id_nrm')"
                outlined
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- OWNER, IS_AUTHORIZED, USER_AUTHORIZED, SORT -->
          <v-row class="mt-2">
            <v-col class="mb-2" cols="12" md="3">
              <v-text-field
                v-model="taxon.owner"
                :label="$t('taxon.owner')"
                dense
                hide-details
                outlined
              ></v-text-field>
            </v-col>

            <v-col class="mb-2 checkboxes" cols="12" md="3">
              <v-checkbox
                v-model="taxon.is_authorized"
                :label="$t('taxon.is_authorized')"
                class="mt-0"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col class="mb-2" cols="12" md="3">
              <v-text-field
                v-model="taxon.user_authorized"
                :label="$t('taxon.user_authorized')"
                dense
                hide-details
                outlined
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="taxon.sort"
                :label="$t('taxon.sort')"
                dense
                hide-details
                outlined
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset class="border-top px-2 mb-2" id="block-description">
      <legend
        class="w-auto my-0"
        :class="{ 'text-primary': !block.description }"
        @click="block.description = !block.description"
      >
        {{ $t("taxon.description") }}
        <i class="fas fa-pen-fancy"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.description">
          <!-- REMARKS -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t("taxon.remarks") }}:</label>
              <editor :data.sync="taxon.remarks" />
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- RELATED DATA TABS  -->
    <div class="row mb-2">
      <div class="col mt-2">
        <ul class="nav nav-tabs nav-fill mb-3">
          <li class="nav-item" v-for="tab in relatedTabs" :key="tab.name">
            <a
              href="#"
              @click.prevent="setTab(tab.name)"
              class="nav-link"
              :class="{ active: activeTab === tab.name }"
            >
              <span>{{ $t("taxon.relatedTables." + tab.name) }}</span>

              <v-chip
                v-if="relatedData[tab.name].length > 0"
                class="ml-1"
                color="blue lighten-2"
                dark
                outlined
              >
                <v-icon left small>{{ tab.iconClass }}</v-icon>
                <b style="color: black; font-size: larger;">
                  {{ relatedData[tab.name].length }}
                </b>
              </v-chip>
            </a>
          </li>
        </ul>

        <div class="row" v-if="$route.meta.isEdit">
          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">
            <b-form-select
              v-model="relatedData.searchParameters[activeTab].paginateBy"
              class="mb-3"
              size="sm"
            >
              <option :value="10">{{
                this.$t("main.pagination", { num: "10" })
              }}</option>
              <option :value="25">{{
                this.$t("main.pagination", { num: "25" })
              }}</option>
              <option :value="50">{{
                this.$t("main.pagination", { num: "50" })
              }}</option>
              <option :value="100">{{
                this.$t("main.pagination", { num: "100" })
              }}</option>
              <option :value="250">{{
                this.$t("main.pagination", { num: "250" })
              }}</option>
              <option :value="500">{{
                this.$t("main.pagination", { num: "500" })
              }}</option>
              <option :value="1000">{{
                this.$t("main.pagination", { num: "1000" })
              }}</option>
            </b-form-select>
          </div>

          <div class="col-sm-12 col-md-3 export-center">
            <!-- EXPORT BUTTON? -->
          </div>

          <div
            class="col-sm-12 col-md-6 pagination-center"
            v-if="
              relatedData[activeTab] !== null &&
                relatedData[activeTab].length > 0
            "
          >
            <b-pagination
              size="sm"
              align="right"
              :limit="5"
              :hide-ellipsis="true"
              :total-rows="relatedData.count[activeTab]"
              v-model="relatedData.searchParameters[activeTab].page"
              :per-page="relatedData.searchParameters[activeTab].paginateBy"
            >
            </b-pagination>
          </div>
        </div>

        <!--            <specimen-analysis-->
        <!--              :related-data="relatedData"-->
        <!--              :autocomplete="autocomplete"-->
        <!--              :active-tab="activeTab"-->
        <!--              v-on:add-related-data="addRelatedData"-->
        <!--              v-on:set-default="setDefault"-->
        <!--              v-on:edit-row="editRow"-->
        <!--              v-on:remove-row="removeRow"-->
        <!--            />-->
      </div>
    </div>

    <!-- IS_PRIVATE -->
    <v-row>
      <v-col class="checkboxes">
        <v-checkbox
          v-model="taxon.is_private"
          :label="$t('taxon.is_private')"
          class="mt-0"
          hide-details
        ></v-checkbox>
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
import { fetchTaxon, fetchTaxonRank } from "../../assets/js/api/apiCalls";
import Spinner from "vue-simple-spinner";
import Editor from "../partial/editor/Editor";

export default {
  name: "Taxon",

  components: {
    Editor,
    Spinner
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
          { name: "taxon_rank", iconClass: "fas fa-atlas" },
          { name: "taxon_synonym", iconClass: "far fa-gem" },
          { name: "taxon_type_specimen", iconClass: "fas fa-book" },
          { name: "taxon_occurence", iconClass: "fas fa-info" },
          { name: "taxon_opinion", iconClass: "far fa-folder-open" },
          { name: "taxon_common_name", iconClass: "fas fa-globe-europe" },
          { name: "taxon_description", iconClass: "fas fa-history" },
          { name: "taxon_page", iconClass: "far fa-chart-bar" },
          { name: "taxon_image", iconClass: "far fa-chart-bar" }
        ],
        searchHistory: "taxonSearchHistory",
        activeTab: "taxon_rank",
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
            stratigraphy_base: false
          },
          reference: [],
          rank: [],
          parent: [],
          fossil_group: [],
          rank_original: [],
          type_taxon_id: [],
          stratigraphy_top: [],
          stratigraphy_base: []
        },
        requiredFields: ["taxon"],
        taxon: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          details: true,
          additionalInfo: true,
          description: true
        }
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
        // this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit("related-data-info", this.relatedTabs.map(tab => tab.name));
      }
    },

    loadAutocompleteFields(
      regularAutocompleteFields = true,
      relatedDataAutocompleteFields = false
    ) {
      if (regularAutocompleteFields) {
        fetchTaxonRank().then(response => {
          this.autocomplete.rank = this.handleResponse(response);
          this.autocomplete.rank_original = this.handleResponse(response);
        });
      }

      if (relatedDataAutocompleteFields) {
        // fetchListHistoryType().then(
        //   response =>
        //     (this.autocomplete.list_history_type = this.handleResponse(
        //       response
        //     ))
        // );
      }
    },

    setDefaultRelatedData() {
      return {
        taxon_rank: [],
        taxon_synonym: [],
        taxon_type_specimen: [],
        taxon_occurence: [],
        taxon_opinion: [],
        taxon_common_name: [],
        taxon_description: [],
        taxon_page: [],
        taxon_image: [],
        new: {
          taxon_rank: [],
          taxon_synonym: [],
          taxon_type_specimen: [],
          taxon_occurence: [],
          taxon_opinion: [],
          taxon_common_name: [],
          taxon_description: [],
          taxon_page: [],
          taxon_image: []
        },
        copyFields: {
          taxon_rank: [],
          taxon_synonym: [],
          taxon_type_specimen: [],
          taxon_occurence: [],
          taxon_opinion: [],
          taxon_common_name: [],
          taxon_description: [],
          taxon_page: [],
          taxon_image: []
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          taxon_rank: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_synonym: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_type_specimen: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_occurence: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_opinion: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_common_name: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_description: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_page: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          taxon_image: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          taxon_rank: 0,
          taxon_synonym: 0,
          taxon_type_specimen: 0,
          taxon_occurence: 0,
          taxon_opinion: 0,
          taxon_common_name: 0,
          taxon_description: 0,
          taxon_page: 0,
          taxon_image: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        taxon_rank: {},
        taxon_synonym: {},
        taxon_type_specimen: {},
        taxon_occurence: {},
        taxon_opinion: {},
        taxon_common_name: {},
        taxon_description: {},
        taxon_page: {},
        taxon_image: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.reference))
        uploadableObject.reference = objectToUpload.reference.id;
      if (this.isNotEmpty(objectToUpload.rank))
        uploadableObject.rank = objectToUpload.rank.id;
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;
      if (this.isNotEmpty(objectToUpload.fossil_group))
        uploadableObject.fossil_group = objectToUpload.fossil_group.id;
      if (this.isNotEmpty(objectToUpload.rank_original))
        uploadableObject.rank_original = objectToUpload.rank_original.id;
      if (this.isNotEmpty(objectToUpload.type_taxon_id))
        uploadableObject.type_taxon_id = objectToUpload.type_taxon_id.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy_top))
        uploadableObject.stratigraphy_top = objectToUpload.stratigraphy_top.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy_base))
        uploadableObject.stratigraphy_base =
          objectToUpload.stratigraphy_base.id;

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
      if (this.isNotEmpty(obj.reference)) {
        this.taxon.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
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
      }
      if (this.isNotEmpty(obj.fossil_group)) {
        this.taxon.fossil_group = {
          id: obj.fossil_group,
          taxon: obj.fossil_group__taxon
        };
      }
      if (this.isNotEmpty(obj.type_taxon_id)) {
        this.taxon.type_taxon_id = {
          id: obj.type_taxon_id,
          taxon: obj.type_taxon
        };
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        this.taxon.stratigraphy_top = {
          id: obj.stratigraphy_top,
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en
        };
      }
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        this.taxon.stratigraphy_base = {
          id: obj.stratigraphy_base,
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en
        };
      }
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.taxon))
        obj.taxon = { id: obj.taxon, taxon: obj.taxon__taxon };
      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.taxon)) {
        newObject.taxon = obj.taxon.id;
        newObject.taxon__taxon = obj.taxon.taxon;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "specimen_identification") {
        // query = fetchSpecimenIdentifications(
        //   this.$route.params.id,
        //   this.relatedData.searchParameters.specimen_identification
        // );
      }

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    //check required fields for related data
    checkRequiredFields(type) {},

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.taxon = this.taxon.id;

      // Todo: Use foreach because DRY basically

      if (this.isNotEmpty(uploadableObject.taxon)) {
        uploadableObject.taxon = uploadableObject.taxon.id
          ? uploadableObject.taxon.id
          : uploadableObject.taxon;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
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
        orderBy: "-id"
      };
    }
  }
};
</script>

<style scoped>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}

.checkboxes >>> .v-label {
  margin-bottom: 0;
}
</style>
