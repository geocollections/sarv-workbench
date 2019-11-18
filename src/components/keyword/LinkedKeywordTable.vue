<template>
  <div class="linked-keyword-table row" v-if="keywordsExist">
    <div class="col-sm-12">
      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>{{ $t("keyword.keyword") }}</th>
              <th>{{ $t("keyword.language") }}</th>
              <th>{{ $t("keyword.keyword_category") }}</th>
              <th>{{ $t("keyword.related_keyword") }}</th>
            </tr>

            <tr>
              <th class="p-0">
                <b-form-input
                  autocomplete="off"
                  class="col-sm-8 mw-100"
                  v-model="searchParameters.id"
                  type="text"
                ></b-form-input>
              </th>
              <th class="p-0">
                <b-form-input
                  autocomplete="off"
                  class="col-sm-8 mw-100"
                  v-model="searchParameters.term"
                  type="text"
                ></b-form-input>
              </th>
              <th class="p-0">
                <b-form-input
                  autocomplete="off"
                  class="col-sm-8 mw-100"
                  v-model="searchParameters.language"
                  type="text"
                ></b-form-input>
              </th>
              <th class="p-0">
                <b-form-input
                  autocomplete="off"
                  class="col-sm-8 mw-100"
                  v-model="searchParameters.keyword_category"
                  type="text"
                ></b-form-input>
              </th>
              <th class="p-0">
                <b-form-input
                  autocomplete="off"
                  class="col-sm-8 mw-100"
                  v-model="searchParameters.related_keyword"
                  type="text"
                ></b-form-input>
              </th>
            </tr>
          </thead>

          <tbody v-if="keywordResults.length > 0">
            <tr v-for="keyword in keywordResults" :key="keyword.id">
              <td>
                <router-link
                  :to="{ path: '/keyword/' + keyword.id }"
                  target="_blank"
                >
                  <i class="far fa-eye"></i>
                  {{ keyword.id }}
                </router-link>
              </td>
              <td>{{ keyword.keyword }}</td>
              <td
                v-translate="{
                  et: keyword.language__value,
                  en: keyword.language__value_en
                }"
              ></td>
              <td
                v-translate="{
                  et: keyword.keyword_category__name,
                  en: keyword.keyword_category__name_en
                }"
              ></td>
              <td>{{ keyword.related_keyword__keyword }}</td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center">
                <div class="d-flex justify-content-center">
                  <div class="px-1">
                    <strong>{{ $t("messages.inputNoResults") }}</strong>
                  </div>
                  <div
                    class="px-1 reset-search"
                    @click="searchParameters = getDefaultSearchParameters()"
                    title="Reset search"
                  >
                    <i class="fas fa-redo-alt fa-spin-hover"></i>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-sm-12 col-md-6" v-if="count > searchParameters.paginateBy">
      <b-pagination
        size="sm"
        align="left"
        :limit="5"
        :hide-ellipsis="true"
        :total-rows="count"
        v-model="searchParameters.page"
        :per-page="searchParameters.paginateBy"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import {
  fetchKeywords,
  fetchReferenceKeywordIDs
} from "../../assets/js/api/apiCalls";

export default {
  name: "LinkedKeywordTable",
  props: {
    referenceID: {
      type: String
    },
    keywords: {
      required: true
    }
  },
  data() {
    return {
      keywordsExist: true,
      keywordResults: [],
      count: 0,
      // Todo: Implement paginateBy and Ordering
      searchParameters: {
        id: null,
        term: null,
        language: null,
        keyword_category: null,
        related_keyword: null,
        page: 1,
        paginateBy: 10,
        orderBy: "-id"
      }
    };
  },

  computed: {
    searchParametersHaveChanged() {
      return (
        JSON.stringify(this.searchParameters) !==
        JSON.stringify(this.getDefaultSearchParameters())
      );
    }
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        if (this.$route.meta.isEdit) this.loadLinkedKeywords();
        else this.searchKeywords(newVal);
      },
      immediate: true,
      deep: true
    },
    keywords: {
      handler: function(newVal) {
        if (!this.$route.meta.isEdit) {
          this.keywordsExist = newVal && newVal.length > 0;

          this.count = newVal ? newVal.length : 0;
          this.keywordResults = newVal ? newVal : [];
        }
      },
      deep: true
    },
    keywordsExist: {
      handler: function() {
        if (!this.$route.meta.isEdit) {
          this.keywordsExist = this.keywords && this.keywords.length > 0;
        }
      },
      immediate: true
    }
  },

  methods: {
    async loadLinkedKeywords() {
      if (this.referenceID) {
        let referenceKeywords = await fetchReferenceKeywordIDs(
          this.referenceID
        );
        let listOfKeywordIDs = this.getListOfKeywordIDs(referenceKeywords);
        if (listOfKeywordIDs.length > 0) {
          fetchKeywords(this.searchParameters, listOfKeywordIDs).then(
            response => {
              this.count = response.body.count;
              this.keywordResults = response.body.results
                ? response.body.results
                : [];
            }
          );
        } else {
          this.keywordsExist = false;
        }
      } else {
        // Todo: If some other object like attachment etc. then should add if clause or use regular keywords table (table in database needs update)
        fetchKeywords(this.searchParameters).then(response => {
          this.count = response.body.count;
          this.keywordResults = response.body.results
            ? response.body.results
            : [];
        });
      }
    },

    searchKeywords(searchParameters) {
      console.log("Todo: Search user inserted object");
      console.log(searchParameters);
    },

    getListOfKeywordIDs(keywordObject) {
      if (keywordObject && keywordObject.status === 200) {
        if (
          keywordObject.body &&
          keywordObject.body.results &&
          keywordObject.body.results.length > 0
        ) {
          return keywordObject.body.results.map(item => item.keyword);
        } else return [];
      } else return [];
    },

    getDefaultSearchParameters() {
      return {
        id: null,
        term: null,
        language: null,
        keyword_category: null,
        related_keyword: null,
        page: 1,
        paginateBy: 10,
        orderBy: "-id"
      };
    }
  }
};
</script>

<style scoped>
.reset-search {
  color: #007bff;
}

.reset-search:hover {
  cursor: pointer;
}

.fa-spin-hover:hover {
  -webkit-animation: fa-spin 2s infinite linear;
  -moz-animation: fa-spin 2s infinite linear;
  -o-animation: fa-spin 2s infinite linear;
  animation: fa-spin 2s infinite linear;
}
</style>
