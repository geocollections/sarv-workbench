<template>
  <div class="deaccessions">
    <table-view-title
      title="header.deaccessions"
      buttonPath="/deaccession/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="deaccession"
      :searchParameters="searchParameters"
      :api-call="fetchDeaccessions"
      search-history="deaccessionSearchHistory"
      view-type="deaccessionViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import {fetchDeaccessions} from "../assets/js/api/apiCalls";
export default {
  name: "Deaccessions",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "number", title: "common.number", type: "text" },
        { id: "description", title: "common.description", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "deaccession",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchDeaccessions() {
      return new Promise(resolve => {
        resolve(fetchDeaccessions(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        number: null,
        description: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["number"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("deaccessionSearchHistory");
      this.$localStorage.remove("deaccessionViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
