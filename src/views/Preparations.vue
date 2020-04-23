<template>
  <div class="preparations">
    <table-view-title
      title="header.preparations"
      buttonPath="/preparation/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="12"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchPreparations"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchPreparations } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  name: "Preparations",

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      {
        id: "preparation_number",
        title: "preparation.preparation_number",
        type: "text"
      }
    ]);
  },

  methods: {
    fetchPreparations() {
      return new Promise(resolve => {
        resolve(fetchPreparations(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
