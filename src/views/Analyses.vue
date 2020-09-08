<template>
  <div class="analyses">
    <table-view-title title="header.analyses" buttonPath="/analysis/add" show-import-button />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
      :col-size="4"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchAnalyses_"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAnalyses } from "../assets/js/api/apiCalls";
import { mapActions, mapGetters, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import isEmpty from "lodash";
import searchParametersMixin from "../mixins/searchParametersMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  name: "Analyses",

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"]),

    ...mapGetters("user", ["getCurrentUser", "getDatabaseId"])
  },

  created() {
    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.selection_seriesSearchParameters,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name"
    });

    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      {
        id: "analysis_method",
        title: "analysis.analysis_method",
        type: "text"
      },
      { id: "agentAndLab", title: "analysis.agentAndLab", type: "text" },
      { id: "sample", title: "analysis.sampleIdAndNumber", type: "text" },
      { id: "datasetId", title: "analysis.datasetId", type: "number" },
      { id: "selectionId", title: "specimen.selectionId", type: "number" },
      { id: "selection", title: "specimen.selection", type: "text" }
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    fetchAnalyses_() {
      return new Promise(resolve => {
        resolve(
          fetchAnalyses(
            this.searchParameters,
            this.getCurrentUser,
            this.getDatabaseId
          )
        );
      });
    }
  }
};
</script>

<style scoped></style>
