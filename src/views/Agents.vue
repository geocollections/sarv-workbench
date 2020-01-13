<template>
  <div class="agents">
    <table-view-title title="header.agents" buttonPath="/agent/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="agent"
      :searchParameters="searchParameters"
      :api-call="fetchAgents"
      search-history="agentSearchHistory"
      view-type="agentViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAgents } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Agents",
  data() {
    return {
      response: {},
      filters: [
        { id: "id", title: "common.id", type: "number" },
        { id: "agent", title: "common.name", type: "text" },
        { id: "forename", title: "common.forename", type: "text" },
        { id: "surename", title: "common.surename", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "agent",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchAgents() {
      return new Promise(resolve => {
        resolve(fetchAgents(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        agent: null,
        forename: null,
        surename: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["agent"],
        sortDesc: [false]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("agentSearchHistory");
      this.$localStorage.remove("agentViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
