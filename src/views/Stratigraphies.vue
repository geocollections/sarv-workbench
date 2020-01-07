<template>
  <div class="stratigraphies">
    <table-view-title
      title="header.stratigraphies"
      buttonPath="/stratigraphy/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="stratigraphy"
      title="titles.editStratigraphy"
      :show-filters="false"
      :searchParameters="searchParameters"
      :api-call="fetchStratigraphies"
      search-history="stratigraphySearchHistory"
      view-type="stratigraphyViewType"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchStratigraphies } from "../assets/js/api/apiCalls";
export default {
  name: "Stratigraphies",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      filters: [
        { id: "id", title: "stratigraphy.id", type: "number" },
        {
          id: "stratigraphy",
          title: "stratigraphy.stratigraphy",
          type: "text"
        },
        { id: "type", title: "stratigraphy.type", type: "text" },
        { id: "rank", title: "stratigraphy.rank", type: "text" },
        { id: "scope", title: "stratigraphy.scope", type: "text" },
        { id: "parent", title: "stratigraphy.parent", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "stratigraphy",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchStratigraphies() {
      return new Promise(resolve => {
        resolve(fetchStratigraphies(this.searchParameters));
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
      this.$localStorage.remove("stratigraphySearchHistory");
      this.$localStorage.remove("stratigraphyViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        stratigraphy: null,
        type: null,
        rank: null,
        scope: null,
        parent: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped></style>
