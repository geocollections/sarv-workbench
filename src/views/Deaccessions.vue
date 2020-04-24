<template>
  <div class="deaccessions">
    <table-view-title
      title="header.deaccessions"
      buttonPath="/deaccession/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchDeaccessions"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchDeaccessions } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
export default {
  name: "Deaccessions",

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
    this.setActiveSearchParametersFilters([
      { id: "number", title: "common.number", type: "text" },
      { id: "description", title: "common.description", type: "text" }
    ]);
  },

  methods: {
    fetchDeaccessions() {
      return new Promise(resolve => {
        resolve(fetchDeaccessions(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
