<template>
  <div class="drillcoreBoxes">
    <table-view-title
      title="header.drillcoreBoxes"
      buttonPath="/drillcore_box/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="drillcore_box"
      :searchParameters="searchParameters"
      :api-call="fetchDrillcoreBoxes"
      search-history="drillcoreBoxSearchHistory"
      view-type="drillcoreBoxViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import ListModuleCore from "./ListModuleCore";
import { fetchDrillcoreBoxes } from "../assets/js/api/apiCalls";
export default {
  name: "DrillcoreBoxes",

  components: { ListModuleCore, TableViewTitle, TableViewSearch },

  data() {
    return {
      response: {},
      filters: [
        { id: "storage", title: "drillcore.storage", type: "text" },
        { id: "drillcore", title: "drillcore.drillcore", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "drillcore_box",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchDrillcoreBoxes() {
      return new Promise(resolve => {
        resolve(fetchDrillcoreBoxes(this.searchParameters));
      });
    },

    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },

    setDefaultSearchParameters() {
      return {
        storage: null,
        drillcore: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["drillcore"],
        sortDesc: [true]
      };
    },

    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },

    resetStorage() {
      this.$localStorage.remove("drillcoreBoxSearchHistory");
      this.$localStorage.remove("drillcoreBoxViewType");
    },

    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped />
