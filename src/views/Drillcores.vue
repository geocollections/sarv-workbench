<template>
  <div class="drillcores">
    <table-view-title title="header.drillcores" buttonPath="/drillcore/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
      :col-size="4"
    />

    <!-- SEARCH FIELDS END -->
    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchDrillcores"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchDrillcores } from "@/assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Drillcores",
  mixins: [searchParametersMixin, tableHeaderMixin],
  data() {
    return {
      block: { search: true }
    };
  },
  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      {
        id: "drillcore",
        title: "drillcore.drillcoreAndLocality",
        type: "text"
      },
      { id: "id", title: "drillcore.drillcoreId", type: "number" },
      { id: "boxes", title: "drillcore.boxes", type: "text" },
      { id: "locality", title: "drillcore.depth", type: "text" },
      { id: "storage", title: "drillcore.storage", type: "text" }
    ]);
  },
  methods: {
    fetchDrillcores() {
      return new Promise(resolve => {
        resolve(fetchDrillcores(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
