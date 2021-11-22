<template>
  <div class="libraries">
    <table-view-title title="header.libraries" buttonPath="/library/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

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
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import { fetchAttachments, fetchLibraries } from "@/assets/js/api/apiCalls";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Libraries",

  mixins: [searchParametersMixin, tableViewMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    this.setActiveSearchParametersFilters([
      { id: "author_txt", title: "library.author_txt", type: "text" },
      { id: "year", title: "common.year", type: "number" },
      { id: "title", title: "library.title", type: "text" },
      { id: "reference", title: "common.reference", type: "text" },
    ]);
  },

  methods: {
    apiCall() {
      const legacyQueryString = fetchLibraries(
        this.searchParameters,
        this.$_tableViewMixin_searchFields
      );
      return this.$api.rw.getLegacy(
        "library",
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
