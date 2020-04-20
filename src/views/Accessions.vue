<template>
  <div class="accessions">
    <table-view-title title="header.accessions" buttonPath="/accession/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="accession"
      :searchParameters="searchParameters"
      :api-call="fetchAccessions"
      search-history="accessionSearchHistory"
      view-type="accessionViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchAccessions } from "../assets/js/api/apiCalls";
import { mapActions } from "vuex";
export default {
  name: "Accessions",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "number", title: "common.number", type: "text" },
        { id: "description", title: "common.description", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler(newVal) {
        this.updateSearchParameters({
          module: "accession",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchParameters"]),
    fetchAccessions() {
      return new Promise(resolve => {
        resolve(fetchAccessions(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        number: null,
        description: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["number"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("accessionSearchHistory");
      this.$localStorage.remove("accessionViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
