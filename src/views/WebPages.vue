<template>
  <div class="web_pages">
    <table-view-title title="header.web_pages" buttonPath="/web_pages/add" />

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
      :api-call="fetchWebPages"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchWebPages } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "WebPages",

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

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();
    this.setActiveSearchParametersFilters([]);
  },

  methods: {
    fetchWebPages() {
      return new Promise(resolve => {
        resolve(fetchWebPages(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
