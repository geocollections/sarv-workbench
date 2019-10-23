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
                @search-change="autocompleteTaxonSearch"
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
                @search-change="autocompleteTaxonSearch"
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
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.details">
          <!-- TAXON_ORIGINAL_NAME and RANK_ORIGINAL -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`taxon_original_name`">{{ $t("taxon.taxon_original_name") }}:</label>
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
              <label :for="`type_taxon_id`">{{ $t("taxon.type_taxon_id") }}:</label>
              <vue-multiselect
                id="type_taxon_id"
                v-model="taxon.type_taxon_id"
                label="taxon"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.type_taxon_id"
                :options="autocomplete.type_taxon_id"
                @search-change="autocompleteTaxonSearch"
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
              <label :for="`type_taxon`"
                >{{ $t("taxon.type_taxon") }}:</label
              >
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
              <label :for="`stratigraphy_top`">{{ $t("taxon.stratigraphy_top") }}:</label>
              <vue-multiselect
                v-model="taxon.stratigraphy_top"
                id="stratigraphy_top"
                track-by="id"
                :label="stratigraphyLabel"
                :options="autocomplete.stratigraphy_top"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteStratigraphySearch"
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
                @search-change="autocompleteStratigraphySearch"
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
        <i class="fas fa-info"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.additionalInfo">
          <!-- TAXON_ID_PBDB, TAXON_ID_PLUTOF, TAXON_ID_TOL, TAXON_ID_EOL and TAXON_ID_NRM -->
          <div class="row">
            <div class="col-md-2">
              <label :for="`taxon_id_pbdb`">{{ $t("taxon.taxon_id_pbdb") }}:</label>
              <b-form-input
                id="taxon_id_pbdb"
                v-model="taxon.taxon_id_pbdb"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`taxon_id_plutof`">{{ $t("taxon.taxon_id_plutof") }}:</label>
              <b-form-input
                id="taxon_id_plutof"
                v-model="taxon.taxon_id_plutof"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`taxon_id_tol`">{{ $t("taxon.taxon_id_tol") }}:</label>
              <b-form-input
                id="taxon_id_tol"
                v-model="taxon.taxon_id_tol"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`taxon_id_eol`">{{ $t("taxon.taxon_id_eol") }}:</label>
              <b-form-input
                id="taxon_id_eol"
                v-model="taxon.taxon_id_eol"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-2">
              <label :for="`taxon_id_nrm`">{{ $t("taxon.taxon_id_nrm") }}:</label>
              <b-form-input
                id="taxon_id_nrm"
                v-model="taxon.taxon_id_nrm"
                type="number"
              ></b-form-input>
            </div>
          </div>

          <!-- OWNER, IS_AUTHORIZED, USER_AUTHORIZED, SORT -->
          <div class="row">
            <div class="col-md-3">
              <label :for="`owner`">{{ $t("taxon.owner") }}:</label>
              <b-form-input
                id="owner"
                v-model="taxon.owner"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-3 checkboxes">
              <label style="visibility: hidden;" :for="`is_authorized`">{{ $t("taxon.is_authorized") }}:</label>
              <v-checkbox
                v-model="taxon.is_authorized"
                :label="$t('taxon.is_authorized')"
                class="mt-0"
                hide-details
              ></v-checkbox>
            </div>

            <div class="col-md-3">
              <label :for="`user_authorized`">{{ $t("taxon.user_authorized") }}:</label>
              <b-form-input
                id="user_authorized"
                v-model="taxon.user_authorized"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-3">
              <label :for="`sort`">{{ $t("taxon.sort") }}:</label>
              <b-form-input
                id="sort"
                v-model="taxon.sort"
                type="number"
              ></b-form-input>
            </div>
          </div>
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

    <!-- RELATED DATA TABS -->
<!--    <div class="row mb-2">-->
<!--      <div class="col mt-2">-->
<!--        <ul class="nav nav-tabs nav-fill mb-3">-->
<!--          <li-->
<!--            class="nav-item"-->
<!--            v-for="tab in relatedTabs"-->
<!--            :key="tab.name"-->
<!--          >-->
<!--            <a-->
<!--              href="#"-->
<!--              @click.prevent="setTab(tab.name)"-->
<!--              class="nav-link"-->
<!--              :class="{ active: activeTab === tab.name }"-->
<!--            >-->
<!--              <span>{{ $t("specimen.relatedTables." + tab.name) }}</span>-->

<!--              <v-chip-->
<!--                v-if="relatedData[tab.name].length > 0"-->
<!--                class="ml-1"-->
<!--                color="blue lighten-2"-->
<!--                dark-->
<!--                outlined-->
<!--              >-->
<!--                <v-icon left small>{{ tab.iconClass }}</v-icon>-->
<!--                <b style="color: black; font-size: larger;">-->
<!--                  {{ relatedData[tab.name].length }}-->
<!--                </b>-->
<!--              </v-chip>-->

<!--              &lt;!&ndash;              <span>&ndash;&gt;-->
<!--              &lt;!&ndash;                <sup>&ndash;&gt;-->
<!--              &lt;!&ndash;                  <b-badge pill variant="light">{{ relatedData[tab.name].length }}&nbsp;</b-badge>&ndash;&gt;-->
<!--              &lt;!&ndash;                </sup>&ndash;&gt;-->
<!--              &lt;!&ndash;              </span>&ndash;&gt;-->

<!--              &lt;!&ndash;              <span><i :class="tab.iconClass"></i></span>&ndash;&gt;-->
<!--            </a>-->
<!--          </li>-->
<!--        </ul>-->

<!--        <div class="row" v-if="$route.meta.isEdit">-->
<!--          <div class="col-sm-6 col-md-3 pl-3 pr-3  t-paginate-by-center">-->
<!--            <b-form-select-->
<!--              v-model="relatedData.searchParameters[activeTab].paginateBy"-->
<!--              class="mb-3"-->
<!--              size="sm"-->
<!--            >-->
<!--              <option :value="10">{{-->
<!--                this.$t("main.pagination", { num: "10" })-->
<!--              }}</option>-->
<!--              <option :value="25">{{-->
<!--                this.$t("main.pagination", { num: "25" })-->
<!--              }}</option>-->
<!--              <option :value="50">{{-->
<!--                this.$t("main.pagination", { num: "50" })-->
<!--              }}</option>-->
<!--              <option :value="100">{{-->
<!--                this.$t("main.pagination", { num: "100" })-->
<!--              }}</option>-->
<!--              <option :value="250">{{-->
<!--                this.$t("main.pagination", { num: "250" })-->
<!--              }}</option>-->
<!--              <option :value="500">{{-->
<!--                this.$t("main.pagination", { num: "500" })-->
<!--              }}</option>-->
<!--              <option :value="1000">{{-->
<!--                this.$t("main.pagination", { num: "1000" })-->
<!--              }}</option>-->
<!--            </b-form-select>-->
<!--          </div>-->

<!--          <div class="col-sm-12 col-md-3 export-center">-->
<!--            &lt;!&ndash; EXPORT BUTTON? &ndash;&gt;-->
<!--          </div>-->

<!--          <div-->
<!--            class="col-sm-12 col-md-6 pagination-center"-->
<!--            v-if="-->
<!--              relatedData[activeTab] !== null &&-->
<!--                relatedData[activeTab].length > 0-->
<!--            "-->
<!--          >-->
<!--            <b-pagination-->
<!--              size="sm"-->
<!--              align="right"-->
<!--              :limit="5"-->
<!--              :hide-ellipsis="true"-->
<!--              :total-rows="relatedData.count[activeTab]"-->
<!--              v-model="relatedData.searchParameters[activeTab].page"-->
<!--              :per-page="relatedData.searchParameters[activeTab].paginateBy"-->
<!--            >-->
<!--            </b-pagination>-->
<!--          </div>-->
<!--        </div>-->

<!--        <specimen-identification-->
<!--          v-if="-->
<!--            specimen.fossil &&-->
<!--              (specimen.fossil.id === 1 || specimen.fossil.id === 7)-->
<!--          "-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-identification-geology-->
<!--          v-if="-->
<!--            specimen.fossil &&-->
<!--              (specimen.fossil.id === 1 || specimen.fossil.id === 7)-->
<!--          "-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-reference-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-description-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-attachment-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-location-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-history-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->

<!--        <specimen-analysis-->
<!--          :related-data="relatedData"-->
<!--          :autocomplete="autocomplete"-->
<!--          :active-tab="activeTab"-->
<!--          v-on:add-related-data="addRelatedData"-->
<!--          v-on:set-default="setDefault"-->
<!--          v-on:edit-row="editRow"-->
<!--          v-on:remove-row="removeRow"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->

    <!-- IS_PRIVATE -->
    <div class="row">
      <div class="col checkboxes">
        <v-checkbox
          v-model="taxon.is_private"
          :label="$t('taxon.is_private')"
          class="mt-0"
          hide-details
        ></v-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import cloneDeep from 'lodash/cloneDeep'
import {fetchTaxon} from "../../assets/js/api/apiCalls";
import Spinner from 'vue-simple-spinner'
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
      // Adding specimen default values from local storage
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
          { name: "specimen_identification", iconClass: "fas fa-atlas" },
          { name: "specimen_identification_geology", iconClass: "far fa-gem" },
          { name: "specimen_reference", iconClass: "fas fa-book" },
          { name: "specimen_description", iconClass: "fas fa-info" },
          { name: "attachment", iconClass: "far fa-folder-open" },
          { name: "specimen_location", iconClass: "fas fa-globe-europe" },
          { name: "specimen_history", iconClass: "fas fa-history" },
          { name: "analysis", iconClass: "far fa-chart-bar" }
        ],
        searchHistory: "taxonSearchHistory",
        activeTab: "specimen_identification",
        relatedData: this.setDefaultRelatedData(),
        copyFields: ["id"],
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
        // fetchDeaccession().then(
        //   response =>
        //     (this.autocomplete.deaccession = this.handleResponse(response))
        // );
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
        specimen_identification: [],
        specimen_identification_geology: [],
        specimen_reference: [],
        specimen_description: [],
        attachment: [],
        specimen_location: [],
        specimen_history: [],
        analysis: [],
        new: {
          specimen_identification: [],
          specimen_identification_geology: [],
          specimen_reference: [],
          specimen_description: [],
          attachment: [],
          specimen_location: [],
          specimen_history: [],
          analysis: []
        },
        copyFields: {
          specimen_identification: [
            "taxon",
            "name",
            "agent",
            "reference",
            "date_identified",
            "type",
            "current"
          ],
          specimen_identification_geology: [
            "rock",
            "name",
            "name_en",
            "agent",
            "reference",
            "date_identified",
            "type",
            "current"
          ],
          specimen_reference: ["reference", "pages", "figures", "remarks"],
          specimen_description: [
            "length",
            "width",
            "height",
            "unit",
            "mass",
            "description",
            "agent",
            "date",
            "remarks"
          ],
          attachment: ["attachment", "remarks"],
          specimen_location: ["number", "type", "part", "storage", "remarks"],
          specimen_history: [
            "type",
            "value_old",
            "value_new",
            "date",
            "remarks"
          ],
          analysis: [
            "analysis_method",
            "method_details",
            "mass",
            "date",
            "date_end",
            "date_free",
            "agent",
            "remarks",
            "storage",
            "is_private"
          ]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          specimen_identification: {
            page: 1,
            paginateBy: 10,
            orderBy: "taxon__taxon,current"
          },
          specimen_identification_geology: {
            page: 1,
            paginateBy: 10,
            orderBy: "rock__name,rock__name_en,current"
          },
          specimen_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "reference__reference"
          },
          specimen_description: {
            page: 1,
            paginateBy: 10,
            orderBy: "length"
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            orderBy: "original_filename"
          },
          specimen_location: {
            page: 1,
            paginateBy: 10,
            orderBy: "number"
          },
          specimen_history: {
            page: 1,
            paginateBy: 10,
            orderBy: "type"
          },
          analysis: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          specimen_identification: 0,
          specimen_identification_geology: 0,
          specimen_reference: 0,
          specimen_description: 0,
          attachment: 0,
          specimen_location: 0,
          specimen_history: 0,
          analysis: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        specimen_identification: {},
        specimen_identification_geology: {},
        specimen_reference: {},
        specimen_description: {},
        attachment: {},
        specimen_location: {},
        specimen_history: {},
        analysis: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.date_collected))
        uploadableObject.date_collected = this.formatDateForUpload(
          objectToUpload.date_collected
        );

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.coll))
        uploadableObject.coll = objectToUpload.coll.id;
      if (this.isNotEmpty(objectToUpload.fossil))
        uploadableObject.fossil = objectToUpload.fossil.id;
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.sample))
        uploadableObject.sample = objectToUpload.sample.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy))
        uploadableObject.stratigraphy = objectToUpload.stratigraphy.id;
      if (this.isNotEmpty(objectToUpload.lithostratigraphy))
        uploadableObject.lithostratigraphy =
          objectToUpload.lithostratigraphy.id;
      if (this.isNotEmpty(objectToUpload.presence))
        uploadableObject.presence = objectToUpload.presence.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;
      if (this.isNotEmpty(objectToUpload.classification))
        uploadableObject.classification = objectToUpload.classification.id;
      if (this.isNotEmpty(objectToUpload.accession))
        uploadableObject.accession = objectToUpload.accession.id;
      if (this.isNotEmpty(objectToUpload.deaccession))
        uploadableObject.deaccession = objectToUpload.deaccession.id;
      if (this.isNotEmpty(objectToUpload.agent_collected))
        uploadableObject.agent_collected = objectToUpload.agent_collected.id;
      if (this.isNotEmpty(objectToUpload.status))
        uploadableObject.status = objectToUpload.status.id;
      if (this.isNotEmpty(objectToUpload.original_status))
        uploadableObject.original_status = objectToUpload.original_status.id;
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;

      if (this.databaseId) uploadableObject.database = this.databaseId;

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
      if (this.isNotEmpty(obj.type)) {
        this.collection.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      }
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.taxon))
        obj.taxon = { id: obj.taxon, taxon: obj.taxon__taxon };
      if (this.isNotEmpty(obj.agent))
        obj.agent = { id: obj.agent, agent: obj.agent__agent };
      if (this.isNotEmpty(obj.reference))
        obj.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
      if (this.isNotEmpty(obj.type))
        obj.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      if (this.isNotEmpty(obj.rock))
        obj.rock = {
          id: obj.rock,
          name: obj.rock__name,
          name_en: obj.rock__name_en
        };
      if (this.isNotEmpty(obj.unit))
        obj.unit = {
          id: obj.unit,
          value: obj.unit__value,
          value_en: obj.unit__value_en
        };
      if (this.isNotEmpty(obj.original_filename))
        obj.attachment = {
          id: obj.id,
          original_filename: obj.original_filename
        };
      if (this.isNotEmpty(obj.storage))
        obj.storage = { id: obj.storage, location: obj.storage__location };
      if (this.isNotEmpty(obj.analysis_method))
        obj.analysis_method = {
          id: obj.analysis_method,
          analysis_method: obj.analysis_method__analysis_method,
          method_en: obj.analysis_method__method_en
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.taxon)) {
        newObject.taxon = obj.taxon.id;
        newObject.taxon__taxon = obj.taxon.taxon;
      }
      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }
      if (this.isNotEmpty(obj.type)) {
        newObject.type = obj.type.id;
        newObject.type__value = obj.type.value;
        newObject.type__value_en = obj.type.value_en;
      }
      if (this.isNotEmpty(obj.rock)) {
        newObject.rock = obj.rock.id;
        newObject.rock__name = obj.rock.name;
        newObject.rock__name_en = obj.rock.name_en;
      }
      if (this.isNotEmpty(obj.unit)) {
        newObject.unit = obj.unit.id;
        newObject.unit__value = obj.unit.value;
        newObject.unit__value_en = obj.unit.value_en;
      }
      if (this.isNotEmpty(obj.original_filename)) {
        newObject.attachment = obj.attachment.id;
        newObject.original_filename = obj.attachment.original_filename;
      }
      if (this.isNotEmpty(obj.storage)) {
        newObject.storage = obj.storage.id;
        newObject.storage__location = obj.storage.location;
      }
      if (this.isNotEmpty(obj.analysis_method)) {
        newObject.analysis_method = obj.analysis_method.id;
        newObject.analysis_method__analysis_method =
          obj.analysis_method.analysis_method;
        newObject.analysis_method__method_en = obj.analysis_method.method_en;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "specimen_identification") {
        query = fetchSpecimenIdentifications(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_identification
        );
      } else if (object === "specimen_identification_geology") {
        query = fetchSpecimenIdentificationGeologies(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_identification_geology
        );
      } else if (object === "specimen_reference") {
        query = fetchSpecimenReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_reference
        );
      } else if (object === "specimen_description") {
        query = fetchSpecimenDescriptions(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_description
        );
      } else if (object === "attachment") {
        query = fetchSpecimenAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment
        );
      } else if (object === "specimen_location") {
        query = fetchSpecimenLocations(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_location
        );
      } else if (object === "specimen_history") {
        query = fetchSpecimenHistory(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen_history
        );
      } else if (object === "analysis") {
        query = fetchSpecimenAnalyses(
          this.$route.params.id,
          this.relatedData.searchParameters.analysis
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
      if (this.isNotEmpty(uploadableObject.agent)) {
        uploadableObject.agent = uploadableObject.agent.id
          ? uploadableObject.agent.id
          : uploadableObject.agent;
      }
      if (this.isNotEmpty(uploadableObject.reference)) {
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      }
      if (this.isNotEmpty(uploadableObject.date_identified)) {
        uploadableObject.date_identified = this.formatDateForUpload(
          uploadableObject.date_identified
        );
      }
      if (this.isNotEmpty(uploadableObject.type)) {
        uploadableObject.type = uploadableObject.type.id
          ? uploadableObject.type.id
          : uploadableObject.type;
      }
      if (this.isNotEmpty(uploadableObject.rock)) {
        uploadableObject.rock = uploadableObject.rock.id
          ? uploadableObject.rock.id
          : uploadableObject.rock;
      }
      if (this.isNotEmpty(uploadableObject.unit)) {
        uploadableObject.unit = uploadableObject.unit.id
          ? uploadableObject.unit.id
          : uploadableObject.unit;
      }
      if (this.isNotEmpty(uploadableObject.date)) {
        uploadableObject.date = this.formatDateForUpload(uploadableObject.date);
      }
      if (this.isNotEmpty(uploadableObject.date_end)) {
        uploadableObject.date_end = this.formatDateForUpload(
          uploadableObject.date_end
        );
      }
      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }
      if (this.isNotEmpty(uploadableObject.storage)) {
        uploadableObject.storage = uploadableObject.storage.id
          ? uploadableObject.storage.id
          : uploadableObject.storage;
      }
      if (this.isNotEmpty(uploadableObject.analysis_method)) {
        uploadableObject.analysis_method = uploadableObject.analysis_method.id
          ? uploadableObject.analysis_method.id
          : uploadableObject.analysis_method;
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
