<template>
  <div class="rocks">
    <table-view-title title="header.rocks" />

    <table-view-search :col-size="4" />

    <list-module-core :module="$route.meta.object" :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "Rocks",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("rock", {
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
