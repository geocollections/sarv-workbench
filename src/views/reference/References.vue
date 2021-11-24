<template>
  <div class="references">
    <table-view-title title="header.references" />

    <table-view-search :col-size="4" />

    <list-module-core
      :module="$route.meta.object"
      :api-call="apiCall"
      :use-list-view="true"
    />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "References",

  mixins: [tableViewMixin],

  // computed: {
  //   ...mapState("search", ["librarySearchParameters"]),
  //
  //   ...mapGetters("user", ["getCurrentAgent"]),
  // },

  // async created() {
  //   // Used by sidebar
  //   this.setActiveSearchParameters({
  //     search: this.librarySearchParameters,
  //     request: "FETCH_LIBRARIES",
  //     title: "header.libraries",
  //     object: "library",
  //     field: "title_en",
  //     agent: this.getCurrentAgent,
  //   });
  //
  //   this.setActiveSearchParametersFilters([
  //     { id: "author", title: "reference.author", type: "text" },
  //     { id: "year", title: "common.year", type: "number" },
  //     { id: "title", title: "reference.title", type: "text" },
  //     { id: "bookJournal", title: "reference.bookJournal", type: "text" },
  //     {
  //       id: "abstractRemarks",
  //       title: "reference.abstractRemarks",
  //       type: "text",
  //     },
  //     { id: "keywords", title: "reference.keywordsSearch", type: "text" },
  //     { id: "id", title: "common.id", type: "number" },
  //     {
  //       id: "libraryAuthorIdTitle",
  //       title: "reference.libraryAuthorIdTitle",
  //       type: "text",
  //     },
  //     // {id: "solrSearch", title: "reference.solrSearch", type: "text"},
  //     { id: "userAdded", title: "reference.userAdded", type: "text" },
  //   ]);
  // },

  methods: {
    // ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall() {
      return this.$api.rw.get("reference", {
        defaultParams: {
          nest: 1,
        },
        options: this.$_tableViewMixin_options,
        searchFields: this.$_tableViewMixin_searchFields,
      });
    },
  },
};
</script>

<style scoped />
