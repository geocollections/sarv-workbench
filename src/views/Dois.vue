<template>
  <div class="dois">
    <table-view-title title="header.dois" buttonPath="/doi/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="doi"
      title="titles.editDoi"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchDois"
      search-history="doiSearchHistory"
      view-type="doiViewType"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDois } from "../assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Dois",

  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "doi.identifier", type: "number" },
        { id: "creators", title: "doi.creators", type: "text" },
        { id: "publication_year", title: "doi.year", type: "text" },
        { id: "title", title: "doi.title", type: "text" },
        {
          id: "resource_type__value",
          title: "doi.resource_type",
          type: "text"
        },
        {
          id: "datacite_created",
          title: "doi.datacite_created",
          type: "text",
          orderBy: false,
          showHeader: true
        },
        { id: "id", title: "", type: "text", orderBy: false }
        // {id:"identifier",title:"",type:"text", orderBy: false},
      ],
      filters: [
        { id: "identifier", title: "doi.identifier", type: "text" },
        { id: "creators", title: "doi.creators", type: "text" },
        { id: "publication_year", title: "doi.year", type: "number" },
        { id: "title", title: "doi.title", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapState(["databaseId"])
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "doi",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchDois() {
      return new Promise(resolve => {
        resolve(fetchDois(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        identifier: null,
        creators: null,
        publication_year: null,
        title: null,
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
      this.$localStorage.remove("doiSearchHistory");
      this.$localStorage.remove("doiViewType");
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
