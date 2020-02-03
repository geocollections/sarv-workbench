<template>
  <div class="journals">
    <table-view-title title="header.journals" buttonPath="/journal/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="journal"
      :searchParameters="searchParameters"
      :api-call="fetchJournals"
      search-history="journalSearchHistory"
      view-type="journalViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchJournals } from "../assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";

export default {
  name: "Journals",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      filters: [
        { id: "journal", title: "journal.journalFilter", type: "text" },
        { id: "publisher", title: "journal.publisherFilter", type: "text" },
        { id: "remarks", title: "journal.remarksFilter", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "journal",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchJournals() {
      return new Promise(resolve => {
        resolve(fetchJournals(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        journal: null,
        publisher: null,
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
      this.$localStorage.remove("journalSearchHistory");
      this.$localStorage.remove("journalViewType");
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
