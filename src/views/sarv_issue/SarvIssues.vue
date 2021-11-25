<template>
  <div class="sarv-issue">
    <table-view-title title="header.sarv_issues" />

    <table-view-search :col-size="4" />

    <list-module-core module="sarv_issue" :api-call="apiCall" />
  </div>
</template>

<script>
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import ListModuleCore from "../../components/ListModuleCore";
import { mapGetters } from "vuex";
import tableViewMixin from "@/mixins/tableViewMixin";
export default {
  name: "SarvIssues",

  components: { ListModuleCore, TableViewSearch, TableViewTitle },

  mixins: [tableViewMixin],

  computed: {
    ...mapGetters("user", ["getUserId"]),
  },

  async created() {
    // this.fetchActiveSarvIssues();
  },

  methods: {
    // ...mapActions("search", ["fetchActiveSarvIssues"]),

    apiCall() {
      return this.$api.rw.get("sarv_issue", {
        defaultParams: {
          nest: 1,
          or_search: `to_user:${this.getUserId} OR from_user:${this.getUserId}`,
        },
        options: this.$_tableViewMixin_options,
        searchFields: this.$_tableViewMixin_searchFields,
      });
    },
  },
};
</script>

<style scoped></style>
