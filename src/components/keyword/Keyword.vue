<template>
  <div class="keyword">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('keyword') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('keyword') ? 'green--text' : 'red--text'"
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
          <!-- KEYWORD, LANGAUGE and KEYWORD CATEGORY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="keyword.keyword"
                :color="bodyActiveColor"
                :label="$t('keyword.keyword')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="keyword.language"
                :color="bodyActiveColor"
                :items="autocomplete.language"
                :loading="autocomplete.loaders.language"
                :item-text="commonLabel"
                :label="$t('keyword.language')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="keyword.keyword_category"
                :color="bodyActiveColor"
                :items="autocomplete.keyword_category"
                :loading="autocomplete.loaders.keyword_category"
                :item-text="nameLabel"
                :label="$t('keyword.keyword_category')"
                is-searchable
                v-on:search:items="autocompleteKeywordCategorySearch"
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
          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="keyword.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="keyword.description"
                :label="$t('common.description')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
    <v-card
      v-if="$route.meta.isEdit && computedRelatedTabs.length > 0"
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
          <span>{{ $t("keyword.relatedTables." + tab.name) }}</span>
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
          <keyword-relation-table
            v-show="activeTab === 'keyword_relation'"
            :response="relatedData.keyword_relation"
            :search-parameters="relatedData.searchParameters.keyword_relation"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
            :is-keyword-base-term="!!keyword.is_primary"
          />

          <keyword-relation-reverse-table
            v-show="
              activeTab === 'keyword_relation' &&
              $route.meta.isEdit &&
              relatedData.keyword_relation_reverse.count > 0
            "
            :response="relatedData.keyword_relation_reverse"
            :search-parameters="
              relatedData.searchParameters.keyword_relation_reverse
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
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

    <!-- IS_PRIMARY and IS_PRIVATE -->
    <div class="d-flex flex-wrap mt-2">
      <checkbox-wrapper
        v-model="keyword.is_primary"
        :color="bodyActiveColor"
        :label="$t('keyword.is_primary')"
        @change="updateIsPrimary"
      />
      <checkbox-wrapper
        v-model="keyword.is_preferred"
        :color="bodyActiveColor"
        :label="$t('keyword.is_preferred')"
        @change="keyword.is_preferred = !keyword.is_preferred"
      />
      <checkbox-wrapper
        v-model="keyword.is_private"
        :color="bodyActiveColor"
        :label="$t('common.is_private')"
        @change="keyword.is_private = !keyword.is_private"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import {
  fetchListLanguages,
  fetchKeyword,
  fetchKeywordRelation,
  fetchKeywordRelationReverse,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import Editor from "../partial/inputs/Editor";
import KeywordRelationTable from "./relatedTables/KeywordRelationTable";
import requestsMixin from "../../mixins/requestsMixin";
import KeywordRelationReverseTable from "./relatedTables/KeywordRelationReverseTable";
import { mapActions, mapState } from "vuex";
import Pagination from "@/components/partial/Pagination";

export default {
  name: "Keyword",
  components: {
    Pagination,
    KeywordRelationReverseTable,
    KeywordRelationTable,
    Editor,
    InputWrapper,
    AutocompleteWrapper,
    CheckboxWrapper,
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
  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState("search", ["keywordSearchParameters"]),

    computedRelatedTabs() {
      return this.relatedTabs.filter(
        (tabs) => tabs.name !== "keyword_relation_reverse"
      );
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.keywordSearchParameters,
        request: "FETCH_KEYWORDS",
        title: "header.keywords",
        object: "keyword",
        field: "keyword",
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

  methods: {
    updateIsPrimary() {
      this.keyword.is_primary = !this.keyword.is_primary;
      if (this.keyword.is_primary)
        this.keyword.is_preferred = this.keyword.is_primary;
    },

    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "keyword_relation", iconClass: "fas fa-book-open" },
          { name: "keyword_relation_reverse", iconClass: "fas fa-book-open" },
        ],
        activeTab: "keyword_relation",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "keyword",
          "language",
          "keyword_category",
          "remarks",
          "description",
          "is_primary",
          "is_preferred",
          "is_private",
        ],
        autocomplete: {
          loaders: {
            keyword_category: false,
          },
          language: [],
          keyword_category: [],
        },
        requiredFields: ["keyword", "language"],
        keyword: {
          language: {
            id: 1,
            value: "inglise",
            value_en: "English",
          },
          is_primary: false,
          is_preferred: true,
        },
        block: {
          info: true,
          description: false,
        },
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
      fetchListLanguages().then((response) => {
        this.autocomplete.language = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchKeyword(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "keyword", this.handleResponse(response)[0]);
            // this.keyword = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.keyword);
            this.removeUnnecessaryFields(this.keyword, this.copyFields);

            this.$emit("data-loaded", this.keyword);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRelatedData() {
      return {
        keyword_relation: {
          count: 0,
          results: [],
        },
        keyword_relation_reverse: {
          count: 0,
          results: [],
        },
        searchParameters: {
          keyword_relation: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          keyword_relation_reverse: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
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

      // if (uploadableObject.is_primary) {
      //   uploadableObject.related_data = {};
      //   uploadableObject.related_data.keyword_relation = {};
      // }

      // Adding related data only on add view
      // if (!this.$route.meta.isEdit) {
      //   uploadableObject.related_data = {};
      //   this.relatedTabs.forEach(tab => {
      //     if (tab.name !== "keyword_relation_reverse") {
      //       if (this.isNotEmpty(this.relatedData[tab.name])) {
      //         uploadableObject.related_data[tab.name] = this.relatedData[
      //           tab.name
      //         ].results;
      //       }
      //     }
      //   });
      // }

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.keyword.language = {
        id: obj.language,
        value: obj.language__value,
        value_en: obj.language__value_en,
      };
      if (this.isNotEmpty(obj.keyword_category)) {
        this.keyword.keyword_category = {
          id: obj.keyword_category,
          name: obj.keyword_category__name,
          name_en: obj.keyword_category__name_en,
        };
        this.autocomplete.keyword_category.push(this.keyword.keyword_category);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "keyword_relation") {
        query = fetchKeywordRelation(
          this.$route.params.id,
          this.relatedData.searchParameters.keyword_relation
        );
      } else if (object === "keyword_relation_reverse") {
        query = fetchKeywordRelationReverse(
          this.$route.params.id,
          this.relatedData.searchParameters.keyword_relation_reverse
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
