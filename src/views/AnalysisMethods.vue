<template>
  <div class="analysis_method">
    <table-view-title
      title="header.analysis_method"
      buttonPath="/analysis_method/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="6"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

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
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import { fetchAnalysisMethods } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "AnalysisMethods",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      {
        id: "analysis_method",
        title: "analysis_method.analysis_method",
        type: "text",
      },
      {
        id: "parent_method__analysis_method",
        title: "analysis_method.parent_method__analysis_method",
        type: "text",
      },
      {
        id: "remarks",
        title: "common.remarks",
        type: "text",
      },
    ]);
  },

  methods: {
    apiCall(timestamp) {
      return fetchAnalysisMethods(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped></style>
