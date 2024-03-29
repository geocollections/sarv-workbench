<template>
  <div class="references">
    <table-view-title title="header.references" buttonPath="/reference/add" />
    <v-btn text elevation="0" color="warning" small to="/references">
      {{ $t("buttons.goToNewSearch") }}
      <v-icon right>fas fa-arrow-right</v-icon>
    </v-btn>

    <table-view-search
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
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      :use-list-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchReferences } from "@/assets/js/api/apiCalls";
import { mapActions, mapGetters, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import toastMixin from "../mixins/toastMixin";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },

  name: "References",

  mixins: [toastMixin, searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  computed: {
    ...mapState("search", ["librarySearchParameters"]),

    ...mapGetters("user", ["getCurrentUser"]),
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();

    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.librarySearchParameters,
      request: "FETCH_LIBRARIES",
      title: "header.libraries",
      object: "library",
      field: "title_en",
      agent: this.getCurrentUser,
    });

    this.setActiveSearchParametersFilters([
      { id: "author", title: "reference.author", type: "text" },
      { id: "year", title: "common.year", type: "number" },
      { id: "title", title: "reference.title", type: "text" },
      { id: "bookJournal", title: "reference.bookJournal", type: "text" },
      {
        id: "abstractRemarks",
        title: "reference.abstractRemarks",
        type: "text",
      },
      { id: "keywords", title: "reference.keywordsSearch", type: "text" },
      { id: "id", title: "common.id", type: "number" },
      {
        id: "libraryAuthorIdTitle",
        title: "reference.libraryAuthorIdTitle",
        type: "text",
      },
      // {id: "solrSearch", title: "reference.solrSearch", type: "text"},
      { id: "userAdded", title: "reference.userAdded", type: "text" },
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall(timestamp) {
      return fetchReferences(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped />
