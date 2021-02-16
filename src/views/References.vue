<template>
  <div class="references">
    <table-view-title title="header.references" buttonPath="/reference/add" />

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
      :api-call="fetchReferences"
      :use-list-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchReferences } from "@/assets/js/api/apiCalls";
import { fetchAddReferenceToLibrary } from "../assets/js/api/apiCalls";
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
    TableViewSearch
  },

  name: "References",

  mixins: [toastMixin, searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    ...mapState("search", ["librarySearchParameters"]),

    ...mapGetters("user", ["getCurrentUser"])
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames(this.$route.meta.object);

    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.librarySearchParameters,
      request: "FETCH_LIBRARIES",
      title: "header.libraries",
      object: "library",
      field: "title_en",
      agent: this.getCurrentUser
    });

    this.setActiveSearchParametersFilters([
      { id: "author", title: "reference.author", type: "text" },
      { id: "year", title: "common.year", type: "number" },
      { id: "title", title: "reference.title", type: "text" },
      { id: "bookJournal", title: "reference.bookJournal", type: "text" },
      {
        id: "abstractRemarks",
        title: "reference.abstractRemarks",
        type: "text"
      },
      { id: "keywords", title: "reference.keywordsSearch", type: "text" },
      { id: "id", title: "common.id", type: "number" },
      {
        id: "libraryAuthorIdTitle",
        title: "reference.libraryAuthorIdTitle",
        type: "text"
      },
      // {id: "solrSearch", title: "reference.solrSearch", type: "text"},
      { id: "userAdded", title: "reference.userAdded", type: "text" }
    ]);

    this.$_tableHeaderMixin_initTableHeaders({
      headers: [
        "id",
        "author",
        "year",
        "title",
        "author",
        "journal",
        "volume",
        "pages",
        "is_estonian_reference",
        "link",
        "doi",
        "attachment",
        "url"
      ],
      table: this.$route.meta.object
    });
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    fetchReferences() {
      return new Promise(resolve => {
        resolve(fetchReferences(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped />
