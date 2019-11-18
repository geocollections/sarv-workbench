<template>
  <div class="library">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <fieldset class="border p-2 mb-2" id="block-info">
      <legend
        class="w-auto"
        :class="{ 'text-primary': !block.info }"
        @click="block.info = !block.info"
      >
        {{ $t("library.generalInfo") }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.info">
          <!-- AUTHOR AND YEAR -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`author`">{{ $t("library.author") }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <vue-multiselect
                id="author"
                v-model="library.author"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-sm-2">
              <label :for="`year`">{{ $t("library.year") }}:</label>
            </div>

            <div class="col-sm-4 mb-2">
              <b-form-input
                id="year"
                v-model="library.year"
                type="number"
              ></b-form-input>
            </div>
          </div>

          <!-- AUTHORS -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`author_txt`">{{ $t("library.author_txt") }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input
                id="author_txt"
                v-model="library.author_txt"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- TITLE -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`title`">{{ $t("library.title") }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input
                id="title"
                v-model="library.title"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- TITLE_EN -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`title_en`">{{ $t("library.title_en") }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input
                id="title_en"
                v-model="library.title_en"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- KEYWORDS -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`keywords`">{{ $t("library.keywords") }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <b-form-input
                id="keywords"
                v-model="library.keywords"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- ABSTRACT -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`abstract`">{{ $t("library.abstract") }}:</label>
            </div>

            <div class="col-sm-10 mb-2">
              <editor :data.sync="library.abstract"></editor>
            </div>
          </div>

          <!-- ABSTRACT_EN -->
          <div class="row">
            <div class="col-sm-2">
              <label :for="`abstract_en`"
                >{{ $t("library.abstract_en") }}:</label
              >
            </div>

            <div class="col-sm-10 mb-2">
              <editor :data.sync="library.abstract_en"></editor>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- LIBRARY MEMBERS -->
    <fieldset class="border p-2 mb-2" id="block-members">
      <legend
        class="w-auto"
        :class="{ 'text-primary': !block.members }"
        @click="block.members = !block.members"
      >
        {{ $t("library.libraryAgent") }}
        <i class="fas fa-user-friends"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.members">
          <div class="row">
            <div class="col-10 col-md-11">
              <vue-multiselect
                v-model="relatedData.library_agent"
                id="library_agent"
                label="agent"
                track-by="id"
                :multiple="true"
                :placeholder="$t('add.inputs.autocomplete')"
                :options="autocomplete.library_agent"
                :loading="autocomplete.loaders.library_agent"
                @search-change="autocompleteLibraryAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="false"
                :show-labels="false"
              >
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-2 col-md-1 pl-0">
              <button
                class="btn btn-outline-danger"
                :title="$t('add.inputs.keywordsRemove')"
                :disabled="!isNotEmpty(relatedData.library_agent)"
                @click="relatedData.library_agent = []"
              >
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SHOWING RELATED_DATA -->
    <div class="row">
      <div class="col mt-2">
        <ul class="nav nav-tabs nav-fill mb-3">
          <li
            class="nav-item"
            v-for="tab in filteredRelatedTabs"
            :key="tab.name"
          >
            <a
              href="#"
              @click.prevent="setTab(tab.name)"
              class="nav-link"
              :class="{ active: activeTab === tab.name }"
            >
              <span>{{ $t("library.relatedTables." + tab.name) }}</span>

              <span>
                <sup>
                  <b-badge pill variant="light"
                    >{{ relatedData[tab.name].length }}&nbsp;</b-badge
                  >
                </sup>
              </span>

              <span><i :class="tab.iconClass"></i></span>
            </a>
          </li>
        </ul>

        <div
          class="row"
          v-if="$route.meta.isEdit && activeTab !== 'library_reference_list'"
        >
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

        <library-reference
          :related-data="relatedData"
          :autocomplete="autocomplete"
          :active-tab="activeTab"
          v-on:add-related-data="addRelatedData"
          v-on:set-default="setDefault"
          v-on:edit-row="editRow"
          v-on:remove-row="removeRow"
          v-on:order-by-changed="changeOrdering"
        />

        <library-reference-list-view
          v-if="$route.meta.isEdit"
          :data="relatedData.library_reference_list"
          :active-tab="activeTab"
        />
      </div>
    </div>

    <!-- CHECKBOXES -->
    <div class="row">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="library.is_private">
          {{ $t("library.private") }}
        </b-form-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import {
  fetchLibrary,
  fetchLibraryReference,
  fetchLibraryAgent
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import copyForm from "../../mixins/copyForm";
import LibraryReference from "./relatedTables/LibraryReference";
import LibraryReferenceListView from "./relatedTables/LibraryReferenceListView";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import Editor from "../partial/editor/Editor";
import { mapState } from "vuex";

export default {
  name: "Library",
  components: {
    Editor,
    LibraryReferenceListView,
    LibraryReference,
    Spinner
  },
  mixins: [formManipulation, copyForm, autocompleteMixin, formSectionsMixin],

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
        searchHistory: "librarySearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_LIBRARIES",
        title: "header.libraries",
        object: "library",
        field: "library__title_en",
        block: this.block,
        agent: this.currentUser
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
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
    ...mapState(["currentUser", "databaseId"]),

    filteredRelatedTabs() {
      return this.relatedTabs.filter(tab => {
        if (tab.name === "library_reference_list") {
          if (this.$route.meta.isEdit) return tab;
        } else return tab;
      });
    }
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
            iconClass: "fas fa-book-open"
          },
          {
            name: "library_reference_list",
            iconClass: "fas fa-list-ol"
          }
        ],
        searchHistory: "librarySearchHistory",
        activeTab: "library_reference",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "author",
          "author_txt",
          "year",
          "title",
          "title_en",
          "keywords",
          "abstract",
          "abstract_en",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            reference: false,
            library_agent: false
          },
          agent: [],
          reference: [],
          library_agent: []
        },
        requiredFields: [],
        library: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: { info: true, members: true }
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "library");

        fetchLibrary(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.library = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.library);

            this.removeUnnecessaryFields(this.library, this.copyFields);
            this.$emit("data-loaded", this.library);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });

        this.loadAutocompleteFields();

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          // Skips library_reference_list because it is static view
          if (tab.name !== "library_reference_list")
            this.loadRelatedData(tab.name);
        });

        this.$on("tab-changed", this.setTab);

        this.$emit("related-data-info", this.relatedTabs.map(tab => tab.name));

        this.setTab("library_reference");
      }
    },

    loadAutocompleteFields() {
      fetchLibraryAgent(this.$route.params.id).then(response => {
        let libraryAgent = this.handleResponse(response);
        this.relatedData.library_agent = libraryAgent.map(entity => {
          return {
            agent: entity.agent__agent,
            id: entity.agent
          };
        });
      });
    },

    setDefaultRelatedData() {
      return {
        library_reference: [],
        library_reference_list: [],
        library_agent: [],
        copyFields: {
          library_reference: ["reference", "keywords", "remarks", "sort"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          library_reference: {
            page: 1,
            paginateBy: 25,
            orderBy: "-sort"
          },
          library_reference_list: {
            page: 1,
            paginateBy: 1000,
            orderBy: "-sort,reference__author,-reference__year"
          }
        },
        count: {
          library_reference: 0,
          library_agent: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        library_reference: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.author))
        uploadableObject.author = objectToUpload.author.id;

      // if (this.databaseId) uploadableObject.database = this.databaseId;

      // Adding related data
      if (!this.$route.meta.isEdit) {
        uploadableObject.related_data = {};

        if (this.isNotEmpty(this.relatedData.agent))
          uploadableObject.related_data.library_agent = this.relatedData.library_agent;

        this.relatedTabs.forEach(tab => {
          if (tab.name !== "library_reference_list") {
            if (this.isNotEmpty(this.relatedData[tab.name]))
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
              ];
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

    fillAutocompleteFields(obj) {
      this.library.author = { agent: obj.author__agent, id: obj.author };
    },

    fillRelatedDataAutocompleteFields(obj) {
      obj.reference = {
        reference: obj.reference__reference,
        id: obj.reference
      };
      // obj.library_agent = { agent: obj.agent__agent, id: obj.agent }
      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }

      return newObject;
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
      uploadableObject.library = this.library.id;

      if (this.isNotEmpty(uploadableObject.reference)) {
        uploadableObject.reference = uploadableObject.reference.id
          ? uploadableObject.reference.id
          : uploadableObject.reference;
      }

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        author_txt: null,
        year: null,
        title: null,
        reference: null,
        id: null,
        page: 1,
        paginateBy: 100,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
