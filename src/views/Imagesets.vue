<template>
  <div class="imagesets">
    <table-view-title title="header.imagesets" buttonPath="/imageset/add" />

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
      :api-call="fetchImagesets"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchKeywords } from "../assets/js/api/apiCalls";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import { mapActions, mapState } from "vuex";

export default {
  name: "Imagesets",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  mixins: [searchParametersMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  created() {
    this.setActiveSearchParametersFilters([
      { id: "id", title: "common.id", type: "number" },
      { id: "term", title: "imageset.keyword", type: "text" },
      { id: "language", title: "imageset.language", type: "text" },
      {
        id: "keyword_category",
        title: "imageset.keyword_category",
        type: "text"
      }
    ]);
  },

  methods: {
    fetchImagesets() {
      return new Promise(resolve => {
        resolve(fetchImagesets(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped />
