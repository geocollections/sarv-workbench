<template>
  <div class="site-groundwaters">
    <table-view-title title="header.site_groundwater" />

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
  name: "SiteGroundwaters",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("site_groundwater", {
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
