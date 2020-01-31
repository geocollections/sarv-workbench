<template>
  <div class="locations">
    <table-view-title title="header.locations" buttonPath="/location/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="keyword"
      :searchParameters="searchParameters"
      :api-call="fetchLocations"
      search-history="locationsSearchHistory"
      view-type="locationsViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import { fetchLocations } from "../assets/js/api/apiCalls";

export default {
  name: "Locations",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "location", title: "location.location", type: "text" },
        {
          id: "location_location",
          title: "location.location_location",
          type: "text"
        },
        { id: "stratigraphy_free", title: "common.stratigraphy", type: "text" },
        { id: "agent", title: "location.agent", type: "text" },
        { id: "user_added", title: "common.user_added", type: "text" },
        { id: "date_added", title: "common.date_added", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "location",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchLocations() {
      return new Promise(resolve => {
        resolve(fetchLocations(this.searchParameters));
      });
    },

    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },

    setDefaultSearchParameters() {
      return {
        location: null,
        location_location: null,
        stratigraphy_free: null,
        agent: null,
        user_added: null,
        date_added: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("locationSearchHistory");
      this.$localStorage.remove("locationViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
