<template>
  <div class="visits">
    <table-view-title title="header.visits" buttonPath="/visit/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
      :col-size="4"
    />

    <list-module-core
      module="visit"
      :searchParameters="searchParameters"
      :api-call="fetchVisits"
      search-history="visitSearchHistory"
      view-type="visitViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import {fetchVisits} from "../assets/js/api/apiCalls";
export default {
  name: "Visits",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "visitor", title: "visit.visitor", type: "text" },
        {
          id: "date_arrived",
          title: "visit.date_arrived",
          type: "text",
          isDate: true,
          calendarState: false,
          calendarStateDrawer: false
        },
        {
          id: "date_left",
          title: "visit.date_left",
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
          module: "visit",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchVisits() {
      return new Promise(resolve => {
        resolve(fetchVisits(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        visitor: null,
        date_arrived: null,
        date_left: null,
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
      this.$localStorage.remove("visitSearchHistory");
      this.$localStorage.remove("visitViewType");
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
