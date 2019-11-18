<template>
  <div class="specimens">
    <table-view-title
      title="header.specimens"
      buttonPath="/specimen/add"
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="specimen"
      title="titles.editSpecimen"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSpecimens"
      search-history="specimenSearchHistory"
      view-type="specimenViewType"
      :multi-ordering="true"
      :use-list-view="true"
      :use-image-view="true"
      :export-buttons="true"
      :is-selection-series-active="isSelectionSeriesActive"
      :active-selection-series="activeSelectionSeries"
      v-on:search-params-changed="searchParametersChanged"
      v-on:search:specimenImages="searchSpecimenImages"
    ></list-module-core>
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchSpecimenImages, fetchSpecimens } from "../assets/js/api/apiCalls";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Specimens",
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "specimen.id", type: "number" },
        { id: "specimen_id", title: "specimen.number", type: "text" },
        { id: "name", title: "specimen.name", type: "text", orderBy: false },
        {
          id: "locality__locality_en",
          title: "specimen.locality",
          type: "text"
        },
        { id: "depth", title: "specimen.depth", type: "number" },
        {
          id: "stratigraphy__stratigraphy_en",
          title: "specimen.stratigraphy",
          type: "text"
        },
        {
          id: "agent_collected__agent",
          title: "specimen.agent_collected",
          type: "text"
        },
        {
          id: "specimen",
          title: "specimen.specimen",
          type: "text",
          orderBy: false
        }
      ],
      filters: [
        { id: "idSpecimen", title: "specimen.idSpecimen", type: "text" },
        { id: "collNumber", title: "specimen.coll__number", type: "text" },
        { id: "fossil", title: "specimen.fossilSearch", type: "text" },
        { id: "mineralRock", title: "specimen.mineralRock", type: "text" },
        { id: "locality", title: "specimen.locality", type: "text" },
        { id: "stratigraphy", title: "specimen.stratigraphy", type: "text" },
        {
          id: "agent_collected",
          title: "specimen.agent_collected",
          type: "text"
        },
        {
          id: "storage",
          title: "specimen.storage",
          type: "text"
        },
        { id: "selectionId", title: "specimen.selectionId", type: "number" },
        { id: "selection", title: "specimen.selection", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true },
      searchImages: false
    };
  },

  computed: {
    isSelectionSeriesActive() {
      return !!this.activeSelectionSeries;
    },

    ...mapState(["databaseId", "activeSelectionSeries"])
  },

  created() {
    // Used by sidebar
    const searchHistory = this.$localStorage.get(
      "selectionSeriesSearchHistory",
      "fallbackValue"
    );
    let params =
      typeof searchHistory !== "undefined" &&
      searchHistory !== null &&
      searchHistory !== "fallbackValue"
        ? searchHistory
        : this.searchParameters;
    this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
      searchHistory: "selectionSeriesSearchHistory",
      search: params,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selectionSeries",
      object: "selection_series",
      field: "name",
      agent: this.currentUser
    });
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "specimen",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchSpecimens() {
      return new Promise(resolve => {
        resolve(
          this.searchImages
            ? fetchSpecimenImages(this.searchParameters, this.databaseId)
            : fetchSpecimens(this.searchParameters, this.databaseId)
        );
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        idSpecimen: null,
        collNumber: null,
        fossil: null,
        mineralRock: null,
        locality: null,
        stratigraphy: null,
        agent_collected: null,
        selectionId: null,
        selection: null,
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
    },
    searchSpecimenImages(searchImages) {
      this.searchImages = searchImages;
      // Just to trigger change
      if (searchImages) {
        this.searchParameters.sortBy = ["date_added"];
        this.searchParameters.sortDesc = [true];
      } else {
        this.searchParameters.sortBy = ["id"];
        this.searchParameters.sortDesc = [true];
      }
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
