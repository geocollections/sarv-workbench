<template>
  <div class="areas">
    <table-view-title title="header.areas" buttonPath="/area/add" />

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
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import ListModuleCore from "./ListModuleCore";
import { fetchAreas } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Areas",

  components: { ListModuleCore, TableViewSearch, TableViewTitle },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "name", title: "common.name", type: "text" },
      { id: "type", title: "common.type", type: "text" },
      { id: "area_ha", title: "area.area_ha", type: "text" },
      { id: "maakond", title: "area.maakond", type: "text" }
    ]);
  },

  methods: {
    apiCall() {
      return fetchAreas(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields
      );
    }
  }
};
</script>

<style scoped></style>
