<template>
  <div class="selectionSeries">
    <table-view-title
      title="header.selectionSeries"
      buttonPath="/selection_series/add"
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
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
      :api-call="fetchSelectionSeries"
      :multi-ordering="true"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchSelectionSeries } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";

export default {
  name: "SelectionSeries",

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
      { id: "id", title: "common.id", type: "number" },
      { id: "name", title: "common.name", type: "text" },
      { id: "remarks", title: "common.remarks", type: "text" },
      { id: "user_added", title: "selectionSeries.user_added", type: "text" }
    ]);
  },

  methods: {
    fetchSelectionSeries() {
      return new Promise(resolve => {
        resolve(fetchSelectionSeries(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
