<template>
  <div class="collections">
    <table-view-title
      title="header.collections"
      buttonPath="/collection/add"
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
      :api-call="fetchCollections"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchCollections } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Collections",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "number", title: "collection.number", type: "number" },
      { id: "name", title: "common.name", type: "text" },
      { id: "agent", title: "collection.agent", type: "text" },
      { id: "locality", title: "collection.locality", type: "text" },
      { id: "reference", title: "common.reference", type: "text" },
      { id: "classification", title: "collection.classification", type: "text" }
    ]);
  },

  methods: {
    fetchCollections() {
      return new Promise(resolve => {
        resolve(fetchCollections(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
