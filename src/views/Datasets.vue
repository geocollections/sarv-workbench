<template>
  <div class="datasets">
    <table-view-title title="header.datasets" buttonPath="/dataset/add" />

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
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDatasets } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { mapGetters, mapState } from "vuex";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "Datasets",

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
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "name", title: "common.name", type: "text" },
      { id: "owner", title: "common.owner", type: "text" },
      { id: "date", title: "common.date", type: "text" },
      { id: "remarks", title: "common.remarks", type: "text" },
    ]);
  },

  methods: {
    apiCall(timestamp) {
      return fetchDatasets(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped></style>
