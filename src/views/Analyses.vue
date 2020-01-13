<template>
  <div class="analyses">
    <table-view-title title="header.analyses" buttonPath="/analysis/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
      :col-size="4"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="analysis"
      :searchParameters="searchParameters"
      :api-call="fetchAnalyses_"
      search-history="analysisSearchHistory"
      view-type="analysisViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAnalyses } from "../assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Analyses",

  data() {
    return {
      response: {},
      filters: [
        { id: "id", title: "common.id", type: "number" },
        {
          id: "analysis_method",
          title: "analysis.analysis_method",
          type: "text"
        },
        { id: "agentAndLab", title: "analysis.agentAndLab", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapState(["currentUser", "databaseId"])
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        console.log(newVal);
        this.$store.dispatch("updateSearchParameters", {
          module: "analysis",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchAnalyses_() {
      return new Promise(resolve => {
        resolve(
          fetchAnalyses(
            this.searchParameters,
            this.currentUser,
            this.databaseId
          )
        );
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        analysis_method: null,
        agentAndLab: null,
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
      this.$localStorage.remove("specimenSearchHistory");
      this.$localStorage.remove("specimenViewType");
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
