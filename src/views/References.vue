<template>
  <div class="references">
    <table-view-title title="header.references" buttonPath="/reference/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
    />

    <list-module-core
      module="reference"
      title="titles.editReference"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchReferences"
      search-history="referenceSearchHistory"
      view-type="referenceViewType"
      :multi-ordering="true"
      :export-buttons="true"
      :use-list-view="true"
      :use-alternative-table-view="true"
      :is-library-active="isLibraryActive"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
      v-on:add-reference-to-active-library="addReferenceToActiveLibrary"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchReferences } from "@/assets/js/api/apiCalls";
import { fetchAddReferenceToLibrary } from "../assets/js/api/apiCalls";
import { toastError, toastSuccess } from "../assets/js/iziToast/iziToast";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "References",
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "reference.id", type: "number" },
        { id: "author", title: "reference.author", type: "text" },
        { id: "year", title: "reference.year", type: "number" },
        { id: "title", title: "reference.title", type: "text" },
        { id: "journal", title: "reference.journal", type: "text" },
        { id: "volume", title: "reference.volume", type: "text" },
        { id: "pages", title: "reference.pages_short", type: "text" },
        {
          id: "is_estonian_reference",
          title: "reference.is_estonian_reference_short",
          type: "text",
          isEstonianReference: true
        },
        {
          id: "is_estonian_author",
          title: "reference.is_estonian_author_short",
          type: "text",
          isEstonianAuthor: true
        },
        // {id: "is_private", title: "reference.is_private", type: "text", isPrivate: true},
        { id: "id", title: "", type: "text", orderBy: false },
        { id: "doi", title: "reference.doi", type: "text" },
        { id: "attachment__filename", title: "reference.pdf", type: "text" },
        { id: "url", title: "reference.url", type: "text" },
        {
          id: "",
          title: "reference.library_short",
          type: "ACTIVE_LIBRARY_HEADER",
          orderBy: false,
          showHeader: true
        }
      ],
      filters: [
        { id: "author", title: "reference.author", type: "text" },
        { id: "year", title: "reference.year", type: "number" },
        { id: "title", title: "reference.title", type: "text" },
        { id: "bookJournal", title: "reference.bookJournal", type: "text" },
        {
          id: "abstractRemarks",
          title: "reference.abstractRemarks",
          type: "text"
        },
        { id: "keywords", title: "reference.keywordsSearch", type: "text" },
        { id: "id", title: "reference.id", type: "number" },
        {
          id: "libraryAuthorIdTitle",
          title: "reference.libraryAuthorIdTitle",
          type: "text"
        },
        // {id: "solrSearch", title: "reference.solrSearch", type: "text"},
        { id: "userAdded", title: "reference.userAdded", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    activeLibrary() {
      return this.$store.state["activeLibrary"];
    },

    isLibraryActive() {
      return this.$store.state["activeLibrary"] !== null;
    },

    ...mapState(["currentUser"])
  },

  created() {
    // Used by sidebar
    const searchHistory = this.$localStorage.get(
      "librarySearchHistory",
      "fallbackValue"
    );
    let params =
      typeof searchHistory !== "undefined" &&
      searchHistory !== null &&
      searchHistory !== "fallbackValue"
        ? searchHistory
        : this.searchParameters;
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
      searchHistory: "librarySearchHistory",
      search: params,
      request: "FETCH_LIBRARIES",
      title: "header.libraries",
      object: "library",
      field: "library__title_en",
      agent: this.currentUser
    });
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "reference",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true
    }
  },

  methods: {
    fetchReferences() {
      return new Promise(resolve => {
        resolve(fetchReferences(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters(isMultiOrdering) {
      return {
        author: null,
        year: null,
        title: null,
        bookJournal: null,
        abstractRemarks: null,
        keywords: null,
        id: null,
        libraryAuthorIdTitle: null,
        userAdded: null,
        isEstonianReference: null,
        isEstonianAuthor: null,
        solrSearch: null,
        page: 1,
        paginateBy: 50,
        orderBy: isMultiOrdering ? ["-id", "-year"] : "-id"
      };
    },
    setDefaultSearchParametersFromDeleteButton(arg1, isMultiOrdering) {
      this.searchParameters = this.setDefaultSearchParameters(isMultiOrdering);
    },

    addReferenceToActiveLibrary(id) {
      let formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({ reference: id, library: this.activeLibrary.library })
      );

      fetchAddReferenceToLibrary(formData).then(
        response => {
          if (typeof response.body.message !== "undefined") {
            if (
              this.$i18n.locale === "ee" &&
              typeof response.body.message_et !== "undefined"
            ) {
              toastSuccess({ text: response.body.message_et });
            } else {
              toastSuccess({ text: response.body.message });
            }
          }
          if (typeof response.body.error !== "undefined") {
            if (
              this.$i18n &&
              this.$i18n.locale === "ee" &&
              typeof response.body.error_et !== "undefined"
            ) {
              toastError({ text: response.body.error_et });
            } else {
              toastError({ text: response.body.error });
            }
          }
        },
        errResponse => {
          if (typeof errResponse.body.error !== "undefined")
            toastError({ text: errResponse.body.error });
          toastError({ text: this.$t("messages.uploadError") });
        }
      );
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
