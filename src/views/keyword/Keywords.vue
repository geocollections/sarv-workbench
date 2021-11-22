<template>
  <div class="keywords">
    <table-view-title title="header.keywords" />

    <table-view-search />

    <list-module-core :module="$route.meta.object" :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import { fetchKeywords } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "Keyword",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("keyword", {
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

<style scoped />
