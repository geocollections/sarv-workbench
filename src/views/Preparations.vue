<template>
  <div class="preparations">
    <table-view-title
      title="header.preparations"
      buttonPath="/preparation/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="12"
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
import { fetchPreparations } from "@/assets/js/api/apiCalls";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import searchParametersMixin from "../mixins/searchParametersMixin";
import ListModuleCore from "./ListModuleCore";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Preparations",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      {
        id: "preparation_number",
        title: "preparation.preparation_number",
        type: "text",
      },
      {
        id: "sample__locality__locality",
        title: "preparation.sample__locality__locality",
        type: "text",
      },
      {
        id: "stratigraphy",
        title: "common.stratigraphy",
        type: "text",
      },
      { id: "sample__depth", title: "common.depth", type: "text" },
      {
        id: "sample__number_additional",
        title: "preparation.sample__old_number",
        type: "text",
      },
    ]);
  },

  methods: {
    apiCall(timestamp) {
      return fetchPreparations(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped></style>
