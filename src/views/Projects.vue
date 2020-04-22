<template>
  <div class="projects">
    <table-view-title title="header.projects" buttonPath="/project/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchProjects"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchProjects } from "@/assets/js/api/apiCalls";
import { mapGetters, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  name: "Projects",

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "name", title: "common.name", type: "text" },
      { id: "id", title: "common.id", type: "number" }
    ]);
  },

  computed: {
    ...mapGetters("user", ["getCurrentUser"])
  },

  methods: {
    fetchProjects() {
      return new Promise(resolve => {
        resolve(fetchProjects(this.searchParameters, this.getCurrentUser.id));
      });
    }
  }
};
</script>

<style scoped></style>
