<template>
  <div class="analyses">
    <table-view-title
      title="header.analyses"
      buttonPath="/analysis/add"
      show-import-button
    />

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
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAnalyses } from "@/assets/js/api/apiCalls";
import {mapActions, mapState} from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  name: "Analyses",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"])
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
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

    apiCall() {
      return fetchAnalyses(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    }
  }
};
</script>

<style scoped></style>
