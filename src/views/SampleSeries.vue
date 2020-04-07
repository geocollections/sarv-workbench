<template>
  <div class="sample-series">
    <table-view-title
      title="header.sample_series"
      buttonPath="/sample_series/add"
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
      module="sample_series"
      :searchParameters="searchParameters"
      :api-call="fetchSampleSeries"
      search-history="sampleSeriesSearchHistory"
      view-type="sampleSeriesViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchSampleSeries } from "../assets/js/api/apiCalls";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "SamplesSeries",
  data() {
    return {
      response: {},
      filters: [
        { id: "name", title: "common.name", type: "text" },
        { id: "locality", title: "common.locality", type: "text" },
        {
          id: "agent_collected",
          title: "specimen.agent_collected",
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
          module: "sample_series",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchSampleSeries() {
      return new Promise(resolve => {
        resolve(fetchSampleSeries(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        name: null,
        locality: null,
        agent_collected: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("sampleSeriesSearchHistory");
      this.$localStorage.remove("sampleSeriesViewType");
    },
    resetSearchParameters() {
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
