<template>
  <div class="projects">
    <table-view-title title="header.projects" />

    <table-view-search />

    <!-- SEARCH FIELDS END -->
    <list-module-core :module="$route.meta.object" :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import { fetchProjects } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "Projects",

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("project", {
        defaultParams: {
          nest: 1,
        },
        options: this.$_tableViewMixin_options,
        searchFields: this.$_tableViewMixin_searchFields,
      });
    },
  },
};
</script>

<style scoped></style>
