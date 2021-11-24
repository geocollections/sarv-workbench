<template>
  <div class="attachments">
    <table-view-title
      title="header.attachments"
      buttonPath="/attachment/add/other_file"
    />

    <table-view-search :col-size="4" />

    <list-module-core
      :module="$route.meta.object"
      :api-call="apiCall"
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
    TableViewTitle,
    TableViewSearch,
  },
  name: "Attachments",

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("attachment", {
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
