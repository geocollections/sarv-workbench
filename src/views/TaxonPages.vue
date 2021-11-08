<template>
  <div class="taxon_pages">
    <table-view-title
      title="header.taxon_pages"
      buttonPath="/taxon_pages/add"
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
import { fetchTaxonPages } from "@/assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapActions } from "vuex";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "TaxonPages",

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
      { id: "taxon", title: "taxon_page.taxon", type: "text" },
      { id: "language", title: "common.language", type: "text" },
      { id: "title", title: "taxon_page.title", type: "text" },
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),
    apiCall() {
      return fetchTaxonPages(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    },
  },
};
</script>

<style scoped></style>
