<template>
  <div class="areas">
    <table-view-title title="header.areas" />

    <table-view-search />

    <list-module-core :module="$route.meta.object" :api-call="apiCall" />
  </div>
</template>

<script>
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import ListModuleCore from "../../components/ListModuleCore";
import { fetchAreas } from "../../assets/js/api/apiCalls";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "Areas",

  components: { ListModuleCore, TableViewSearch, TableViewTitle },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("area", {
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
