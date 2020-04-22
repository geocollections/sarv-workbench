<template>
  <div class="references">
    <table-view-title title="header.references" buttonPath="/reference/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      :col-size="3"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :api-call="fetchReferences"
      :use-list-view="true"
      :is-library-active="isLibraryActive"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:add-reference-to-active-library="addReferenceToActiveLibrary"
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

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  name: "References",

  mixins: [toastMixin, searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  computed: {
    activeLibrary() {
      return this.$store.state["activeLibrary"];
    },

    isLibraryActive() {
      return this.activeLibrary !== null;
    },

    ...mapState("search", ["activeLibrary", "librarySearchParameters"]),

    ...mapGetters("user", ["getCurrentUser"])
  },

  created() {
    // Used by sidebar
    this.setActiveSearchParameters({
      searchHistory: "librarySearchHistory",
      search: this.librarySearchParameters,
      request: "FETCH_LIBRARIES",
      title: "header.libraries",
      object: "library",
      field: "library__title_en",
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
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    fetchReferences() {
      return new Promise(resolve => {
        resolve(fetchReferences(this.searchParameters));
      });
    },

    addReferenceToActiveLibrary(id) {
      let formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({ reference: id, library: this.activeLibrary.library })
      );

      fetchAddReferenceToLibrary(formData).then(
        response => {
          if (typeof response.data.message !== "undefined") {
            if (
              this.$i18n.locale === "ee" &&
              typeof response.data.message_et !== "undefined"
            ) {
              this.toastSuccess({ text: response.data.message_et });
            } else {
              this.toastSuccess({ text: response.data.message });
            }
          }
          if (typeof response.data.error !== "undefined") {
            if (
              this.$i18n &&
              this.$i18n.locale === "ee" &&
              typeof response.data.error_et !== "undefined"
            ) {
              this.toastError({ text: response.data.error_et });
            } else {
              this.toastError({ text: response.data.error });
            }
          }
        },
        errResponse => {
          if (
            typeof errResponse.data !== "undefined" &&
            typeof errResponse.data.error !== "undefined"
          )
            this.toastError({ text: errResponse.data.error });
          this.toastError({ text: this.$t("messages.uploadError") });
        }
      );
    }
  }
};
</script>

<style scoped />
