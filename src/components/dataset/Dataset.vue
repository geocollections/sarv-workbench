<template>
  <div class="dataset">
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
          <span :class="validate('dataset') ? 'green--text' : 'red--text'">{{
            $t("preparation.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('dataset') ? 'green--text' : 'red--text'"
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`name`">{{ $t("dataset.name") }}:</label>
              <b-form-input
                size="sm"
                id="name"
                v-model="dataset.name"
                :state="isNotEmpty(dataset.name)"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`name_en`">{{ $t("dataset.name_en") }}:</label>
              <b-form-input
                size="sm"
                id="name_en"
                v-model="dataset.name_en"
                :state="isNotEmpty(dataset.name_en)"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`description`"
                >{{ $t("dataset.description") }}:</label
              >
              <editor :data.sync="dataset.description" />
            </v-col>
          </v-row>

          <!-- DESCRIPTION_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`description_en`"
                >{{ $t("dataset.description_en") }}:</label
              >
              <editor :data.sync="dataset.description_en" />
            </v-col>
          </v-row>

          <!-- DATE, DATE_TXT, COPYRIGHT_AGENT and LICENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`date`">{{ $t("dataset.date") }}:</label>
              <datepicker
                id="date"
                v-model="dataset.date"
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                :not-after="new Date()"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`date_txt`">{{ $t("dataset.date_txt") }}:</label>
              <b-form-input
                size="sm"
                id="date_txt"
                v-model="dataset.date_txt"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`copyright_agent`"
                >{{ $t("dataset.copyright_agent") }}:</label
              >
              <vue-multiselect
                id="copyright_agent"
                v-model="dataset.copyright_agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.copyright_agent"
                :options="autocomplete.copyright_agent"
                @search-change="autocompleteCopyrightAgentSearch"
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
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`licence`">{{ $t("dataset.licence") }}:</label>
              <vue-multiselect
                v-model="dataset.licence"
                id="licence"
                :options="autocomplete.licence"
                track-by="id"
                :label="licenceLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[licenceLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- DATASET_HTML -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`dataset_html`"
                >{{ $t("dataset.dataset_html") }}:</label
              >
              <editor :data.sync="dataset.dataset_html" />
            </v-col>
          </v-row>

          <!-- OWNER and OWNER_TXT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`owner`">{{ $t("dataset.owner") }}:</label>
              <vue-multiselect
                id="owner"
                v-model="dataset.owner"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.owner"
                :options="autocomplete.owner"
                @search-change="autocompleteOwner2Search"
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
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`owner_txt`">{{ $t("dataset.owner_txt") }}:</label>
              <b-form-input
                size="sm"
                id="owner_txt"
                v-model="dataset.owner_txt"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("dataset.remarks") }}:</label>
              <editor :data.sync="dataset.remarks" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-checkbox
          v-model="dataset.is_private"
          id="is_private"
          :label="$t('dataset.is_private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import Editor from "../partial/editor/Editor";
import Spinner from "vue-simple-spinner";
import { mapState } from "vuex";
import {
  fetchDataset,
  fetchDatasetAuthors,
  fetchDatasetReferences,
  fetchListLicences
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import Datepicker from "vue2-datepicker";

export default {
  name: "Dataset",

  components: {
    Editor,
    Spinner,
    Datepicker
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
        searchHistory: "datasetSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DATASETS",
        title: "header.datasets",
        object: "dataset",
        field: "name",
        databaseId: this.databaseId,
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
          { name: "dataset_author", iconClass: "far fa-user" },
          { name: "dataset_reference", iconClass: "far fa-chart-bar" }
        ],
        searchHistory: "datasetSearchHistory",
        activeTab: "dataset_author",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "name",
          "name_en",
          "description",
          "description_en",
          "dataset_html",
          "date",
          "date_txt",
          "is_private",
          "owner",
          "owner_txt",
          "copyright_agent",
          "licence",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            copyright_agent: false,
            owner: false,
            agent: false,
            reference: false
          },
          copyright_agent: [],
          licence: [],
          owner: [],
          agent: [],
          reference: []
        },
        requiredFields: ["name", "name_en"],
        dataset: {},
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
      this.loadAutocompleteFields(true);

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "dataset");
        fetchDataset(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.dataset = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.dataset);

            this.removeUnnecessaryFields(this.dataset, this.copyFields);
            this.$emit("data-loaded", this.dataset);
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

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
        fetchListLicences().then(
          response =>
            (this.autocomplete.licence = this.handleResponse(response))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        dataset_author: [],
        dataset_reference: [],
        new: {
          dataset_author: [],
          dataset_reference: []
        },
        copyFields: {
          dataset_author: ["agent", "remarks"],
          dataset_reference: ["reference", "remarks"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          dataset_author: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          dataset_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          dataset_author: 0,
          dataset_reference: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        dataset_author: {},
        dataset_reference: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.date))
        uploadableObject.date = this.formatDateForUpload(objectToUpload.date);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.copyright_agent))
        uploadableObject.copyright_agent = objectToUpload.copyright_agent.id;
      if (this.isNotEmpty(objectToUpload.licence))
        uploadableObject.licence = objectToUpload.licence.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;

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
      this.dataset.copyright_agent = {
        id: obj.copyright_agent,
        agent: obj.copyright_agent__agent
      };
      this.dataset.licence = {
        id: obj.fossil,
        licence: obj.licence__licence,
        licence_en: obj.licence__licence_en
      };
      this.dataset.owner = {
        id: obj.owner,
        agent: obj.owner__agent
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.agent))
        obj.agent = { id: obj.agent, agent: obj.agent__agent };
      if (this.isNotEmpty(obj.reference))
        obj.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }

      return newObject;
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
      uploadableObject.dataset = this.dataset.id;

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

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        name: null,
        owner: null,
        date: null,
        remarks: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
