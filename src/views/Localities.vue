<template>
  <div class="localities">
    <table-view-title title="header.localities" buttonPath="/locality/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="locality"
      title="titles.editLocality"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchLocalities"
      search-history="localitySearchHistory"
      view-type="localityViewType"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchLocalities } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Localities",
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "editLocality.id", type: "number" },
        { id: "locality", title: "editLocality.locality", type: "text" },
        { id: "number", title: "editLocality.number", type: "text" },
        { id: "country", title: "editLocality.country", type: "text" },
        { id: "agent", title: "editLocality.agent", type: "text" }
      ],
      filters: [
        { id: "id", title: "editLocality.id", type: "number" },
        { id: "locality", title: "editLocality.locality", type: "text" },
        { id: "number", title: "editLocality.number", type: "text" },
        { id: "country", title: "editLocality.country", type: "text" },
        { id: "agent", title: "editLocality.agent", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "locality",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchLocalities() {
      return new Promise(resolve => {
        resolve(fetchLocalities(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        county: null,
        country: null,
        agent: null,
        id: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("localitySearchHistory");
      this.$localStorage.remove("localityViewType");
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
