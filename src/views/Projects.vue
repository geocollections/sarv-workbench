<template>
  <div class="projects">
    <table-view-title title="header.projects" buttonPath="/project/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="project"
      title="titles.editProject"
      :searchParameters="searchParameters"
      :api-call="fetchProjects"
      search-history="projectSearchHistory"
      view-type="projectViewType"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchProjects } from "@/assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Projects",
  data() {
    return {
      response: {},
      filters: [
        { id: "name", title: "project.name", type: "text" },
        { id: "id", title: "project.id", type: "number" }
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
          module: "project",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchProjects() {
      return new Promise(resolve => {
        resolve(fetchProjects(this.searchParameters, this.currentUser.id));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        name: null,
        id: null,
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
      this.$localStorage.remove("projectSearchHistory");
      this.$localStorage.remove("projectViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
