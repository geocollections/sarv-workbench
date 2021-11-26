<template>
  <div class="locations">
    <table-view-title title="header.locations" />

    <table-view-search :col-size="4" />

    <list-module-core
      :module="$route.meta.object"
      :api-call="apiCall"
      :use-list-view="true"
      :use-image-view="true"
    />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "Locations",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("location", {
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
