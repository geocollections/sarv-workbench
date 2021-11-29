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
      :use-image-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:search:images="searchSpecimenImages"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { mapActions, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchSpecimenImages, fetchSpecimens } from "@/assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  name: "Specimens",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  computed: {
    ...mapState("search", [
      "selection_seriesSearchParameters",
      "specimenViewType",
    ]),
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    // Used by sidebar
    this.setActiveSearchParameters({
      search: this.selection_seriesSearchParameters,
      request: "FETCH_SELECTION_SERIES",
      title: "header.selection_series",
      object: "selection_series",
      field: "name",
    });

    this.setActiveSearchParametersFilters([
      { id: "idSpecimen", title: "specimen.idSpecimen", type: "text" },
      { id: "specimenNr", title: "specimen.specimenNr", type: "text" },
      { id: "collNumber", title: "specimen.coll__number", type: "text" },
      { id: "fossil", title: "specimen.fossilSearch", type: "text" },
      { id: "mineralRock", title: "specimen.mineralRock", type: "text" },
      { id: "locality", title: "specimen.locality", type: "text" },
      { id: "stratigraphy", title: "common.stratigraphy", type: "text" },
      {
        id: "agent_collected",
        title: "specimen.agent_collected",
        type: "text",
      },
      {
        id: "storage",
        title: "specimen.storage",
        type: "text",
      },
      { id: "selectionId", title: "specimen.selectionId", type: "number" },
      { id: "selection", title: "specimen.selection", type: "text" },
      { id: "loan", title: "specimen.loan", type: "text" },
      { id: "reference", title: "common.reference", type: "text" },
      { id: "classification", title: "specimen.classification", type: "text" },
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall() {
      return this.specimenViewType === "image"
        ? fetchSpecimenImages(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields
          )
        : fetchSpecimens(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields
          );
    },
    searchSpecimenImages(searchImages) {
      // Just to trigger change
      if (searchImages) {
        this.updateSearchParamsByField(["date_added"], "sortBy");
        this.updateSearchParamsByField([true], "sortDesc");
      } else {
        this.updateSearchParamsByField(["id"], "sortBy");
        this.updateSearchParamsByField([true], "sortDesc");
      }
    },
  },
};
</script>

<style scoped></style>
