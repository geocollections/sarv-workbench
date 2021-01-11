<template>
  <div class="loans">
    <table-view-title title="header.loans" buttonPath="/loan/add" />

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
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchLoans"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchLoans } from "../assets/js/api/apiCalls";
import { mapGetters, mapState } from "vuex";
import searchParametersMixin from "../mixins/searchParametersMixin";
export default {
  name: "Loans",

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

  created() {
    this.setActiveSearchParametersFilters([
      { id: "loan_number", title: "loan.loan_number", type: "text" },
      { id: "project", title: "loan.project", type: "text" },
      { id: "borrower", title: "loan.borrower", type: "text" },
      {
        id: "date_start",
        title: "loan.date_start",
        type: "text",
        isDate: true
      },
      {
        id: "date_end",
        title: "loan.date_end",
        type: "text",
        isDate: true
      }
    ]);
  },

  methods: {
    fetchLoans() {
      return new Promise(resolve => {
        resolve(fetchLoans(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
