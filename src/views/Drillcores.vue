<template>
  <div class="drillcores">
    <table-view-title title="header.drillcores" buttonPath="/drillcore/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
      :col-size="4"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="drillcore"
      :searchParameters="searchParameters"
      :api-call="fetchDrillcores"
      search-history="drillcoreSearchHistory"
      view-type="drillcoreViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDrillcores } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Drillcores",
  data() {
    return {
      response: {},
      filters: [
        { id: "drillcore", title: "drillcore.drillcoreAndLocality", type: "text" },
        { id: "id", title: "drillcore.drillcoreId", type: "number" },
        { id: "boxes", title: "drillcore.boxes", type: "text" },
        { id: "locality", title: "drillcore.depth", type: "text" },
        { id: "storage", title: "drillcore.storage", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "drillcore",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchDrillcores() {
      return new Promise(resolve => {
        resolve(fetchDrillcores(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        drillcore: null,
        boxes: null,
        locality: null,
        storage: null,
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
      this.$localStorage.remove("drillcoreSearchHistory");
      this.$localStorage.remove("drillcoreViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
