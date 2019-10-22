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
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="collection"
      title="titles.editCollection"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchCollections"
      search-history="collectionSearchHistory"
      view-type="collectionViewType"
      :multi-ordering="true"
      :export-buttons="true"
      v-on:search-params-changed="searchParametersChanged"
    ></list-module-core>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchCollections } from "../assets/js/api/apiCalls";

export default {
  name: "Collections",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      columns: [
        { id: "number", title: "collection.number", type: "text" },
        { id: "name", title: "collection.name", type: "text" },
        { id: "name_long", title: "collection.name_long", type: "text" },
        { id: "database__acronym", title: "collection.database", type: "text" }
      ],
      filters: [
        { id: "id", title: "collection.id", type: "number" },
        { id: "number", title: "collection.number", type: "text" },
        { id: "name", title: "collection.name", type: "text" },
        { id: "agent", title: "collection.agent", type: "text" },
        { id: "locality", title: "collection.locality", type: "text" },
        { id: "reference", title: "collection.reference", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  computed: {
    ...mapState(["databaseId"])
  },
  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "collection",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    fetchCollections() {
      return new Promise(resolve => {
        resolve(fetchCollections(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        id: null,
        number: null,
        name: null,
        agent: null,
        locality: null,
        reference: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("collectionSearchHistory");
      this.$localStorage.remove("collectionViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
