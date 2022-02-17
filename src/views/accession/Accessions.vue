<template>
  <div class="accessions">
    <table-view-title title="header.accessions" />

    <table-view-search />

    <list-module-core :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import tableViewMixin from "@/mixins/tableViewMixin";
export default {
  name: "Accessions",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("accession", {
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
