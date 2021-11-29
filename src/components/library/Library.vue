<template>
  <div class="library">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('library') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('library') ? 'green--text' : 'red--text'"
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
          <!-- AUTHOR AND YEAR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="library.author_txt"
                :color="bodyActiveColor"
                :label="$t('library.author_txt')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="library.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title"
                :color="bodyActiveColor"
                :label="$t('library.title')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_short"
                :color="bodyActiveColor"
                :label="$t('library.title_short')"
              />
            </v-col>
          </v-row>

          <!-- TITLE_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_en"
                :color="bodyActiveColor"
                :label="$t('library.title_en')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_short_en"
                :color="bodyActiveColor"
                :label="$t('library.title_short_en')"
              />
            </v-col>
          </v-row>

          <!-- KEYWORDS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.keywords"
                :color="bodyActiveColor"
                :label="$t('library.keywords')"
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
          <!-- ABSTRACT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof library.abstract !== 'undefined'"
                v-model="library.abstract"
                :label="$t('library.abstract')"
              />

              <textarea-wrapper
                v-if="false"
                v-model="library.abstract"
                :color="bodyActiveColor"
                :label="$t('library.abstract')"
              />
            </v-col>
          </v-row>

          <!-- ABSTRACT_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof library.abstract_en !== 'undefined'"
                v-model="library.abstract_en"
                :label="$t('library.abstract_en')"
              />

              <textarea-wrapper
                v-if="false"
                v-model="library.abstract_en"
                :color="bodyActiveColor"
                :label="$t('library.abstract_en')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LIBRARY MEMBERS -->
    <v-card
      class="mt-2"
      id="block-members"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.members = !block.members"
        >
          <span>{{ $t("library.libraryAgent") }}</span>
          <v-icon right>fas fa-user-friends</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.members = !block.members"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.members ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.members" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="relatedData.library_agent"
                :color="bodyActiveColor"
                :items="autocomplete.library_agent"
                :loading="autocomplete.loaders.library_agent"
                item-text="agent"
                :label="$t('library.libraryAgent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteLibraryAgentSearch"
                :multiple="true"
                v-on:chip:close="
                  relatedData.library_agent.splice(
                    relatedData.library_agent.indexOf($event),
                    1
                  )
                "
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
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
          v-for="tab in computedRelatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("library.relatedTables." + tab.name) }}</span>
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
          <library-reference-table
            v-show="activeTab === 'library_reference'"
            :response="relatedData.library_reference"
            :search-parameters="relatedData.searchParameters.library_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <library-reference-list-view
            v-if="$route.meta.isEdit"
            :data="relatedData.library_reference_list.results"
            :active-tab="activeTab"
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

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-2">
      <v-col>
        <checkbox-wrapper
          v-model="library.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="library.is_private = !library.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  fetchLibrary,
  fetchLibraryReference,
  fetchLibraryAgent,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import LibraryReferenceListView from "./relatedTables/LibraryReferenceListView";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapActions, mapState } from "vuex";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import LibraryReferenceTable from "./relatedTables/LibraryReferenceTable";
import requestsMixin from "../../mixins/requestsMixin";
import Editor from "../partial/inputs/Editor";
import Pagination from "@/components/partial/Pagination";

export default {
  name: "Library",
  components: {
    Pagination,
    Editor,
    LibraryReferenceTable,
    CheckboxWrapper,
    AutocompleteWrapper,
    TextareaWrapper,
    InputWrapper,
    LibraryReferenceListView,
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
        search: this.librarySearchParameters,
        request: "FETCH_LIBRARIES",
        title: "header.libraries",
        object: "library",
        field: "title_en",
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
    ...mapState("search", ["librarySearchParameters"]),

    filteredRelatedTabs() {
      return this.relatedTabs.filter((tab) => {
        if (tab.name === "library_reference_list") {
          if (this.$route.meta.isEdit) return tab;
        } else return tab;
      });
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },

    computedRelatedTabs() {
      return this.relatedTabs.filter((tab) => {
        if (tab.name === "library_reference_list") {
          if (this.$route.meta.isEdit) return tab;
        } else return tab;
      });
    },
  },

  methods: {
    setTab(type) {
      this.activeTab = type;
    },

    setInitialData() {
      return {
        relatedTabs: [
          {
            name: "library_reference",
            iconClass: "fas fa-book-open",
          },
          {
            name: "library_reference_list",
            iconClass: "fas fa-list-ol",
          },
        ],
        activeTab: "library_reference",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "author_txt",
          "year",
          "title",
          "title_short",
          "title_en",
          "title_short_en",
          "keywords",
          "abstract",
          "abstract_en",
          "is_private",
        ],
        autocomplete: {
          loaders: {
            reference: false,
            library_agent: false,
          },
          reference: [],
          library_agent: [],
        },
        requiredFields: ["author_txt"],
        library: {},
        block: { info: true, description: true, members: true },
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
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchLibrary(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "library", this.handleResponse(response)[0]);

            this.removeUnnecessaryFields(this.library, this.copyFields);
            this.$emit("data-loaded", this.library);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.loadAutocompleteFields();

        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields() {
      fetchLibraryAgent(this.$route.params.id).then((response) => {
        let libraryAgent = this.handleResponse(response);
        this.relatedData.library_agent = libraryAgent.map((entity) => {
          return {
            agent: entity.agent__agent,
            id: entity.agent,
          };
        });
        if (this.isNotEmpty(this.relatedData.library_agent)) {
          this.autocomplete.library_agent = this.relatedData.library_agent;
        }
      });
    },

    setDefaultRelatedData() {
      return {
        library_reference: {
          count: 0,
          results: [],
        },
        library_reference_list: {
          count: 0,
          results: [],
        },
        library_agent: [],
        searchParameters: {
          library_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["sort"],
            sortDesc: [true],
          },
          library_reference_list: {
            page: 1,
            paginateBy: 1000,
            orderBy: "-sort,reference__author,-reference__year",
          },
        },
        count: {
          library_agent: 0,
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

      // Adding related data
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        if (this.isNotEmpty(this.relatedData.library_agent))
          uploadableObject.related_data.agent = this.relatedData.library_agent;

        this.relatedTabs.forEach((tab) => {
          if (tab.name !== "library_reference_list") {
            if (this.isNotEmpty(this.relatedData[tab.name].count > 0))
              uploadableObject.related_data[tab.name] =
                this.relatedData[tab.name].results;
          }
        });
      } else {
        // Library agent is not in tab.
        if (this.isNotEmpty(this.relatedData.library_agent)) {
          uploadableObject.related_data = {};
          uploadableObject.related_data.agent = this.relatedData.library_agent;
        } else uploadableObject.related_data.agent = null;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    loadRelatedData(object) {
      let query;

      if (object === "library_reference") {
        query = fetchLibraryReference(
          this.$route.params.id,
          this.relatedData.searchParameters.library_reference
        );
      }
      if (object === "library_reference_list") {
        query = fetchLibraryReference(
          this.$route.params.id,
          this.relatedData.searchParameters.library_reference_list
        );
      }

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },
  },
};
</script>

<style scoped></style>
