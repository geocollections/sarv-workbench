<template>
  <div class="references">
    <table-view-title title="header.references" />

    <table-view-search :col-size="4" />

    <list-module-core
      :module="$route.meta.object"
      :api-call="$_tableViewMixin_apiCall"
      :use-list-view="true"
    />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "References",

  mixins: [tableViewMixin],
};
</script>

<style scoped />
