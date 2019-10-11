<template>
  <div class="samples">
    <table-view-title title="header.samples" buttonPath="/sample/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
    />

    <list-module-core
      module="sample"
      title="titles.editSample"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSamples"
      :use-list-view="true"
      search-history="sampleSearchHistory"
      view-type="sampleViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchSamples } from "@/assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Samples",
  data() {
    return {
      response: {},
      columns: [
        { id: "number", title: "sample.numberSlashId", type: "text" },
        { id: "id", title: "sample.id", type: "number" },
        { id: "locality", title: "sample.locality", type: "text" },
        { id: "depth", title: "sample.depth", type: "text" },
        { id: "stratigraphy", title: "sample.stratigraphy", type: "text" },
        { id: "agent", title: "sample.agent_collected", type: "text" },
        { id: "storage", title: "sample.storage", type: "text" }
      ],
      filters: [
        { id: "number", title: "sample.number", type: "text" },
        { id: "id", title: "sample.id", type: "number" },
        { id: "locality", title: "sample.locality", type: "text" },
        { id: "depth", title: "sample.depth", type: "text" },
        { id: "stratigraphy", title: "sample.stratigraphy", type: "text" },
        { id: "agent", title: "sample.agent_collected", type: "text" },
        { id: "storage", title: "sample.storage", type: "text" },
        { id: "site", title: "sample.site", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },
  computed: {
    ...mapState(["currentUser", "databaseId"])
  },
  methods: {
    fetchSamples() {
      return new Promise(resolve => {
        resolve(
          fetchSamples(this.searchParameters, this.currentUser, this.databaseId)
        );
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        locality: null,
        number: null,
        depth: null,
        stratigraphy: null,
        agent: null,
        storage: null,
        site: null,
        id: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
    },
    setDefaultSearchParametersFromDeleteButton() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped>
label {
  margin: 5px 0 0 0;
  color: #999;
  font-size: 0.8rem;
}
</style>
