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
      :api-call="fetchLibraries"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { fetchLibraries } from "@/assets/js/api/apiCalls";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  name: "Libraries",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();

    this.setActiveSearchParametersFilters([
      { id: "author_txt", title: "library.author_txt", type: "text" },
      { id: "year", title: "common.year", type: "number" },
      { id: "title", title: "library.title", type: "text" },
      { id: "reference", title: "common.reference", type: "text" }
    ]);
  },

  methods: {
    fetchLibraries() {
      return new Promise(resolve => {
        resolve(fetchLibraries(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
