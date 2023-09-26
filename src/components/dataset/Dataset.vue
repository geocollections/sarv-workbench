<template>
  <div class="dataset">
    <!-- REQUIRED INFO -->
    <v-card
      class="mt-2"
      id="block-requiredFields"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.requiredFields = !block.requiredFields"
        >
          <span :class="validate('dataset') ? 'green--text' : 'red--text'">{{
            $t("common.requiredFields")
          }}</span>
          <v-icon
            right
            :class="validate('dataset') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.requiredFields = !block.requiredFields"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.requiredFields ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.requiredFields" class="pa-1">
          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="dataset.title"
                :color="bodyActiveColor"
                :label="$t('dataset.title')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- RESOURCE TYPE and RESOURCE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                :value="$t('dataset.resourceTypePlaceholder')"
                :label="$t('doi.resourceTypeGeneral')"
                disabled
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.resource"
                :color="bodyActiveColor"
                :label="$t('doi.resource')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- CREATORS, YEAR and PUBLISHER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <v-tooltip top z-index="60000">
                <template v-slot:activator="{ on, attrs }">
                  <input-wrapper
                    v-on="on"
                    v-bind="attrs"
                    v-model="dataset.creators"
                    :color="bodyActiveColor"
                    :label="$t('doi.creators')"
                    use-state
                    readonly
                  />
                </template>
                <span>{{ $t("dataset.authorTooltip") }}</span>
              </v-tooltip>
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="dataset.publication_year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.publisher"
                :color="bodyActiveColor"
                :items="autocomplete.publishers"
                :loading="autocomplete.loaders.publishers"
                item-value="test"
                item-text="value"
                :label="$t('doi.publisher')"
                use-state
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("common.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- TITLE ALTERNATIVE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="dataset.title_alternative"
                :color="bodyActiveColor"
                :label="$t('doi.title_alternative')"
              />
            </v-col>
          </v-row>

          <!-- TITLE TRANSLATED and TITLE TRANSLATED LANGUAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.title_translated"
                :color="bodyActiveColor"
                :label="$t('doi.title_translated')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.title_translated_language"
                :color="bodyActiveColor"
                :items="autocomplete.language"
                :loading="autocomplete.loaders.language"
                :item-text="commonLabel"
                :label="$t('doi.title_translated_language')"
              />
            </v-col>
          </v-row>

          <!-- LANGUAGE, VERSION -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.language"
                :color="bodyActiveColor"
                :items="autocomplete.language"
                :loading="autocomplete.loaders.language"
                :item-text="commonLabel"
                :label="$t('doi.language')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="dataset.version"
                :color="bodyActiveColor"
                :label="$t('doi.version')"
              />
            </v-col>
          </v-row>

          <!-- SUBJECTS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="dataset.subjects"
                :color="bodyActiveColor"
                :label="$t('doi.subjects')"
              />
            </v-col>
          </v-row>

          <!-- ABSTRACT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="dataset.abstract"
                :color="bodyActiveColor"
                :label="$t('doi.abstract')"
              />
            </v-col>
          </v-row>

          <!-- METHODS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="dataset.methods"
                :color="bodyActiveColor"
                :label="$t('doi.methods')"
              />
            </v-col>
          </v-row>

          <!-- DATE, DATE_TXT, COPYRIGHT_AGENT and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <date-wrapper
                v-model="dataset.date"
                :color="bodyActiveColor"
                :label="$t('common.date')"
                v-on:date:clear="dataset.date = null"
                v-on:date:update="updateUserInputtedDate('date', $event)"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="dataset.date_txt"
                :color="bodyActiveColor"
                :label="$t('common.date_txt')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.copyright_agent"
                :color="bodyActiveColor"
                :items="autocomplete.copyright_agent"
                :loading="autocomplete.loaders.copyright_agent"
                item-text="agent"
                :label="$t('common.copyright_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteCopyrightAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.licence"
                :color="bodyActiveColor"
                :items="autocomplete.licence"
                :loading="autocomplete.loaders.licence"
                :item-text="licenceLabel"
                :label="$t('common.licence')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REFERENCE and LOCALITY -->
    <v-card
      class="mt-2"
      id="block-referenceAndLocality"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.referenceAndLocality = !block.referenceAndLocality"
        >
          <span>{{ $t("dataset.referenceAndLocality") }}</span>
          <v-icon right>fas fa-book</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.referenceAndLocality = !block.referenceAndLocality"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.referenceAndLocality ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.referenceAndLocality" class="pa-1">
          <!-- REFERENCE and LOCALITY -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.reference"
                :color="bodyActiveColor"
                :items="autocomplete.reference"
                :loading="autocomplete.loaders.reference"
                item-text="reference"
                :label="$t('dataset.reference')"
                is-link
                route-object="reference"
                is-searchable
                v-on:search:items="autocompleteReferenceSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('common.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
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
          <span>{{ $t("common.remarks") }}</span>
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
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.dataset_html"
                :color="bodyActiveColor"
                :label="$t('dataset.dataset_html')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="dataset.remarks"
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
          <span>{{ $t("dataset.relatedTables." + tab.name) }}</span>
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
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <dataset-author-table
            v-show="activeTab === 'dataset_author'"
            :response="relatedData.dataset_author"
            :search-parameters="relatedData.searchParameters.dataset_author"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <dataset-reference-table
            v-show="activeTab === 'dataset_reference'"
            :response="relatedData.dataset_reference"
            :search-parameters="relatedData.searchParameters.dataset_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <dataset-analysis-table
            v-show="activeTab === 'dataset_analysis'"
            :response="relatedData.dataset_analysis"
            :search-parameters="relatedData.searchParameters.dataset_analysis"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <dataset-geolocation-table
            v-show="activeTab === 'dataset_geolocation'"
            :response="relatedData.dataset_geolocation"
            :search-parameters="
              relatedData.searchParameters.dataset_geolocation
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
    <v-card
      v-if="$route.meta.isEdit"
      class="mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <span>{{ $t("dataset.fill_using_selection") }}</span>
        <v-icon right>fas fa-clipboard-list</v-icon>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.selection_series = !block.selection_series"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.selection_series ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.selection_series" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="selection_series"
                :color="bodyActiveColor"
                :items="autocomplete.selection_series"
                :loading="autocomplete.loaders.selection_series"
                :item-text="customSelectionSeriesLabel"
                :label="$t('dataset.selection_series')"
                is-link
                route-object="selection_series"
                is-searchable
                v-on:search:items="autocompleteSelectionSeriesSearch"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1 text-center text-sm-right">
              <v-dialog
                v-model="selectionSeriesDialog"
                max-width="500"
                style="z-index: 50000"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    @click="selectionSeriesDialog = true"
                    :disabled="!selection_series"
                    color="red darken-1"
                    class="white--text"
                    >{{ $t("dataset.fill_list") }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">{{
                    $t("dataset.fill_list")
                  }}</v-card-title>
                  <v-card-text>{{
                    $t("dataset.confirm_list_fill")
                  }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      small
                      class="white--text"
                      @click="selectionSeriesDialog = false"
                      >{{ $t("buttons.cancel") }}</v-btn
                    >
                    <v-btn
                      small
                      color="red darken-1"
                      @click="fillUsingSelectionSeries"
                      class="white--text"
                    >
                      {{ $t("dataset.fill_list_yes") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>
    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col class="d-flex">
        <checkbox-wrapper
          v-model="dataset.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="dataset.is_private = !dataset.is_private"
        />
        <autocomplete-wrapper
          class="ml-auto"
          v-model="dataset.database"
          :color="bodyActiveColor"
          :items="autocomplete.database"
          :loading="autocomplete.loaders.database"
          :item-text="nameLabel"
          :label="$t('common.institution')"
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapActions, mapState, mapGetters } from "vuex";
import {
  fetchDataset,
  fetchDatasetAnalyses,
  fetchDatasetAuthors,
  fetchDatasetGeolocation,
  fetchDatasetReferences,
  fetchDoiPublisher,
  fetchDoiResourceType,
  fetchListLanguages,
  fetchListLicences,
  fetchDatabase,
  fetchObjectPermissions,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import DatasetAuthorTable from "./relatedTables/DatasetAuthorTable";
import DatasetReferenceTable from "./relatedTables/DatasetReferenceTable";
import requestsMixin from "../../mixins/requestsMixin";
import DatasetAnalysisTable from "./relatedTables/DatasetAnalysisTable";
import Pagination from "@/components/partial/Pagination";
import  orderBy  from "lodash/orderBy";
import DatasetGeolocationTable from "@/components/dataset/relatedTables/DatasetGeolocationTable";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";
import {
  fetchIdsUsingSelection,
  fetchMultiAddDatasetLists,
} from "@/assets/js/api/apiCalls";
export default {
  name: "Dataset",

  components: {
    DatasetGeolocationTable,
    Pagination,
    DatasetAnalysisTable,
    DatasetReferenceTable,
    DatasetAuthorTable,
    CheckboxWrapper,
    AutocompleteWrapper,
    DateWrapper,
    TextareaWrapper,
    InputWrapper,
    ObjectPermissionsCreate,
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
    requestsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.datasetSearchParameters,
        request: "FETCH_DATASETS",
        title: "header.datasets",
        object: "dataset",
        field: "name",
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
        this.loadRelatedData(this.activeTab);
      },
      deep: true,
    },
    "relatedData.dataset_author.results": {
      handler(newVal) {
        if (newVal && newVal.length > 0) this.updateCreatorsField(newVal);
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"]),
    ...mapState("search", ["datasetSearchParameters"]),
    ...mapState("search", {
      activeRelatedDataTab: (state) => state.activeRelatedDataTab.dataset,
    }),

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
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },

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
          { name: "dataset_author", iconClass: "far fa-user" },
          { name: "dataset_reference", iconClass: "fas fa-book" },
          { name: "dataset_analysis", iconClass: "far fa-chart-bar" },
          { name: "dataset_geolocation", iconClass: "fas fa-globe-americas" },
        ],
        activeTab: "dataset_author",
        relatedData: this.setDefaultRelatedData(),
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        currentPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        copyFields: [
          "id",
          "dataset_html",
          "date",
          "date_txt",
          "is_private",
          "owner",
          "owner_txt",
          "copyright_agent",
          "licence",
          "remarks",
          "creators",
          "publisher",
          "publication_year",
          "title",
          "title_alternative",
          "title_translated",
          "title_translated_language",
          "abstract",
          "resource_type",
          "resource",
          "methods",
          "version",
          "language",
          "subjects",
          "reference",
          "locality",
          "database",
        ],
        autocomplete: {
          loaders: {
            resource_type: false,
            publishers: false,
            copyright_agent: false,
            owner: false,
            agent: false,
            reference: false,
            locality: false,
            selection_series: false,
            database: false,
          },
          resource_type: [],
          publishers: [],
          copyright_agent: [],
          licence: [],
          owner: [],
          agent: [],
          reference: [],
          locality: [],
          selection_series: [],
          database: [],
        },
        requiredFields: [
          "resource",
          "creators",
          "publication_year",
          "publisher",
          "title",
        ],
        dataset: {},
        block: {
          requiredFields: true,
          info: true,
          referenceAndLocality: false,
          description: false,
          selection_series: false,
        },
        selection_series: null,
        selectionSeriesDialog: false,
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
        dateState: false,
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "dataset");
        fetchDataset(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "dataset", this.handleResponse(response)[0]);
            // this.dataset = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.dataset);

            this.removeUnnecessaryFields(this.dataset, this.copyFields);
            this.$emit("data-loaded", this.dataset);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
          fetchObjectPermissions(this.dataset.id, "dataset").then((res) => {
            this.currentPermissions.groups_change =
              res.data.group
                ?.filter(
                  (perm) => perm.permission__codename === "change_dataset"
                )
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.groups_view =
              res.data.group
                ?.filter((perm) => perm.permission__codename === "view_dataset")
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.users_change =
              res.data.user
                ?.filter(
                  (perm) => perm.permission__codename === "change_dataset"
                )
                .map((perm) => perm.user_id) ?? [];
            this.currentPermissions.users_view =
              res.data.user
                ?.filter((perm) => perm.permission__codename === "view_dataset")
                .map((perm) => perm.user_id) ?? [];
          });
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map((tab) => tab.name)
        );
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);

        if (this.getDatabaseId !== null) {
          this.dataset.database = {
            id: this.getDatabaseId,
          };
        }
        // NOTE: Dataset ID is 3
        this.dataset.resource_type = 3;
      }
    },

    loadAutocompleteFields() {
      fetchDoiResourceType().then(
        (response) =>
          (this.autocomplete.resource_type = this.handleResponse(response))
      );
      fetchDoiPublisher().then((response) => {
        this.autocomplete.publishers = [
          ...this.autocomplete.publishers,
          ...this.handleResponse(response),
        ];
        if (
          !this.$route.meta.isEdit &&
          !this.dataset.publisher &&
          this.autocomplete.publishers.length > 0
        ) {
          this.dataset.publisher = this.autocomplete.publishers[0].value;
        }
      });
      fetchListLanguages().then(
        (response) =>
          (this.autocomplete.language = this.handleResponse(response))
      );
      fetchListLicences().then(
        (response) =>
          (this.autocomplete.licence = this.handleResponse(response))
      );
      fetchDatabase().then(
        (response) =>
          (this.autocomplete.database = this.handleResponse(response))
      );
    },

    setDefaultRelatedData() {
      return {
        dataset_author: { count: 0, results: [] },
        dataset_reference: { count: 0, results: [] },
        dataset_analysis: { count: 0, results: [] },
        dataset_geolocation: { count: 0, results: [] },
        searchParameters: {
          dataset_author: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sort", "id"],
            sortDesc: [false, false],
          },
          dataset_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          dataset_analysis: {
            page: 1,
            paginateBy: 10,
            sortBy: ["analysis"],
            sortDesc: [true],
          },
          dataset_geolocation: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    formatDataForUpload(objectToUpload, saveAsNew = false) {
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
        uploadableObject.initial_permissions = this.initialPermissions;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;
      if (saveAsNew) delete uploadableObject.related_data;

      if (saveAsNew) {
        uploadableObject.initial_permissions = this.currentPermissions;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.copyright_agent)) {
        this.dataset.copyright_agent = {
          id: obj.copyright_agent,
          agent: obj.copyright_agent__agent,
        };
        this.autocomplete.copyright_agent.push(this.dataset.copyright_agent);
      }
      this.dataset.licence = {
        id: obj.licence,
        licence: obj.licence__licence,
        licence_en: obj.licence__licence_en,
      };
      if (this.isNotEmpty(obj.owner)) {
        this.dataset.owner = {
          id: obj.owner,
          agent: obj.owner__agent,
        };
        this.autocomplete.owner.push(this.dataset.owner);
      }
      if (this.isNotEmpty(obj.reference)) {
        this.dataset.reference = {
          id: obj.reference,
          reference: obj.reference__reference,
        };
        this.autocomplete.reference.push(this.dataset.reference);
      }
      if (this.isNotEmpty(obj.locality)) {
        this.dataset.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
        };
        this.autocomplete.locality.push(this.dataset.locality);
      }
      this.dataset.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "dataset_author") {
        query = fetchDatasetAuthors(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_author
        );
      } else if (object === "dataset_reference") {
        query = fetchDatasetReferences(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_reference
        );
      } else if (object === "dataset_analysis") {
        query = fetchDatasetAnalyses(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_analysis
        );
      } else if (object === "dataset_geolocation") {
        query = fetchDatasetGeolocation(
          this.$route.params.id,
          this.relatedData.searchParameters.dataset_geolocation
        );
      }

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },

    /**
     * Updates creators field using persons (Creators) in dataset_author tab
     * Always overwrites creators field, because dataset_author is more reliable than user entered creators field!
     * @param datasetAuthor
     */
    updateCreatorsField(datasetAuthor) {
      if (datasetAuthor.length > 0) {
        let creators = "";
        let creatorsLong = "";
        let moreThanOneAuthor = datasetAuthor.length > 1;

        orderBy(datasetAuthor, ["sort", "id"], ["asc", "asc"]).forEach(
          (agent) => {
            // Only Creators are added (agent_type 1 === Creator)
            if (this.$route.meta.isEdit) {
              if (agent?.agent_type === 1) {
                if (agent?.agent__surename && agent?.agent__forename) {
                  creatorsLong += `${
                    agent.agent__surename
                  }, ${agent.agent__forename.charAt(0)}., `;
                  creators += `${agent.agent__surename}, ${agent.agent__forename}; `;
                } else if (agent?.name) {
                  creatorsLong += `${agent.name}; `;
                  creators += `${agent.name}; `;
                }
              }
            } else {
              if (agent?.agent_type?.id === 1) {
                if (agent?.agent?.surename && agent?.agent?.forename) {
                  creatorsLong += `${
                    agent.agent.surename
                  }, ${agent.agent.forename.charAt(0)}., `;
                  creators += `${agent.agent.surename}, ${agent.agent.forename}; `;
                } else if (agent?.name) {
                  creators += `${agent.name}; `;
                  creatorsLong += `${agent.name}; `;
                }
              }
            }
          }
        );

        if (creators.length > 0) {
          creators = creators.trim().slice(0, -1);
          creatorsLong = creatorsLong.trim().slice(0, -1);

          if (moreThanOneAuthor) this.dataset.creators = creatorsLong;
          else {
            if (this.dataset.creators !== creatorsLong)
              this.dataset.creators = creators;
          }
        }
      }
    },
    async fillUsingSelectionSeries() {
      if (this.selection_series?.id) {
        this.setLoadingState(true);
        this.setLoadingType("add");
        await this.fillLists("analysis");
        // TODO: could also fill other related data
      }

      this.selectionSeriesDialog = false;
      this.setLoadingState(false);
    },

    async fillLists(table) {
      let response = await fetchIdsUsingSelection(
        this.selection_series.id,
        table
      );

      if (response?.data?.results) {
        let listOfObjects = response.data.results.map((item) => {
          return {
            [table]: item[table],
            dataset: this.$route.params.id,
          };
        });

        console.log(listOfObjects);

        let formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            add: listOfObjects,
          })
        );

        let multiAddResponse = await fetchMultiAddDatasetLists(
          `dataset_${table}`,
          formData
        ).then(
          (response) => response,
          (errResponse) => errResponse
        );

        if (multiAddResponse) {
          this.handleResponseMessages(
            multiAddResponse,
            multiAddResponse.status === 200,
            true
          );

          if (multiAddResponse.status === 200)
            this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
        }
      }
    },

    customSelectionSeriesLabel(option) {
      if (option.name) return `${option.id} - ${option.name}`;
      else return `${option.id}`;
    },
  },
};
</script>

<style scoped></style>
