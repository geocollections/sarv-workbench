<template>
  <div class="projects">
    <table-view-title title="header.projects" buttonPath="/project/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="project"
      title="titles.editProject"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchProjects"
      search-history="projectSearchHistory"
      view-type="projectViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
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
      columns: [
        { id: "id", title: "project.id", type: "number" },
        { id: "name", title: "project.name", type: "text" },
        { id: "project_type", title: "project.project_type", type: "text" },
        {
          id: "date_start",
          title: "project.date_start",
          type: "text",
          isDate: true
        },
        {
          id: "date_end",
          title: "project.date_end",
          type: "text",
          isDate: true
        },
        {
          id: "date_free",
          title: "project.date_free",
          type: "text",
          isDate: true
        },
        { id: "owner", title: "project.owner", type: "text" }
      ],
      filters: [
        { id: "owner", title: "project.name", type: "text" },
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
      deep: true
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
    setDefaultSearchParametersFromDeleteButton() {
      this.searchParameters = this.setDefaultSearchParameters();
    },
    setDefaultSearchParameters() {
      return {
        owner: null,
        id: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
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
