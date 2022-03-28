<template>
  <div class="sample-series">
    <table-view-title title="header.sample_series" />

    <table-view-search :col-size="4" />

    <list-module-core :api-call="apiCall" />
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

  name: "SamplesSeries",

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("sample_series", {
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
