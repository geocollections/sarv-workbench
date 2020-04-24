<template>
  <div class="drillcoreBoxes">
    <table-view-title
      title="header.drillcoreBoxes"
      buttonPath="/drillcore_box/add"
    />

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
      :api-call="fetchDrillcoreBoxes"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import ListModuleCore from "./ListModuleCore";
import { fetchDrillcoreBoxes } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
export default {
  name: "DrillcoreBoxes",

  components: { ListModuleCore, TableViewTitle, TableViewSearch },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "storage", title: "drillcore.storage", type: "text" },
      { id: "drillcore", title: "drillcore.drillcore", type: "text" }
    ]);
  },

  methods: {
    fetchDrillcoreBoxes() {
      return new Promise(resolve => {
        resolve(fetchDrillcoreBoxes(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped />
