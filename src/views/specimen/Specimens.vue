<template>
  <div class="specimens">
    <table-view-title title="header.specimens" />

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

  methods: {
    apiCall() {
      return this.$api.rw.get("specimen", {
        defaultParams: {
          // NOTE: Should be changed to 0 as api uses now SpecimenCompactSerializer and nest=1 is slow and unnecessary
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
