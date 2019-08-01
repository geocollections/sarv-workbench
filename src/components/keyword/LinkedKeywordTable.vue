<template>
  <div class="linked-keyword-table row" v-if="keywords.length > 0">
    <div class="col-sm-12">

      <div class="table-responsive-sm">
        <table class="table table-hover table-bordered">
          <thead class="thead-light">
          <tr>
            <th>ID</th>
            <th>{{ $t('keyword.keyword') }}</th>
            <th>{{ $t('keyword.language') }}</th>
            <th>{{ $t('keyword.keyword_category') }}</th>
            <th>{{ $t('keyword.related_keyword') }}</th>
          </tr>

          <tr>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.id"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.term"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.language"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.keyword_category"
                            type="text"></b-form-input>
            </th>
            <th class="p-0">
              <b-form-input autocomplete="off" class="col-sm-8 mw-100" v-model="searchParameters.related_keyword"
                            type="text"></b-form-input>
            </th>
          </tr>
          </thead>

          <tbody v-if="keyword_results.length > 0">
          <tr v-for="keyword in keyword_results" :key="keyword.id">
            <td>
              <router-link :to="{ path: '/keyword/' + keyword.id }" target="_blank">
                <i class="far fa-eye"></i>
                {{keyword.id}}
              </router-link>
            </td>
            <td>{{ keyword.keyword }}</td>
            <td v-translate="{et: keyword.language__value, en: keyword.language__value_en}"></td>
            <td v-translate="{et: keyword.keyword_category__name, en: keyword.keyword_category__name_en}"></td>
            <td>{{ keyword.related_keyword__keyword }}</td>
          </tr>
          </tbody>

          <tbody v-else>
          <tr>
            <td colspan="7" class="text-center">
              <div class="d-flex justify-content-center">
                <div class="px-1">
                  <strong>{{ $t('messages.inputNoResults') }}</strong>
                </div>
                <div class="px-1 reset-search" @click="setDefaultSearchParameters" title="Reset search">
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
        size="sm" align="left" :limit="5" :hide-ellipsis="true" :total-rows="count"
        v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
      </b-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchKeywords, fetchReferenceKeywords} from "../../assets/js/api/apiCalls";

  export default {
    name: "LinkedKeywordTable",
    props: {
      referenceID: {
        type: String
      },
      keywords: {
        type: Array
      }
    },
    data() {
      return {
        keyword_results: [],
        count: 0,
        searchParameters: {
          id: null,
          term: null,
          language: null,
          keyword_category: null,
          related_category: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      }
    },

    methods: {
      loadLinkedKeywords() {
        if (!this.$route.meta.isEdit) {
          // Todo: Search object
          this.count = this.keywords.length;
          this.keyword_results = this.keywords;
        } else if (this.$route.meta.isEdit && this.referenceID) {
          fetchReferenceKeywords(this.searchParameters, this.referenceID).then(response => {
            this.count = response.body.count;
            this.keyword_results = response.body.results ? response.body.results : [];
          });
        }
        // else if (this.$route.meta.isEdit) {
        //   fetchKeywords(this.searchParameters).then(response => {
        //     this.count = response.body.count;
        //     this.keyword_results = response.body.results ? response.body.results : [];
        //   });
        // }
      },

      setDefaultSearchParameters() {
        console.log(this.searchParameters)
        this.searchParameters = {
          id: null,
          term: null,
          language: null,
          keyword_category: null,
          related_category: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      }
    },
    watch: {
      'searchParameters': {
        handler: function (newVal, oldVal) {
          this.loadLinkedKeywords()
        },
        immediate: true,
        deep: true
      }
    }
  }
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
    animation: fa-spin 2s infinite linear;}
</style>
