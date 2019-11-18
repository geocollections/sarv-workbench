<template>
  <div class="collection">
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
      :style="!validate('collection') ? 'border-color: #dc3545!important;' : ''"
      id="block-info"
    >
      <legend
        class="w-auto my-0"
        :class="{
          'text-primary': !block.info,
          'text-danger': !validate('collection')
        }"
        @click="block.info = !block.info"
      >
        {{ $t("collection.generalInfo") }}
        <i
          v-if="validate('collection')"
          class="fas fa-project-diagram text-success"
        ></i>
        <i
          v-if="!validate('collection')"
          class="fas fa-project-diagram text-danger"
        ></i>
      </legend>

      <transition name="fade">
        <div v-if="block.info">
          <!-- NUMBER, COLLECTION_ID, TYPE  -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`number`"
                >{{ $t("collection.number_detail") }}:</label
              >
              <b-form-input
                id="number"
                v-model="collection.number"
                :state="isNotEmpty(collection.number)"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`collection_id`"
                >{{ $t("collection.collection_id") }}:</label
              >
              <b-form-input
                id="collection_id"
                v-model="collection.collection_id"
                :state="isNotEmpty(collection.collection_id)"
                type="number"
              ></b-form-input>
            </div>

            <div class="col-md-4">
              <label :for="`type`">{{ $t("collection.type") }}:</label>
              <vue-multiselect
                v-model="collection.type"
                id="type"
                :options="autocomplete.type"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>
          </div>

          <!-- NAME and NAME_EN -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`name`">{{ $t("collection.name") }}:</label>
              <b-form-input
                id="name"
                v-model="collection.name"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`name_en`">{{ $t("collection.name_en") }}:</label>
              <b-form-input
                id="name_en"
                v-model="collection.name_en"
                type="text"
              ></b-form-input>
            </div>
          </div>

          <!-- NAME_LONG and NAME_LONG_EN -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`name_long`"
                >{{ $t("collection.name_long") }}:</label
              >
              <b-form-input
                id="name_long"
                v-model="collection.name_long"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`name_long_en`"
                >{{ $t("collection.name_long_en") }}:</label
              >
              <b-form-input
                id="name_long_en"
                v-model="collection.name_long_en"
                type="text"
              ></b-form-input>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- RELATED INFO -->
    <fieldset class="border-top px-2 mb-2" id="block-relatedInfo">
      <legend
        class="w-auto my-0"
        :class="{ 'text-primary': !block.relatedInfo }"
        @click="block.relatedInfo = !block.relatedInfo"
      >
        {{ $t("collection.relatedInfo") }}
        <i class="fas fa-sitemap"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.relatedInfo">
          <!-- CLASSIFICATION and AGENT -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`classification`"
                >{{ $t("collection.classification") }}:</label
              >
              <vue-multiselect
                v-model="collection.classification"
                id="classification"
                track-by="id"
                :label="classLabel"
                :options="autocomplete.classification"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteClassificationSearch"
                :loading="autocomplete.loaders.classification"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[classLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-6">
              <label :for="`agent`">{{ $t("collection.agent") }}:</label>
              <vue-multiselect
                v-model="collection.agent"
                id="agent"
                track-by="id"
                label="agent"
                :options="autocomplete.agent"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteAgentSearch"
                :loading="autocomplete.loaders.agent"
                :placeholder="$t('add.inputs.autocomplete')"
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
          </div>

          <!-- LOCALITY, STRATIGRAPHY and REFERENCE -->
          <div class="row">
            <div class="col-md-4">
              <label :for="`locality`">{{ $t("collection.locality") }}:</label>
              <vue-multiselect
                v-model="collection.locality"
                id="locality"
                track-by="id"
                :label="localityLabel"
                :options="autocomplete.locality"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteLocalitySearch"
                :loading="autocomplete.loaders.locality"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[localityLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`stratigraphy`"
                >{{ $t("collection.stratigraphy") }}:</label
              >
              <vue-multiselect
                v-model="collection.stratigraphy"
                id="stratigraphy"
                track-by="id"
                :label="stratigraphyLabel"
                :options="autocomplete.stratigraphy"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteStratigraphySearch"
                :loading="autocomplete.loaders.classification"
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

            <div class="col-md-4">
              <label :for="`reference`"
                >{{ $t("collection.reference") }}:</label
              >
              <vue-multiselect
                v-model="collection.reference"
                id="reference"
                track-by="id"
                label="reference"
                :options="autocomplete.reference"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                @search-change="autocompleteReferenceSearch"
                :loading="autocomplete.loaders.reference"
                :placeholder="$t('add.inputs.autocomplete')"
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
        {{ $t("collection.description") }}
        <i class="fas fa-pen-fancy"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.description">
          <!-- REMARKS  -->
          <div class="row">
            <div class="col-sm-12">
              <label :for="`remarks`">{{ $t("collection.remarks") }}:</label>
              <editor :data.sync="collection.remarks" />
            </div>
          </div>

          <!-- NUMBER_OBJECTS and NUMBER_TYPES -->
          <div class="row">
            <div class="col-md-6">
              <label :for="`number_objects`"
                >{{ $t("collection.number_objects") }}:</label
              >
              <b-form-input
                id="number_objects"
                v-model="collection.number_objects"
                type="text"
              ></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`number_types`"
                >{{ $t("collection.number_types") }}:</label
              >
              <b-form-input
                id="number_types"
                v-model="collection.number_types"
                type="text"
              ></b-form-input>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- REMARKS -->
    <fieldset
      class="border-top px-2 mb-2"
      id="block-specimen"
      v-if="$route.meta.isEdit && specimens.count > 0"
    >
      <legend
        class="w-auto my-0"
        :class="{ 'text-primary': !block.specimen }"
        @click="block.specimen = !block.specimen"
      >
        {{ $t("collection.specimen") }}
        <i class="fas fa-fish"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.specimen">
          <!-- PAGINATION -->
          <div
            v-if="specimens.count > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between mt-3 d-print-none"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="specimenSearchParameters.paginateBy"
                color="blue"
                dense
                :items="paginateByOptionsTranslated"
                item-color="blue"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="specimenSearchParameters.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    specimens.count / specimenSearchParameters.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-card class="table-card my-1">
            <v-card-title class="d-print-none">
              <v-icon class="mr-2" color="#191414" large>fas fa-list</v-icon>
              <span id="table-title" class="text-uppercase">
                {{ $t("collection.specimen") }}
                <sup>
                  <v-chip
                    color="deep-orange"
                    small
                    text-color="#ffffff"
                    class="font-weight-bold"
                    >{{ specimens.count }}</v-chip
                  >
                </sup>
              </span>
              <div class="flex-grow-1"></div>
              <v-text-field
                v-model="filterSpecimens"
                append-outer-icon="fas fa-search"
                label="Filter records"
                clear-icon="fas fa-times"
                clearable
                color="deep-orange"
              ></v-text-field>
            </v-card-title>

            <specimen-table
              :response="specimens"
              :search-parameters="specimenSearchParameters"
              :filter="filterSpecimens"
            />
          </v-card>
        </div>
      </transition>
    </fieldset>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchCollection,
  fetchListCollectionType,
  fetchSpecimens
} from "../../assets/js/api/apiCalls";
import { cloneDeep } from "lodash";
import Spinner from "vue-simple-spinner";
import Editor from "../partial/editor/Editor";
import SpecimenTable from "../specimen/SpecimenTable";
import { mapState } from "vuex";

export default {
  name: "Collection",

  components: {
    Spinner,
    Editor,
    SpecimenTable
  },

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState(["databaseId"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
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
        searchHistory: "collectionSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_COLLECTIONS",
        title: "header.collections",
        object: "collection",
        field: "number",
        databaseId: this.databaseId,
        block: this.block
      });
    } else {
      // Adding collection default values from local storage
      const collectionHistory = this.$localStorage.get(
        "collection",
        "fallbackValue"
      );
      if (
        collectionHistory !== "fallbackValue" &&
        Object.keys(collectionHistory).length !== 0 &&
        collectionHistory.constructor === Object
      ) {
        this.collection = collectionHistory;
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

    specimenSearchParameters: {
      handler() {
        this.getSpecimensBelongingToCollection();
      },
      deep: true
    }
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "collectionSearchHistory",
        copyFields: [
          "id",
          "number",
          "collection_id",
          "type",
          "name",
          "name_long",
          "name_en",
          "name_long_en",
          "classification",
          "agent",
          "locality",
          "stratigraphy",
          "reference",
          "remarks",
          "number_objects",
          "number_types"
        ],
        autocomplete: {
          loaders: {
            type: false,
            classification: false,
            agent: false,
            locality: false,
            stratigraphy: false,
            reference: false
          },
          type: [],
          classification: [],
          agent: [],
          locality: [],
          stratigraphy: [],
          reference: []
        },
        requiredFields: ["collection_id", "number"],
        collection: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true,
          relatedInfo: true,
          description: true,
          specimen: true
        },
        filterSpecimens: "",
        databaseAcronym: "",
        specimens: {
          count: 0,
          results: []
        },
        specimenSearchParameters: {
          idSpecimen: null,
          collNumber: null,
          fossil: null,
          mineralRock: null,
          locality: null,
          stratigraphy: null,
          agent_collected: null,
          page: 1,
          paginateBy: 25,
          orderBy: "-id"
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
        this.$emit("set-object", "collection");
        fetchCollection(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.collection = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.collection);

            // Needs to be before fields are removed
            this.specimenSearchParameters.collNumber = this.collection.number;

            this.removeUnnecessaryFields(this.collection, this.copyFields);
            this.$emit("data-loaded", this.collection);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
    },

    getSpecimensBelongingToCollection() {
      fetchSpecimens(this.specimenSearchParameters).then(response => {
        if (response.status === 200) {
          this.specimens.count = response.body.count;
          this.specimens.results = response.body.results;
        }
      });
    },

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
        fetchListCollectionType().then(
          response => (this.autocomplete.type = this.handleResponse(response))
        );
      }
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      if (this.isNotEmpty(objectToUpload.classification))
        uploadableObject.classification = objectToUpload.classification.id;
      if (this.isNotEmpty(objectToUpload.agent))
        uploadableObject.agent = objectToUpload.agent.id;
      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.stratigraphy))
        uploadableObject.stratigraphy = objectToUpload.stratigraphy.id;
      if (this.isNotEmpty(objectToUpload.reference))
        uploadableObject.reference = objectToUpload.reference.id;

      if (this.databaseId) uploadableObject.database = this.databaseId;

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
      if (this.isNotEmpty(obj.classification)) {
        this.collection.classification = {
          id: obj.classification,
          class_field: obj.classification__class_field,
          class_en: obj.classification__class_en
        };
      }
      if (this.isNotEmpty(obj.agent)) {
        this.collection.agent = { id: obj.agent, agent: obj.agent__agent };
      }
      if (this.isNotEmpty(obj.locality)) {
        this.collection.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
      }
      if (this.isNotEmpty(obj.stratigraphy)) {
        this.collection.stratigraphy = {
          id: obj.stratigraphy,
          stratigraphy: obj.stratigraphy__stratigraphy,
          stratigraphy_en: obj.stratigraphy__stratigraphy_en
        };
      }
      if (this.isNotEmpty(obj.reference)) {
        this.collection.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
      }
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        number: null,
        name: null,
        agent: null,
        locality: null,
        reference: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["collection_id"],
        sortDesc: [true]
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
</style>
