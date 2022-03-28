<template>
  <div class="analysis_parameter">
    <table-view-title title="header.analysis_parameter" />

    <table-view-search />

    <list-module-core :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "AnalysisParameters",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("analysis_parameter", {
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
