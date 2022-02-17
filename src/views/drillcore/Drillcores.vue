<template>
  <div class="drillcores">
    <table-view-title title="header.drillcores" />

    <table-view-search :col-size="4" />

    <!-- SEARCH FIELDS END -->
    <list-module-core :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
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
  name: "Drillcores",
  mixins: [tableViewMixin],
  methods: {
    apiCall() {
      return this.$api.rw.get("drillcore", {
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
