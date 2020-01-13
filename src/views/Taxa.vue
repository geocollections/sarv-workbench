<template>
  <div class="taxa">
    <table-view-title
      title="header.taxa"
      buttonPath="/taxon/add"
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="taxon"
      :searchParameters="searchParameters"
      :api-call="fetchTaxa"
      search-history="taxonSearchHistory"
      view-type="taxonViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchTaxa } from "../assets/js/api/apiCalls";

export default {
  name: "Taxons",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      filters: [
        { id: "id", title: "common.id", type: "number" },
        { id: "taxon", title: "taxon.taxon", type: "text" },
        { id: "author_year", title: "taxon.author_year", type: "text" },
        { id: "parent__taxon", title: "taxon.parent__taxon", type: "text" },
        { id: "taxon_epithet", title: "taxon.taxon_epithet", type: "text" },
        { id: "user_added", title: "taxon.user_added", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "taxon",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchTaxa() {
      return new Promise(resolve => {
        resolve(fetchTaxa(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        taxon: null,
        author_year: null,
        taxon_epithet: null,
        parent__taxon: null,
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
      this.$localStorage.remove("taxonSearchHistory");
      this.$localStorage.remove("taxonViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
