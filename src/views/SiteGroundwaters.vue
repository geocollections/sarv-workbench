<template>
  <div class="site-groundwaters">
    <table-view-title title="header.site_groundwater" buttonPath="/site/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
      :col-size="4"
    />

    <list-module-core
      module="site_groundwater"
      :searchParameters="searchParameters"
      :api-call="fetchSiteGroundwaters"
      search-history="siteGroundwaterSearchHistory"
      view-type="siteGroundwaterViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchSiteGroundwaters } from "../assets/js/api/apiCalls";
export default {
  name: "SiteGroundwaters",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [
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
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "site_groundwater",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchSiteGroundwaters() {
      return new Promise(resolve => {
        resolve(fetchSiteGroundwaters(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        site: null,
        type_txt: null,
        aquifer_system: null,
        aquifer: null,
        well_depth: null,
        filter_type: null,
        filter_top: null,
        filter_top_z: null,
        filter_bottom: null,
        filter_bottom_z: null,
        url_veka: null,
        remarks: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("siteGroundwaterSearchHistory");
      this.$localStorage.remove("siteGroundwaterViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
