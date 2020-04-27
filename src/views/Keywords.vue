<template>
  <div class="keywords">
    <table-view-title title="header.keywords" buttonPath="/keyword/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="3"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchKeywords"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchKeywords } from "../assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapActions, mapState } from "vuex";

export default {
  name: "Keyword",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "term", title: "keyword.keyword", type: "text" },
      { id: "language", title: "keyword.language", type: "text" },
      {
        id: "keyword_category",
        title: "keyword.keyword_category",
        type: "text"
      }
    ]);
  },

  methods: {
    fetchKeywords() {
      return new Promise(resolve => {
        resolve(fetchKeywords(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped />
