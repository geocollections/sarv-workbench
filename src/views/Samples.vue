<template>
  <div class="samples">
    <table-view-title
      title="header.samples"
      buttonPath="/sample/add"
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
      module="sample"
      :searchParameters="searchParameters"
      :api-call="fetchSamples"
      :use-list-view="true"
      :is-selection-series-active="isSelectionSeriesActive"
      :active-selection-series="activeSelectionSeries"
      search-history="sampleSearchHistory"
      view-type="sampleViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchSamples } from "@/assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Samples",
  data() {
    return {
      response: {},
      filters: [
        { id: "number", title: "sample.number", type: "text" },
        { id: "id", title: "common.id", type: "number" },
        { id: "locality", title: "sample.locality", type: "text" },
        { id: "depth", title: "common.depth", type: "text" },
        { id: "stratigraphy", title: "common.stratigraphy", type: "text" },
        { id: "agent", title: "sample.agent_collected", type: "text" },
        { id: "storage", title: "sample.storage", type: "text" },
        { id: "site", title: "sample.site", type: "text" },
        { id: "selectionId", title: "specimen.selectionId", type: "number" },
        { id: "selection", title: "specimen.selection", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true },
      defaultSelectionSeriesParams: {
        id: null,
        name: null,
        remarks: null,
        user_added: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      }
    };
  },
  computed: {
    isSelectionSeriesActive() {
      return !!this.activeSelectionSeries;
    },

    ...mapState(["currentUser", "activeSelectionSeries"])
  },
  created() {
    // Used by sidebar
    const searchHistory = this.$localStorage.get(
      "selectionSeriesSearchHistory",
      "fallbackValue"
    );
    let params =
      typeof searchHistory !== "undefined" &&
      searchHistory !== null &&
      searchHistory !== "fallbackValue"
        ? searchHistory
        : this.defaultSelectionSeriesParams;
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
      searchHistory: "selectionSeriesSearchHistory",
      search: params,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name",
      agent: this.currentUser
    });
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "sample",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchSamples() {
      return new Promise(resolve => {
        resolve(fetchSamples(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        depth: null,
        stratigraphy: null,
        agent: null,
        storage: null,
        site: null,
        selectionId: null,
        selection: null,
        id: null,
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
      this.$localStorage.remove("sampleSearchHistory");
      this.$localStorage.remove("sampleViewType");
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
