<template>
  <div class="keywords">
    <table-view-title title="header.keywords" buttonPath="/keyword/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
    />

    <list-module-core
      module="keyword"
      title="titles.editKeyword"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchKeywords"
      search-history="keywordSearchHistory"
      view-type="keywordViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchKeywords } from "../assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  name: "Keyword",
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "keyword.id", type: "number" },
        { id: "keyword", title: "keyword.keyword", type: "text" },
        { id: "language", title: "keyword.language", type: "text" },
        {
          id: "keyword_category",
          title: "keyword.keyword_category",
          type: "text"
        },
        {
          id: "related_keyword",
          title: "keyword.related_keyword",
          type: "text"
        },
        { id: "is_primary", title: "keyword.is_primary", type: "text" }
      ],
      filters: [
        { id: "id", title: "keyword.id", type: "number" },
        { id: "term", title: "keyword.keyword", type: "text" },
        { id: "language", title: "keyword.language", type: "text" },
        {
          id: "keyword_category",
          title: "keyword.keyword_category",
          type: "text"
        },
        {
          id: "related_keyword",
          title: "keyword.related_keyword",
          type: "text"
        }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "keyword",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true
    }
  },

  methods: {
    fetchKeywords() {
      return new Promise(resolve => {
        resolve(fetchKeywords(this.searchParameters));
      });
    },

    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
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
        orderBy: "-id"
      };
    },
    setDefaultSearchParametersFromDeleteButton() {
      this.searchParameters = this.setDefaultSearchParameters();
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
