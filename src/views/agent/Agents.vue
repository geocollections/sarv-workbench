<template>
  <div class="agents">
    <table-view-title title="header.agents" buttonPath="/agent/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
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
import ListModuleCore from "../../components/ListModuleCore";
import { fetchAgents } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Agents",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "agent", title: "common.name", type: "text" },
      { id: "forename", title: "common.forename", type: "text" },
      { id: "surename", title: "common.surename", type: "text" },
    ]);
  },

  methods: {
    apiCall() {
      const legacyQueryString = fetchAgents(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
      return this.$api.rw.getLegacy(
        "agent",
        {
          defaultParams: {
            nest: 1,
          },
        },
        legacyQueryString,
        this.searchParameters
      );
    },
  },
};
</script>

<style scoped></style>
