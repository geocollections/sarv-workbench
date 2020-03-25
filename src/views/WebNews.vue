<template>
  <div class="web_news">
    <table-view-title title="header.web_news" buttonPath="/web_news/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      v-on:reset:searchPreferences="resetSearchPreferences"
      :col-size="4"
    />

    <list-module-core
      module="web_news"
      :searchParameters="searchParameters"
      :api-call="fetchWebNews"
      search-history="webNewsSearchHistory"
      view-type="webNewsViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import { fetchWebNews } from "../assets/js/api/apiCalls";
export default {
  name: "WebNews",

  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },

  data() {
    return {
      response: {},
      filters: [],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "web_news",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchWebNews() {
      return new Promise(resolve => {
        resolve(fetchWebNews(this.searchParameters));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
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
      this.$localStorage.remove("webNewsSearchHistory");
      this.$localStorage.remove("webNewsViewType");
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
