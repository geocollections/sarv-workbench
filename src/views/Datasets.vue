<template>
  <div class="datasets">
    <table-view-title title="header.datasets" buttonPath="/dataset/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchDatasets"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDatasets } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import {mapGetters, mapState} from "vuex";
import searchParametersMixin from "../mixins/searchParametersMixin";
export default {
  name: "Datasets",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"])
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "name", title: "common.name", type: "text" },
      { id: "owner", title: "common.owner", type: "text" },
      { id: "date", title: "common.date", type: "text" },
      { id: "remarks", title: "common.remarks", type: "text" }
    ]);
  },

  methods: {
    fetchDatasets() {
      return new Promise(resolve => {
        resolve(fetchDatasets(this.searchParameters, this.getDatabaseId));
      });
    }
  }
};
</script>

<style scoped></style>
