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
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="selectionSeries"
      title="titles.editSelectionSeries"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSelectionSeries"
      search-history="selectionSeriesSearchHistory"
      view-type="selectionSeriesViewType"
      :multi-ordering="true"
      :export-buttons="true"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchSelectionSeries } from "../assets/js/api/apiCalls";

export default {
  name: "SelectionSeries",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "selectionSeries.id", type: "number" },
        { id: "name", title: "selectionSeries.name", type: "text" },
        { id: "remarks", title: "selectionSeries.remarks", type: "text" },
        { id: "user_added", title: "selectionSeries.user_added", type: "text" }
      ],
      filters: [
        { id: "id", title: "selectionSeries.id", type: "number" },
        { id: "name", title: "selectionSeries.name", type: "text" },
        { id: "remarks", title: "selectionSeries.remarks", type: "text" },
        { id: "user_added", title: "selectionSeries.user_added", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "selectionSeries",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchSelectionSeries() {
      return new Promise(resolve => {
        resolve(fetchSelectionSeries(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        name: null,
        remarks: null,
        user_added: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("selectionSeriesSearchHistory");
      this.$localStorage.remove("selectionSeriesViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
