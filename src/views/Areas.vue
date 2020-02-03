<template>
  <div class="areas">
    <table-view-title title="header.areas" buttonPath="/area/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="3"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="area"
      :searchParameters="searchParameters"
      :api-call="fetchAreas"
      search-history="areaSearchHistory"
      view-type="areaViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import ListModuleCore from "./ListModuleCore";
import { fetchAreas } from "../assets/js/api/apiCalls";

export default {
  name: "Areas",

  components: { ListModuleCore, TableViewSearch, TableViewTitle },

  data() {
    return {
      response: {},
      filters: [
        { id: "name", title: "common.name", type: "text" },
        { id: "type", title: "common.type", type: "text" },
        { id: "area_ha", title: "area.area_ha", type: "text" },
        { id: "maakond", title: "area.maakond", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "area",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchAreas() {
      return new Promise(resolve => {
        resolve(fetchAreas(this.searchParameters));
      });
    },

    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },

    setDefaultSearchParameters() {
      return {
        name: null,
        type: null,
        area_ha: null,
        maakond: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["name"],
        sortDesc: [true]
      };
    },

    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },

    resetStorage() {
      this.$localStorage.remove("areaSearchHistory");
      this.$localStorage.remove("areaViewType");
    },

    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
