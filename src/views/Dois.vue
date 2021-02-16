<template>
  <div class="dois">
    <table-view-title title="header.dois" buttonPath="/doi/add" />

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
      :api-call="fetchDois"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDois } from "../assets/js/api/apiCalls";
import { mapGetters, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  name: "Dois",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();
    this.setActiveSearchParametersFilters([
      { id: "identifier", title: "doi.identifier", type: "text" },
      { id: "creators", title: "doi.creators", type: "text" },
      { id: "publication_year", title: "common.year", type: "number" },
      { id: "title", title: "doi.title", type: "text" }
    ]);
  },

  methods: {
    fetchDois() {
      return new Promise(resolve => {
        resolve(fetchDois(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
