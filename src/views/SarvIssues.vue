<template>
  <div class="sarv-issue">
    <table-view-title title="header.sarv_issues" buttonPath="/sarv_issue/add" />

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
      module="sarv_issue"
      :searchParameters="searchParameters"
      :api-call="fetchSarvIssues"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import ListModuleCore from "./ListModuleCore";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapActions, mapGetters } from "vuex";
import { fetchSarvIssues } from "../assets/js/api/apiCalls";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "SarvIssues",

  components: { ListModuleCore, TableViewSearch, TableViewTitle },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapGetters("user", ["getUserId"])
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();
    this.fetchActiveSarvIssues();

    this.setActiveSearchParametersFilters([
      { id: "title", title: "sarv_issue.title", type: "text" },
      { id: "description", title: "sarv_issue.description", type: "text" },
      { id: "from_user", title: "sarv_issue.from_user", type: "text" }
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),
    ...mapActions("search", ["fetchActiveSarvIssues"]),

    fetchSarvIssues() {
      return new Promise(resolve => {
        resolve(fetchSarvIssues(this.searchParameters, this.getUserId));
      });
    }
  }
};
</script>

<style scoped></style>
