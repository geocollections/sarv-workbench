<template>
  <div class="libraries">
    <table-view-title title="header.libraries" buttonPath="/library/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="library"
      :searchParameters="searchParameters"
      :api-call="fetchLibraries"
      search-history="librarySearchHistory"
      view-type="libraryViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchLibrariesFromLibraryAgent } from "../assets/js/api/apiCalls";
import {mapGetters, mapState} from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Libraries",
  data() {
    return {
      response: {},
      filters: [
        { id: "author_txt", title: "library.author_txt", type: "text" },
        { id: "year", title: "common.year", type: "number" },
        { id: "title", title: "library.title", type: "text" },
        { id: "reference", title: "common.reference", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapGetters("user", ["getCurrentUser"])
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "library",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchLibraries() {
      return new Promise(resolve => {
        resolve(
          fetchLibrariesFromLibraryAgent(
            this.searchParameters,
            this.getCurrentUser
          )
        );
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        author_txt: null,
        year: null,
        title: null,
        reference: null,
        id: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["library"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("librarySearchHistory");
      this.$localStorage.remove("libraryViewType");
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
