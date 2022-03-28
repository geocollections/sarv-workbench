<template>
  <div class="specimens">
    <table-view-title title="header.specimens" />

    <table-view-search :col-size="4" />

    <list-module-core
      :api-call="$_tableViewMixin_apiCall"
      :use-list-view="true"
      :use-image-view="true"
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
    TableViewSearch,
    TableViewTitle,
  },

  name: "Specimens",

  mixins: [tableViewMixin],
};
</script>
