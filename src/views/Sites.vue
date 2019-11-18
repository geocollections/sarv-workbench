<template>
  <div class="sites">
    <table-view-title title="header.sites" buttonPath="/site/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="site"
      title="titles.editSite"
      :show-filters="false"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSites"
      search-history="siteSearchHistory"
      view-type="siteViewType"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchSites } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Sites",
  props: {
    project: {
      type: String,
      default: null
    },

    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      response: {},
      sites: [],

      columns: [
        { id: "id", title: "site.id", type: "number" },
        { id: "name", title: "site.name", type: "text" },
        { id: "number", title: "site.number", type: "text" },
        { id: "project", title: "site.project", type: "text" },
        {
          id: "date_start",
          title: "site.date_start",
          type: "text",
          isDate: true
        },
        {
          id: "date_end",
          title: "site.date_end",
          type: "text",
          isDate: true
        }
      ],
      filters: [
        { id: "id", title: "site.id", type: "number" },
        { id: "name", title: "site.name", type: "text" },
        { id: "number", title: "site.number", type: "text" },
        { id: "project", title: "site.relatedProject", type: "text" },
        {
          id: "date_start",
          title: "site.date_start",
          type: "text",
          isDate: true,
          calendarState: false,
          calendarStateDrawer: false
        },
        {
          id: "date_end",
          title: "site.date_end",
          type: "text",
          isDate: true,
          calendarState: false,
          calendarStateDrawer: false
        }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "site",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchSites() {
      let vm = this;
      return new Promise(resolve => {
        resolve(fetchSites(vm.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("siteSearchHistory");
      this.$localStorage.remove("siteViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        name: null,
        number: null,
        project: null,
        date_start: null,
        date_end: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
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
