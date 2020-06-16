<template>
  <div class="locations">
    <table-view-title title="header.locations" buttonPath="/location/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchLocations"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import { fetchLocations } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";

export default {
  name: "Locations",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "location", title: "location.location", type: "text" },
      {
        id: "location_location",
        title: "location.location_location",
        type: "text"
      },
      { id: "stratigraphy_free", title: "common.stratigraphy", type: "text" },
      { id: "agent", title: "location.agent", type: "text" },
      { id: "user_added", title: "common.user_added", type: "text" },
      { id: "date_added", title: "common.date_added", type: "text" },
      { id: "contents", title: "location.contents", type: "text" }
    ]);
  },

  methods: {
    fetchLocations() {
      return new Promise(resolve => {
        resolve(fetchLocations(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
