<template>
  <div class="drillcoreBoxes">
    <table-view-title
      title="header.drillcoreBoxes"
      buttonPath="/drillcore_box/add"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="activeSearchParametersFilters"
      :search-parameters="searchParameters"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:reset:searchParameters="resetSearchParams"
    />

    <list-module-core
      :module="$route.meta.object"
      :searchParameters="searchParameters"
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      :use-image-view="true"
      :use-list-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
      v-on:search:images="searchDrillcoreBoxImages"
    />
  </div>
</template>

<script>
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import ListModuleCore from "./ListModuleCore";
import {
  fetchDrillcoreBoxes,
  fetchDrillcoreBoxImages
} from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapState } from "vuex";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";
export default {
  name: "DrillcoreBoxes",

  components: { ListModuleCore, TableViewTitle, TableViewSearch },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getDynamicFields();
    this.setActiveSearchParametersFilters([
      { id: "storage", title: "drillcore.storage", type: "text" },
      { id: "drillcore", title: "drillcore.drillcore", type: "text" }
    ]);
  },

  computed: {
    ...mapState("search", ["drillcore_boxViewType"])
  },
  methods: {
    apiCall() {
      return this.drillcore_boxViewType === "image" ||
        this.drillcore_boxViewType === "list"
        ? fetchDrillcoreBoxImages(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields
          )
        : fetchDrillcoreBoxes(
            this.searchParameters,
            this.$_tableHeaderMixin_searchFields
          );
    },
    searchDrillcoreBoxImages(searchImages) {
      // Just to trigger change
      if (searchImages) {
        this.updateSearchParamsByField(["date_added"], "sortBy");
        this.updateSearchParamsByField([true], "sortDesc");
      } else {
        this.updateSearchParamsByField(["id"], "sortBy");
        this.updateSearchParamsByField([true], "sortDesc");
      }
    },
  }
};
</script>

<style scoped />
