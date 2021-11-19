<template>
  <div class="journals">
    <table-view-title title="header.journals" buttonPath="/journal/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :search-fields="$_tableHeaderMixin_searchFields"
      :col-size="4"
      @update:searchFields="updateDynamicSearchField"
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
import ListModuleCore from "../../components/ListModuleCore";
import { fetchAttachments, fetchJournals } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Journals",

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
      { id: "journal", title: "journal.journalFilter", type: "text" },
      { id: "publisher", title: "journal.publisherFilter", type: "text" },
      { id: "remarks", title: "journal.remarksFilter", type: "text" },
    ]);
  },

  methods: {
    apiCall() {
      const legacyQueryString = fetchJournals(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
      return this.$api.rw.getLegacy(
        "journal",
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
