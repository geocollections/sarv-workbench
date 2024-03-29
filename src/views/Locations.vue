<template>
  <div class="locations">
    <table-view-title title="header.locations" buttonPath="/location/add" />

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
      :use-image-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:search:images="searchLocationImages"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import { fetchLocations, fetchLocationImages } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapGetters, mapState } from "vuex";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Locations",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },
  computed: {
    ...mapState("search", ["locationViewType"]),
  },
  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "location", title: "location.location", type: "text" },
      {
        id: "location_location",
        title: "location.location_location",
        type: "text",
      },
      { id: "stratigraphy_free", title: "common.stratigraphy", type: "text" },
      { id: "agent", title: "location.agent", type: "text" },
      { id: "contents", title: "location.contents", type: "text" },
    ]);
  },

  methods: {
    apiCall(timestamp) {
      return this.locationViewType === "image"
        ? fetchLocationImages(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields,
            timestamp
          )
        : fetchLocations(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields,
            timestamp
          );
    },
    searchLocationImages(searchImages) {
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
