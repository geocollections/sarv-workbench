<template>
  <div class="accessions">
    <table-view-title title="header.accessions" buttonPath="/accession/add" />

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
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchAccessions } from "../assets/js/api/apiCalls";
import { mapActions } from "vuex";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "Accessions",

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
      { id: "number", title: "common.number", type: "text" },
      { id: "description", title: "common.description", type: "text" },
    ]);
  },

  methods: {
    apiCall(timestamp) {
      return fetchAccessions(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped></style>
