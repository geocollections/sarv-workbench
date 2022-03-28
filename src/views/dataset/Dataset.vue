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
            <v-col cols="12" md="4" class="pa-1" v-if="$route.meta.isEdit">
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

            <v-col cols="12" :md="$route.meta.isEdit ? 4 : 6" class="pa-1">
              <input-wrapper
                v-model="dataset.publication_year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                use-state
              />
            </v-col>

            <v-col cols="12" :md="$route.meta.isEdit ? 4 : 6" class="pa-1">
              <autocomplete-wrapper
                v-model="dataset.publisher"
                :color="bodyActiveColor"
                :items="autocomplete.doi_publisher"
                :loading="autocomplete.loaders.doi_publisher"
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
                :items="autocomplete.list_language"
                :loading="autocomplete.loaders.list_language"
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
                :items="autocomplete.list_language"
                :loading="autocomplete.loaders.list_language"
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
                :items="autocomplete.list_licence"
                :loading="autocomplete.loaders.list_licence"
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
            :items-per-page="relatedData.searchParameters[activeTab].itemsPerPage"
            :options="paginateByOptionsTranslated"
            :page="reattachment_llatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2" v-if="$route.meta.isEdit">
      <v-col>
        <checkbox-wrapper
          v-model="dataset.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="dataset.is_private = !dataset.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import DateWrapper from "@/components/partial/inputs/DateWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import DatasetAuthorTable from "@/components/dataset/relatedTables/DatasetAuthorTable";
import DatasetReferenceTable from "@/components/dataset/relatedTables/DatasetReferenceTable";
import DatasetAnalysisTable from "@/components/dataset/relatedTables/DatasetAnalysisTable";
import Pagination from "@/components/partial/Pagination";
import { orderBy } from "lodash";
import DatasetGeolocationTable from "@/components/dataset/relatedTables/DatasetGeolocationTable";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

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
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  watch: {
    "relatedData.dataset_author.results": {
      handler(newVal) {
        if (newVal && newVal.length > 0) this.updateCreatorsField(newVal);
      },
      deep: true,
    },
  },

  computed: {
    ...mapState("search", {
      activeRelatedDataTab: (state) => state.activeRelatedDataTab.dataset,
    }),
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
          { name: "dataset_author", iconClass: "far fa-user" },
          { name: "dataset_reference", iconClass: "fas fa-book" },
          { name: "dataset_analysis", iconClass: "far fa-chart-bar" },
          { name: "dataset_geolocation", iconClass: "fas fa-globe-americas" },
        ],
        activeTab: "dataset_author",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: [
          "list_language",
          "list_licence",
          "doi_publisher",
        ],
        autocomplete: {
          loaders: {
            doi_publisher: false,
            copyright_agent: false,
            owner: false,
            agent: false,
            reference: false,
            locality: false,
          },
          doi_publisher: [],
          copyright_agent: [],
          list_language: [],
          list_licence: [],
          owner: [],
          agent: [],
          reference: [],
          locality: [],
        },
        requiredFields: this.$route.meta.isEdit
          ? ["resource", "publication_year", "publisher", "title", "creators"]
          : ["resource", "publication_year", "publisher", "title"],
        dataset: {
          id: null,
          dataset_html: null,
          date: null,
          date_txt: null,
          is_private: true,
          owner: null,
          owner_txt: null,
          copyright_agent: null,
          licence: null,
          remarks: null,
          creators: null,
          publisher: null,
          publication_year: null,
          title: null,
          title_alternative: null,
          title_translated: null,
          title_translated_language: null,
          abstract: null,
          resource_type: 3,
          resource: null,
          methods: null,
          version: null,
          language: null,
          subjects: null,
          reference: null,
          locality: null,
        },
        block: {
          requiredFields: true,
          info: true,
          referenceAndLocality: false,
          description: false,
        },
        dateState: false,
      };
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
            itemsPerPage: 10,
            sortBy: ["sort", "id"],
            sortDesc: [false, false],
          },
          dataset_reference: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          dataset_analysis: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["analysis"],
            sortDesc: [true],
          },
          dataset_geolocation: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
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
  },
};
</script>
