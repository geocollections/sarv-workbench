<template>
  <div class="attachments">
    <table-view-title
      title="header.attachments"
      buttonPath="/attachment/add/other_file"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="3"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="attachment"
      :searchParameters="searchParameters"
      :api-call="fetchAttachments"
      :is-selection-series-active="isSelectionSeriesActive"
      :active-selection-series="activeSelectionSeries"
      search-history="attachmentSearchHistory"
      view-type="attachmentViewType"
      :use-image-view="true"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAttachments } from "../assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import isEmpty from "lodash";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Attachments",

  data() {
    return {
      response: {},
      filters: [
        { id: "image_number", title: "attachment.imageNumber", type: "text" },
        { id: "filename", title: "attachment.filename", type: "text" },
        { id: "specimen", title: "attachment.specimen", type: "text" },
        { id: "imageInfo", title: "attachment.imageInfo", type: "text" },
        { id: "locality", title: "attachment.locality", type: "text" },
        { id: "selectionId", title: "specimen.selectionId", type: "number" },
        { id: "selection", title: "specimen.selection", type: "text" },
        { id: "keyword", title: "keyword.keyword", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true },
      defaultSelectionSeriesParams: {
        id: null,
        name: null,
        remarks: null,
        user_added: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      }
    };
  },

  computed: {
    isSelectionSeriesActive() {
      return !!this.activeSelectionSeries;
    },

    ...mapState(["currentUser", "activeSelectionSeries"])
  },

  created() {
    // Used by sidebar
    const searchHistory = this.$localStorage.get(
      "selectionSeriesSearchHistory",
      null
    );
    let params =
      !!searchHistory && !isEmpty(searchHistory)
        ? searchHistory
        : this.defaultSelectionSeriesParams;
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
      searchHistory: "selectionSeriesSearchHistory",
      search: params,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name",
      agent: this.currentUser
    });
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "attachment",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchAttachments() {
      return new Promise(resolve => {
        resolve(fetchAttachments(this.searchParameters, this.currentUser));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        image_number: null,
        filename: null,
        specimen: null,
        imageInfo: null,
        locality: null,
        selectionId: null,
        selection: null,
        keyword: null,
        specimen_image_attachment: ["2", "1", "3", "4"],
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
      this.$localStorage.remove("specimenSearchHistory");
      this.$localStorage.remove("specimenViewType");
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
