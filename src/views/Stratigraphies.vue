<template>
  <div class="stratigraphies">
    <table-view-title
      title="header.stratigraphies"
      buttonPath="/stratigraphy/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="4"
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
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchStratigraphies } from "@/assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "Stratigraphies",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      {
        id: "stratigraphy",
        title: "common.stratigraphy",
        type: "text",
      },
      { id: "type", title: "common.type", type: "text" },
      { id: "rank", title: "stratigraphy.rank", type: "text" },
      { id: "scope", title: "stratigraphy.scope", type: "text" },
      { id: "parent", title: "stratigraphy.parent", type: "text" },
      { id: "indexes", title: "stratigraphy.indexes", type: "text" },
      { id: "author", title: "stratigraphy.author", type: "text" },
    ]);
  },

  methods: {
    apiCall() {
      return fetchStratigraphies(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    },
  },
};
</script>

<style scoped></style>
