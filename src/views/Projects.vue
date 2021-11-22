<template>
  <div class="projects">
    <table-view-title title="header.projects" buttonPath="/project/add" />

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
      :dynamic-search-fields="$_tableViewMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "../components/ListModuleCore";
import { fetchProjects } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Projects",

  mixins: [searchParametersMixin, tableViewMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    this.setActiveSearchParametersFilters([
      { id: "name", title: "common.name", type: "text" },
      { id: "id", title: "common.id", type: "number" },
    ]);
  },

  methods: {
    apiCall() {
      return fetchProjects(
        this.searchParameters,
        this.$_tableViewMixin_searchFields
      );
    },
  },
};
</script>

<style scoped></style>
