<template>
  <div class="web_news">
    <table-view-title title="header.web_news" buttonPath="/web_news/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
      :col-size="4"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchWebNews"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchWebNews } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
export default {
  name: "WebNews",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([]);
  },

  methods: {
    fetchWebNews() {
      return new Promise(resolve => {
        resolve(fetchWebNews(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
