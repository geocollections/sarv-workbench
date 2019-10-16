<template>
  <div class="libraries">
    <table-view-title title="header.libraries" buttonPath="/library/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
    />

    <list-module-core
      module="library"
      title="titles.editLibrary"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchLibraries"
      search-history="librarySearchHistory"
      view-type="libraryViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchLibrariesFromLibraryAgent } from "../assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

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
      columns: [
        { id: "library", title: "library.id", type: "number" },
        { id: "library__title", title: "library.title", type: "text" },
        { id: "agent__agent", title: "library.author_txt", type: "text" },

        {
          id: "library__is_private",
          title: "library.private",
          type: "text",
          isPrivate: true
        },
        {
          id: "reference",
          title: "library.reference",
          type: "text",
          orderBy: false
        }
      ],
      filters: [
        { id: "author_txt", title: "library.author_txt", type: "text" },
        { id: "year", title: "library.year", type: "number" },
        { id: "title", title: "library.title", type: "text" },
        { id: "reference", title: "library.reference", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapState(["currentUser"])
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
      deep: true
    }
  },

  methods: {
    fetchLibraries() {
      return new Promise(resolve => {
        resolve(
          fetchLibrariesFromLibraryAgent(
            this.searchParameters,
            this.currentUser
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
        orderBy: "-library"
      };
    },
    setDefaultSearchParametersFromDeleteButton() {
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
