<template>
  <div class="stratigraphy">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    />

    <!--    &lt;!&ndash; GENERAL INFO &ndash;&gt;-->
    <!--    <v-card-->
    <!--      class="mt-2"-->
    <!--      id="block-info"-->
    <!--      :color="bodyColor.split('n-')[0] + 'n-5'"-->
    <!--      elevation="4"-->
    <!--    >-->
    <!--      <v-card-title class="pt-2 pb-1">-->
    <!--        <div class="card-title&#45;&#45;clickable" @click="block.info = !block.info">-->
    <!--          <span :class="validate('dataset') ? 'green&#45;&#45;text' : 'red&#45;&#45;text'">{{-->
    <!--            $t("preparation.generalInfo")-->
    <!--          }}</span>-->
    <!--          <v-icon-->
    <!--            right-->
    <!--            :class="validate('dataset') ? 'green&#45;&#45;text' : 'red&#45;&#45;text'"-->
    <!--          >fas fa-project-diagram</v-icon-->
    <!--          >-->
    <!--        </div>-->
    <!--        <v-spacer></v-spacer>-->
    <!--        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">-->
    <!--          <v-icon>{{-->
    <!--            block.info ? "fas fa-angle-up" : "fas fa-angle-down"-->
    <!--            }}</v-icon>-->
    <!--        </v-btn>-->
    <!--      </v-card-title>-->

    <!--      <transition>-->
    <!--        <div v-show="block.info" class="pa-1">-->
    <!--          &lt;!&ndash; NAME and NAME_EN &ndash;&gt;-->
    <!--          <v-row no-gutters>-->
    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <input-wrapper-->
    <!--                v-model="dataset.name"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.name')"-->
    <!--                use-state-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <input-wrapper-->
    <!--                v-model="dataset.name_en"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.name_en')"-->
    <!--                use-state-->
    <!--              />-->
    <!--            </v-col>-->
    <!--          </v-row>-->

    <!--          &lt;!&ndash; DESCRIPTION and DESCRIPTION_EN &ndash;&gt;-->
    <!--          <v-row no-gutters>-->
    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <textarea-wrapper-->
    <!--                v-model="dataset.description"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.description')"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <textarea-wrapper-->
    <!--                v-model="dataset.description_en"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.description_en')"-->
    <!--              />-->
    <!--            </v-col>-->
    <!--          </v-row>-->

    <!--          &lt;!&ndash; DATE, DATE_TXT, COPYRIGHT_AGENT and LICENCE &ndash;&gt;-->
    <!--          <v-row no-gutters>-->
    <!--            <v-col cols="12" md="3" class="pa-1">-->
    <!--              <date-wrapper-->
    <!--                v-model="dataset.date"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.date')"-->
    <!--                v-on:date:clear="dataset.date = null"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="3" class="pa-1">-->
    <!--              <input-wrapper-->
    <!--                v-model="dataset.date_txt"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.date_txt')"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="3" class="pa-1">-->
    <!--              <autocomplete-wrapper-->
    <!--                v-model="dataset.copyright_agent"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :items="autocomplete.copyright_agent"-->
    <!--                :loading="autocomplete.loaders.copyright_agent"-->
    <!--                item-text="agent"-->
    <!--                :label="$t('common.copyright_agent')"-->
    <!--                is-link-->
    <!--                route-object="agent"-->
    <!--                is-searchable-->
    <!--                v-on:search:items="autocompleteCopyrightAgentSearch"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="3" class="pa-1">-->
    <!--              <autocomplete-wrapper-->
    <!--                v-model="dataset.licence"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :items="autocomplete.licence"-->
    <!--                :loading="autocomplete.loaders.licence"-->
    <!--                :item-text="licenceLabel"-->
    <!--                :label="$t('common.licence')"-->
    <!--              />-->
    <!--            </v-col>-->
    <!--          </v-row>-->

    <!--          &lt;!&ndash; DATASET_HTML and REMARKS &ndash;&gt;-->
    <!--          <v-row no-gutters>-->
    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <textarea-wrapper-->
    <!--                v-model="dataset.dataset_html"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('dataset.dataset_html')"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <textarea-wrapper-->
    <!--                v-model="dataset.remarks"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.remarks')"-->
    <!--              />-->
    <!--            </v-col>-->
    <!--          </v-row>-->

    <!--          &lt;!&ndash; OWNER and OWNER_TXT &ndash;&gt;-->
    <!--          <v-row no-gutters>-->
    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <autocomplete-wrapper-->
    <!--                v-model="dataset.owner"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :items="autocomplete.owner"-->
    <!--                :loading="autocomplete.loaders.owner"-->
    <!--                item-text="agent"-->
    <!--                :label="$t('common.owner')"-->
    <!--                is-link-->
    <!--                route-object="agent"-->
    <!--                is-searchable-->
    <!--                v-on:search:items="autocompleteOwner2Search"-->
    <!--              />-->
    <!--            </v-col>-->

    <!--            <v-col cols="12" md="6" class="pa-1">-->
    <!--              <input-wrapper-->
    <!--                v-model="dataset.owner_txt"-->
    <!--                :color="bodyActiveColor"-->
    <!--                :label="$t('common.owner_txt')"-->
    <!--              />-->
    <!--            </v-col>-->
    <!--          </v-row>-->
    <!--        </div>-->
    <!--      </transition>-->
    <!--    </v-card>-->

    <!--    &lt;!&ndash; RELATED DATA TABS &ndash;&gt;-->
    <!--    <v-card-->
    <!--      class="related-tabs mt-2"-->
    <!--      :color="bodyColor.split('n-')[0] + 'n-5'"-->
    <!--      elevation="4"-->
    <!--    >-->
    <!--      <v-tabs-->
    <!--        :background-color="bodyColor.split('n-')[0] + 'n-3'"-->
    <!--        show-arrows-->
    <!--        grow-->
    <!--        prev-icon="fas fa-angle-left"-->
    <!--        next-icon="fas fa-angle-right"-->
    <!--        :active-class="bodyColor.split('n-')[0] + 'n-5 black&#45;&#45;text'"-->
    <!--        hide-slider-->
    <!--      >-->
    <!--        <v-tab-->
    <!--          v-for="tab in relatedTabs"-->
    <!--          :key="tab.name"-->
    <!--          @click.prevent="setTab(tab.name)"-->
    <!--        >-->
    <!--          <span>{{ $t("dataset.relatedTables." + tab.name) }}</span>-->
    <!--          <span class="ml-1">-->
    <!--            <v-icon small>{{ tab.iconClass }}</v-icon>-->
    <!--          </span>-->
    <!--          <span-->
    <!--            v-if="relatedData[tab.name].length > 0"-->
    <!--            class="font-weight-bold ml-2"-->
    <!--          >-->
    <!--            {{ relatedData[tab.name].length }}-->
    <!--          </span>-->
    <!--        </v-tab>-->
    <!--      </v-tabs>-->

    <!--      <v-tabs-items>-->
    <!--        <v-card-->
    <!--          class="pt-3 px-1"-->
    <!--          flat-->
    <!--          :color="bodyColor.split('n-')[0] + 'n-5'"-->
    <!--        >-->
    <!--          <dataset-author-->
    <!--            :related-data="relatedData"-->
    <!--            :autocomplete="autocomplete"-->
    <!--            :active-tab="activeTab"-->
    <!--            v-on:add-related-data="addRelatedData"-->
    <!--            v-on:set-default="setDefault"-->
    <!--            v-on:edit-row="editRow"-->
    <!--            v-on:remove-row="removeRow"-->
    <!--          />-->

    <!--          <dataset-reference-->
    <!--            :related-data="relatedData"-->
    <!--            :autocomplete="autocomplete"-->
    <!--            :active-tab="activeTab"-->
    <!--            v-on:add-related-data="addRelatedData"-->
    <!--            v-on:set-default="setDefault"-->
    <!--            v-on:edit-row="editRow"-->
    <!--            v-on:remove-row="removeRow"-->
    <!--          />-->

    <!--          &lt;!&ndash; PAGINATION &ndash;&gt;-->
    <!--          <div-->
    <!--            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"-->
    <!--            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"-->
    <!--          >-->
    <!--            <div class="mr-3 mb-3">-->
    <!--              <v-select-->
    <!--                v-model="relatedData.searchParameters[activeTab].paginateBy"-->
    <!--                :color="bodyActiveColor"-->
    <!--                dense-->
    <!--                :items="paginateByOptionsTranslated"-->
    <!--                :item-color="bodyActiveColor"-->
    <!--                label="Paginate by"-->
    <!--                hide-details-->
    <!--              />-->
    <!--            </div>-->

    <!--            <div>-->
    <!--              <v-pagination-->
    <!--                v-model="relatedData.searchParameters[activeTab].page"-->
    <!--                :color="bodyActiveColor"-->
    <!--                circle-->
    <!--                prev-icon="fas fa-angle-left"-->
    <!--                next-icon="fas fa-angle-right"-->
    <!--                :length="-->
    <!--                  Math.ceil(-->
    <!--                    relatedData.count[activeTab] /-->
    <!--                      relatedData.searchParameters[activeTab].paginateBy-->
    <!--                  )-->
    <!--                "-->
    <!--                :total-visible="5"-->
    <!--              />-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </v-card>-->
    <!--      </v-tabs-items>-->
    <!--    </v-card>-->

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="stratigraphy.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="stratigraphy.is_private = !stratigraphy.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
// import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
// import DateWrapper from "../partial/inputs/DateWrapper";
// import TextareaWrapper from "../partial/inputs/TextareaWrapper";
// import InputWrapper from "../partial/inputs/InputWrapper";
// import Spinner from "vue-simple-spinner";
// import DatasetAuthor from "../dataset/relatedTables/DatasetAuthor";
// import DatasetReference from "../dataset/relatedTables/DatasetReference";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import { mapState } from "vuex";
import {
  fetchListStratigraphyRank,
  fetchListStratigraphyScope,
  fetchListStratigraphyStatus,
  fetchListStratigraphyType,
  fetchStratigraphy
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Stratigraphy",

  // components: {
  //   CheckboxWrapper,
  //   AutocompleteWrapper,
  //   DateWrapper,
  //   TextareaWrapper,
  //   InputWrapper,
  //   Spinner,
  //   DatasetAuthor,
  //   DatasetReference
  // },
  components: {
    CheckboxWrapper
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
        searchHistory: "stratigraphySearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_STRATIGRAPHY",
        title: "header.stratigraphies",
        object: "stratigraphy",
        field: "name",
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
          { name: "stratigraphy_reference", iconClass: "far fa-book" },
          { name: "stratigraphy_stratotype", iconClass: "fas fa-cut" },
          { name: "stratigraphy_synonym", iconClass: "fas fa-list-ol" }
        ],
        searchHistory: "stratigraphySearchHistory",
        activeTab: "stratigraphy__reference",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "stratigraphy",
          "stratigraphy_en",
          "stratigraphy_original",
          "author_free",
          "year",
          "etymon",
          "etymon_en",
          "original_locality",
          "original_rank",
          "index_main",
          "index_main_html",
          "index_additional",
          "index_additional_html",
          "color_code_cgmw",
          "color_code_additional",
          "hierarchy_string",
          "parent",
          "type",
          "rank",
          "scope",
          "status",
          "region",
          "region_en",
          "lithology",
          "lithology_en",
          "max_thickness",
          "description",
          "description_en",
          "definition",
          "definition_en",
          "age_base",
          "age_top",
          "age_precision",
          "age_reference",
          "age_chronostratigraphy",
          "sort_within_parent",
          "approved_ics",
          "approved_esk",
          "is_private",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            parent_stratigraphy: false,
            list_stratigraphy_type: false,
            list_stratigraphy_rank: false,
            list_stratigraphy_scope: false,
            list_stratigraphy_status: false,
            age_reference: false,
            age_chronostratigraphy: false
          },
          parent_stratigraphy: [],
          list_stratigraphy_type: [],
          list_stratigraphy_rank: [],
          list_stratigraphy_scope: [],
          list_stratigraphy_status: [],
          age_reference: [],
          age_chronostratigraphy: []
        },
        requiredFields: ["stratigraphy", "stratigraphy_en"],
        stratigraphy: {},
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
        this.$emit("set-object", "stratigraphy");
        fetchStratigraphy(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.stratigraphy = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.stratigraphy);

            this.removeUnnecessaryFields(this.stratigraphy, this.copyFields);
            this.$emit("data-loaded", this.stratigraphy);
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
        fetchListStratigraphyType().then(
          response =>
            (this.autocomplete.list_stratigraphy_type = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyRank().then(
          response =>
            (this.autocomplete.list_stratigraphy_rank = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyScope().then(
          response =>
            (this.autocomplete.list_stratigraphy_scope = this.handleResponse(
              response
            ))
        );
        fetchListStratigraphyStatus().then(
          response =>
            (this.autocomplete.list_stratigraphy_status = this.handleResponse(
              response
            ))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        stratigraphy_reference: [],
        stratigraphy_stratotype: [],
        stratigraphy_synonym: [],
        new: {
          stratigraphy_reference: [],
          stratigraphy_stratotype: [],
          stratigraphy_synonym: []
        },
        copyFields: {
          stratigraphy_reference: ["reference"],
          stratigraphy_stratotype: ["locality"],
          stratigraphy_synonym: ["synonym"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          stratigraphy_reference: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          stratigraphy_stratotype: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          stratigraphy_synonym: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          }
        },
        count: {
          stratigraphy_reference: 0,
          stratigraphy_stratotype: 0,
          stratigraphy_synonym: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        stratigraphy_reference: {},
        stratigraphy_stratotype: {},
        stratigraphy_synonym: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      // Autocomplete fields
      if (this.isNotEmpty(objectToUpload.parent))
        uploadableObject.parent = objectToUpload.parent.id;
      else uploadableObject.parent = null;
      if (this.isNotEmpty(objectToUpload.type))
        uploadableObject.type = objectToUpload.type.id;
      else uploadableObject.type = null;
      if (this.isNotEmpty(objectToUpload.rank))
        uploadableObject.rank = objectToUpload.rank.id;
      else uploadableObject.rank = null;
      if (this.isNotEmpty(objectToUpload.scope))
        uploadableObject.scope = objectToUpload.scope.id;
      else uploadableObject.scope = null;
      if (this.isNotEmpty(objectToUpload.status))
        uploadableObject.status = objectToUpload.status.id;
      else uploadableObject.status = null;
      if (this.isNotEmpty(objectToUpload.age_reference))
        uploadableObject.age_reference = objectToUpload.age_reference.id;
      else uploadableObject.age_reference = null;
      if (this.isNotEmpty(objectToUpload.age_chronostratigraphy))
        uploadableObject.age_chronostratigraphy =
          objectToUpload.age_chronostratigraphy.id;
      else uploadableObject.age_chronostratigraphy = null;

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
      if (this.isNotEmpty(obj.parent)) {
        this.stratigraphy.parent = {
          id: obj.parent,
          stratigraphy: obj.parent__stratigraphy,
          stratigraphy_en: obj.parent__stratigraphy_en
        };
        this.autocomplete.parent_stratigraphy.push(this.stratigraphy.parent);
      }
      if (this.isNotEmpty(obj.age_reference)) {
        this.stratigraphy.age_reference = {
          id: obj.age_reference,
          reference: obj.age_reference__reference
        };
        this.autocomplete.age_reference.push(this.stratigraphy.age_reference);
      }
      if (this.isNotEmpty(obj.age_chronostratigraphy)) {
        this.stratigraphy.age_chronostratigraphy = {
          id: obj.age_chronostratigraphy,
          stratigraphy: obj.age_chronostratigraphy__stratigraphy,
          stratigraphy_en: obj.age_chronostratigraphy__stratigraphy_en
        };
        this.autocomplete.age_chronostratigraphy.push(
          this.stratigraphy.age_chronostratigraphy
        );
      }
      if (this.isNotEmpty(obj.type)) {
        this.stratigraphy.type = {
          id: obj.type,
          value: obj.type__value,
          value_en: obj.type__value_en
        };
      }
      if (this.isNotEmpty(obj.rank)) {
        this.stratigraphy.rank = {
          id: obj.rank,
          value: obj.rank__value,
          value_en: obj.rank__value_en
        };
      }
      if (this.isNotEmpty(obj.scope)) {
        this.stratigraphy.scope = {
          id: obj.scope,
          value: obj.scope__value,
          value_en: obj.scope__value_en
        };
      }
      if (this.isNotEmpty(obj.status)) {
        this.stratigraphy.status = {
          id: obj.status,
          value: obj.status__value,
          value_en: obj.status__value_en
        };
      }
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.reference))
        obj.reference = {
          id: obj.reference,
          reference: obj.reference__reference
        };
      if (this.isNotEmpty(obj.locality))
        obj.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.locality)) {
        newObject.locality = obj.locality.id;
        newObject.locality__locality = obj.locality.locality;
        newObject.locality__locality_en = obj.locality.locality_en;
      }
      if (this.isNotEmpty(obj.reference)) {
        newObject.reference = obj.reference.id;
        newObject.reference__reference = obj.reference.reference;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "stratigraphy_reference") {
        // query = fetchStratigraphyReferences(
        //   this.$route.params.id,
        //   this.relatedData.searchParameters.stratigraphy_reference
        // );
      } else if (object === "stratigraphy_stratotype") {
        // query = fetchStratigraphyStratotypes(
        //   this.$route.params.id,
        //   this.relatedData.searchParameters.stratigraphy_stratotype
        // );
      } else if (object === "stratigraphy_synonym") {
        // query = fetchStratigraphySynonyms(
        //   this.$route.params.id,
        //   this.relatedData.searchParameters.stratigraphy_synonym
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

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.stratigraphy = this.stratigraphy.id;

      if (this.isNotEmpty(uploadableObject.locality)) {
        uploadableObject.locality = uploadableObject.locality.id
          ? uploadableObject.locality.id
          : uploadableObject.locality;
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
        id: null,
        stratigraphy: null,
        type: null,
        rank: null,
        scope: null,
        parent: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
