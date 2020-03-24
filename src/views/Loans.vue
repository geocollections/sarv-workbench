<template>
  <div class="loans">
    <table-view-title title="header.loans" buttonPath="/loan/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="loan"
      :searchParameters="searchParameters"
      :api-call="fetchLoans"
      search-history="loanSearchHistory"
      view-type="loanViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import {fetchLoans} from "../assets/js/api/apiCalls";
import {mapState} from "vuex";
export default {
  name: "Loans",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "loan_number", title: "loan.loan_number", type: "text" },
        { id: "project", title: "loan.project", type: "text" },
        { id: "borrower", title: "loan.borrower", type: "text" },
        {
          id: "date_start",
          title: "loan.date_start",
          type: "text",
          isDate: true,
          calendarState: false,
          calendarStateDrawer: false
        },
        {
          id: "date_end",
          title: "loan.date_end",
          type: "text",
          isDate: true,
          calendarState: false,
          calendarStateDrawer: false
        }
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
          module: "loan",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchLoans() {
      return new Promise(resolve => {
        resolve(fetchLoans(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        loan_number: null,
        project: null,
        borrower: null,
        date_start: null,
        date_end: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("loanSearchHistory");
      this.$localStorage.remove("loanViewType");
    },
    resetSearchParameters() {
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
