<template>
  <div class="visits">
    <table-view-title title="header.visits" buttonPath="/visit/add" />

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
      :api-call="fetchVisits"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchVisits } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "Visits",

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
    this.setActiveSearchParametersFilters([
      { id: "visitor", title: "visit.visitor", type: "text" },
      {
        id: "date_arrived",
        title: "visit.date_arrived",
        type: "text",
        isDate: true
      },
      {
        id: "date_left",
        title: "visit.date_left",
        type: "text",
        isDate: true
      }
    ]);
  },

  methods: {
    fetchVisits() {
      return new Promise(resolve => {
        resolve(fetchVisits(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
