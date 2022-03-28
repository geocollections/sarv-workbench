<template>
  <div class="localities">
    <table-view-title title="header.localities" buttonPath="/locality/add" />

    <table-view-search :col-size="4" />

    <list-module-core module="locality" :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import { mapActions, mapState } from "vuex";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  name: "Localities",

  mixins: [tableViewMixin],

  // computed: {
  //   ...mapState("search", ["selection_seriesSearchParameters"]),
  // },

  // async created() {
  //   // Used by sidebar
  //   this.setActiveSearchParameters({
  //     search: this.selection_seriesSearchParameters,
  //     request: "FETCH_SELECTION_SERIES",
  //     title: "header.selection_series",
  //     object: "selection_series",
  //     field: "name",
  //   });
  //
  //   this.setActiveSearchParametersFilters([
  //     { id: "id", title: "common.id", type: "number" },
  //     { id: "locality", title: "locality.locality", type: "text" },
  //     { id: "number", title: "locality.number", type: "text" },
  //     { id: "country", title: "locality.country", type: "text" },
  //     { id: "agent", title: "locality.agent", type: "text" },
  //     { id: "selectionId", title: "specimen.selectionId", type: "number" },
  //     { id: "selection", title: "specimen.selection", type: "text" },
  //   ]);
  // },

  methods: {
    // ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall() {
      return this.$api.rw.get("locality", {
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
