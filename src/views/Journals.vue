<template>
  <div class="journals">
    <table-view-title title="header.journals" buttonPath="/journal/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
    />

    <list-module-core
      module="journal"
      title="titles.editJournal"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchJournals"
      search-history="journalSearchHistory"
      view-type="journalViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchJournals } from "../assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  name: "Journals",
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "journal.id", type: "number" },
        { id: "journal_name", title: "journal.journalName", type: "text" },
        { id: "journal_short", title: "journal.journalShort", type: "text" },
        {
          id: "journal_original",
          title: "journal.journalOriginal",
          type: "text"
        },
        { id: "publisher", title: "journal.publisher", type: "text" },
        { id: "remarks", title: "journal.remarks", type: "text" }
      ],
      filters: [
        { id: "journal", title: "journal.journalFilter", type: "text" },
        { id: "publisher", title: "journal.publisherFilter", type: "text" },
        { id: "remarks", title: "journal.remarksFilter", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  methods: {
    fetchJournals() {
      return new Promise(resolve => {
        resolve(fetchJournals(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        journal: null,
        publisher: null,
        remarks: null,
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
