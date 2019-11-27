<template>
  <div>
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- KEYWORD, LANGAUGE and KEYWORD CATEGORY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`keyword`">{{ $t("keyword.keyword") }}:</label>
              <b-form-input
                size="sm"
                id="name"
                v-model="keyword.keyword"
                :state="isNotEmpty(keyword.keyword)"
                type="text"
                maxlength="100"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`language`">{{ $t("keyword.language") }}:</label>
              <vue-multiselect
                v-model="keyword.language"
                id="project"
                :options="autocomplete.language"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :class="isNotEmpty(keyword.language) ? 'valid' : 'invalid'"
                :allow-empty="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`keyword_category`"
                >{{ $t("keyword.keyword_category") }}:</label
              >
              <vue-multiselect
                id="keyword_category"
                v-model="keyword.keyword_category"
                :label="nameLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.keyword_category"
                :options="autocomplete.keyword_category"
                :class="
                  isNotEmpty(keyword.keyword_category) ? 'valid' : 'invalid'
                "
                @search-change="autocompleteKeywordCategorySearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- RELATED KEYWORD and REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`related_keyword`"
                >{{ $t("keyword.related_keyword") }}:</label
              >
              <vue-multiselect
                id="related_keyword"
                v-model="keyword.related_keyword"
                label="keyword"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.related_keyword"
                :options="autocomplete.related_keyword"
                @search-change="autocompleteRelatedKeywordSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.keyword }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`remarks`">{{ $t("keyword.remarks") }}:</label>
              <b-form-input
                size="sm"
                id="remarks"
                v-model="keyword.remarks"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS PRIMARY -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-checkbox
          v-model="keyword.is_primary"
          id="is_primary"
          :label="$t('keyword.is_primary')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
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

export default {
  name: "Keyword",
  components: {
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
        this.$emit("set-object", "keyword");

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

      if (this.isNotEmpty(objectToUpload.language))
        uploadableObject.language = objectToUpload.language.id;
      if (this.isNotEmpty(objectToUpload.keyword_category))
        uploadableObject.keyword_category = objectToUpload.keyword_category.id;
      if (this.isNotEmpty(objectToUpload.related_keyword))
        uploadableObject.related_keyword = objectToUpload.related_keyword.id;

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
      this.keyword.keyword_category = {
        id: obj.keyword_category,
        name: obj.keyword_category__name,
        name_en: obj.keyword_category__name_en
      };
      this.keyword.related_keyword = {
        id: obj.related_keyword,
        keyword: obj.related_keyword__keyword
      };
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

<style scoped>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
