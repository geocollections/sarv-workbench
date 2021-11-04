<template>
  <div class="sites">
    <table-view-title title="header.sites" buttonPath="/site/add" />

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
import { fetchSites } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Sites",

  mixins: [searchParametersMixin, tableHeaderMixin],

  props: {
    project: {
      type: String,
      default: null,
    },

    page: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "name", title: "common.name", type: "text" },
      { id: "number", title: "site.number", type: "text" },
      { id: "project", title: "site.relatedProject", type: "text" },
      {
        id: "date_start",
        title: "common.date_start",
        type: "text",
        isDate: true,
      },
      {
        id: "date_end",
        title: "common.date_end",
        type: "text",
        isDate: true,
      },
    ]);
  },

  methods: {
    apiCall() {
      return fetchSites(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    },
  },
};
</script>

<style scoped></style>
