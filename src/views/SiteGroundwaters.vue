<template>
  <div class="site-groundwaters">
    <table-view-title title="header.site_groundwater" buttonPath="/site/add" />

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
      :api-call="fetchSiteGroundwaters"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchSiteGroundwaters } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapState } from "vuex";
export default {
  name: "SiteGroundwaters",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { title: "site_groundwater.site", id: "site", type: "text" },
      { title: "site_groundwater.type_txt", id: "type_txt", type: "text" },
      {
        title: "site_groundwater.aquifer_system",
        id: "aquifer_system",
        type: "text"
      },
      { title: "site_groundwater.aquifer", id: "aquifer", type: "text" },
      {
        title: "site_groundwater.well_depth",
        id: "well_depth",
        type: "number"
      },
      {
        title: "site_groundwater.filter_type",
        id: "filter_type",
        type: "text"
      },
      {
        title: "site_groundwater.filter_top",
        id: "filter_top",
        type: "text"
      },
      {
        title: "site_groundwater.filter_top_z",
        id: "filter_top_z",
        type: "text"
      },
      {
        title: "site_groundwater.filter_bottom",
        id: "filter_bottom",
        type: "text"
      },
      {
        title: "site_groundwater.filter_bottom_z",
        id: "filter_bottom_z",
        type: "text"
      },
      {
        title: "site_groundwater.url_veka_short",
        id: "url_veka",
        type: "text"
      },
      { title: "common.remarks", id: "remarks", type: "text" }
    ]);
  },

  computed: {
    ...mapState("user", ["getDatabaseId"])
  },

  methods: {
    fetchSiteGroundwaters() {
      return new Promise(resolve => {
        resolve(
          fetchSiteGroundwaters(this.searchParameters, this.getDatabaseId)
        );
      });
    }
  }
};
</script>

<style scoped></style>
