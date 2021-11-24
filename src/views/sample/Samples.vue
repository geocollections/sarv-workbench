<template>
  <div class="samples">
    <table-view-title title="header.samples" show-import-button />

    <table-view-search :col-size="4" />

    <list-module-core
      :module="$route.meta.object"
      :api-call="apiCall"
      :use-list-view="true"
    />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import { fetchSamples } from "@/assets/js/api/apiCalls";
import { mapActions, mapGetters, mapState } from "vuex";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  name: "Samples",

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("sample", {
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
