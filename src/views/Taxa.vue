<template>
  <div class="taxa">
    <table-view-title
      title="header.taxa"
      buttonPath="/taxon/add"
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
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
import { fetchTaxa } from "@/assets/js/api/apiCalls";
import { mapActions, mapState } from "vuex";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Taxons",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"])
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.selection_seriesSearchParameters,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name"
    });

    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "taxon", title: "taxon.taxon", type: "text" },
      { id: "author_year", title: "taxon.author_year", type: "text" },
      { id: "parent__taxon", title: "taxon.parent__taxon", type: "text" },
      { id: "taxon_epithet", title: "taxon.taxon_epithet", type: "text" },
      { id: "user_added", title: "taxon.user_added", type: "text" },
      { id: "selectionId", title: "specimen.selectionId", type: "number" },
      { id: "selection", title: "specimen.selection", type: "text" }
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall() {
      return fetchTaxa(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    }
  }
};
</script>

<style scoped></style>
