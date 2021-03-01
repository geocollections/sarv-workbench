<template>
  <div class="localities">
    <table-view-title title="header.localities" buttonPath="/locality/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
      :col-size="4"
    />

    <list-module-core
      module="locality"
      :searchParameters="searchParameters"
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchLocalities } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { mapActions, mapGetters, mapState } from "vuex";
import isEmpty from "lodash";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  name: "Localities",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"])
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
      { id: "id", title: "common.id", type: "number" },
      { id: "locality", title: "locality.locality", type: "text" },
      { id: "number", title: "locality.number", type: "text" },
      { id: "country", title: "locality.country", type: "text" },
      { id: "agent", title: "locality.agent", type: "text" },
      { id: "selectionId", title: "specimen.selectionId", type: "number" },
      { id: "selection", title: "specimen.selection", type: "text" }
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    fetchLocalities() {
      return new Promise(resolve => {
        resolve(fetchLocalities(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
