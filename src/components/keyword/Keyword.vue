<template>
  <div>
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
          <span :class="validate('keyword') ? 'green--text' : 'red--text'">{{
            $t("keyword.generalInfo")
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

          <!-- RELATED KEYWORD and REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="keyword.related_keyword"
                :color="bodyActiveColor"
                :items="autocomplete.related_keyword"
                :loading="autocomplete.loaders.related_keyword"
                item-text="keyword"
                :label="$t('keyword.related_keyword')"
                is-searchable
                v-on:search:items="autocompleteRelatedKeywordSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="keyword.remarks"
                :color="bodyActiveColor"
                :label="$t('keyword.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS PRIMARY -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="keyword.is_primary"
          :color="bodyActiveColor"
          :label="$t('keyword.is_primary')"
          @change="keyword.is_primary = !keyword.is_primary"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import { fetchListLanguages, fetchKeyword } from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";

export default {
  name: "Keyword",
  components: {
    InputWrapper,
    AutocompleteWrapper,
    CheckboxWrapper,
    Spinner
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
  mixins: [formManipulation, autocompleteMixin],

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
        searchHistory && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      // let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' && searchHistory !== '[object Object]' ? searchHistory : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "keywordSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_KEYWORDS",
        title: "header.keywords",
        object: "keyword",
        field: "keyword",
        databaseId: this.databaseId,
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  "$route.params.id": {
    handler: function() {
      this.reloadData();
    },
    deep: true
  },

  methods: {
    setInitialData() {
      return {
        searchHistory: "keywordSearchHistory",
        copyFields: [
          "id",
          "keyword",
          "language",
          "keyword_category",
          "related_keyword",
          "remarks",
          "is_primary"
        ],
        autocomplete: {
          loaders: {
            keyword_category: false,
            related_keyword: false
          },
          language: [],
          keyword_category: [],
          related_keyword: []
        },
        requiredFields: ["keyword", "language", "keyword_category"],
        keyword: {
          language: {
            id: 1,
            value: "inglise",
            value_en: "English"
          }
        },
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        }
      };
    },

    loadFullInfo() {
      fetchListLanguages().then(response => {
        this.autocomplete.language = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        fetchKeyword(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.keyword = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.keyword);
            this.removeUnnecessaryFields(this.keyword, this.copyFields);

            this.$emit("data-loaded", this.keyword);
            this.sendingData = false;
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
      }
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach(key => {
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

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.keyword.language = {
        id: obj.language,
        value: obj.language__value,
        value_en: obj.language__value_en
      };
      if (this.isNotEmpty(obj.keyword_category)) {
        this.keyword.keyword_category = {
          id: obj.keyword_category,
          name: obj.keyword_category__name,
          name_en: obj.keyword_category__name_en
        };
        this.autocomplete.keyword_category.push(this.keyword.keyword_category);
      }
      if (this.isNotEmpty(obj.keyword_category)) {
        this.keyword.related_keyword = {
          id: obj.related_keyword,
          keyword: obj.related_keyword__keyword
        };
        this.autocomplete.related_keyword.push(this.keyword.related_keyword);
      }
    },

    setDefaultSearchParameters() {
      return {
        id: null,
        term: null,
        language: null,
        keyword_category: null,
        related_keyword: null,
        is_primary: null,
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
