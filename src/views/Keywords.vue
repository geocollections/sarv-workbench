<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.keywords') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/keyword/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <fieldset class="border p-2" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
<!--        <div class="row" v-if="filters.length > 0 && block.search">-->
<!--          <div class="col-md-4" v-for="field in filters">-->

<!--            <label :for="field.id">{{ $t(field.title) }}:</label>-->

<!--            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>-->

<!--          </div>-->
<!--        </div>-->

        <div class="d-flex flex-wrap justify-content-between" v-if="filters.length > 0 && block.search">
          <div class="mx-2 flex-fill" v-for="field in filters">

            <label :for="field.id">{{ $t(field.title) }}:</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="keyword"
      title="titles.editKeyword"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchKeywords"
      search-history="keywordSearchHistory"
      view-type="keywordViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchKeywords} from "../assets/js/api/apiCalls";

  export default {
    name: "Keyword",
    components: {
      ListModuleCore
    },
    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "keyword.id", type: "number"},
          {id: "keyword", title: "keyword.keyword", type: "text"},
          {id: "language", title: "keyword.language", type: "text"},
          {id: "keyword_category", title: "keyword.keyword_category", type: "text"},
          {id: "related_keyword", title: "keyword.related_keyword", type: "text"},
        ],
        filters: [
          {id: "id", title: "keyword.id", type: "number"},
          {id: "term", title: "keyword.keyword", type: "text"},
          {id: "language", title: "keyword.language", type: "text"},
          {id: "keyword_category", title: "keyword.keyword_category", type: "text"},
          {id: "related_keyword", title: "keyword.related_keyword", type: "text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    methods: {
      fetchKeywords() {
        return new Promise((resolve) => {
          resolve(fetchKeywords(this.searchParameters))
        });
      },

      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },

      setDefaultSearchParameters() {
        return {
          id: null,
          term: null,
          language: null,
          keyword_category: null,
          related_keyword: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      },
    }
  }
</script>

<style scoped>
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
