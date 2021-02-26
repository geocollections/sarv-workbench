<template>
  <div class="samples">
    <table-view-title
      title="header.samples"
      buttonPath="/sample/add"
      show-import-button
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchSamples"
      :use-list-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchSamples } from "@/assets/js/api/apiCalls";
import { mapActions, mapGetters, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import isEmpty from "lodash";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  name: "Samples",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"]),

    ...mapGetters("user", ["getCurrentUser"])
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.selection_seriesSearchParameters,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name"
    });

    this.setActiveSearchParametersFilters([
      { id: "number", title: "sample.number", type: "text" },
      { id: "id", title: "common.id", type: "number" },
      { id: "locality", title: "sample.locality", type: "text" },
      { id: "depth", title: "common.depth", type: "text" },
      { id: "stratigraphy", title: "common.stratigraphy", type: "text" },
      { id: "agent", title: "sample.agent_collected", type: "text" },
      { id: "storage", title: "sample.storage", type: "text" },
      { id: "site", title: "sample.site", type: "text" },
      { id: "selectionId", title: "specimen.selectionId", type: "number" },
      { id: "selection", title: "specimen.selection", type: "text" },
      { id: "loan", title: "specimen.loan", type: "text" },
      { id: "series", title: "sample.series_search", type: "text" }
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    fetchSamples() {
      return new Promise(resolve => {
        resolve(fetchSamples(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
