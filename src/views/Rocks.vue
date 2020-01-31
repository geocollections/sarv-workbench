<template>
  <div class="rocks">
    <table-view-title title="header.rocks" buttonPath="/rock/add" />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="rock"
      :searchParameters="searchParameters"
      :api-call="fetchRocks"
      search-history="rockSearchHistory"
      view-type="rockViewType"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import { fetchRocks } from "../assets/js/api/apiCalls";

export default {
  name: "Rocks",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  data() {
    return {
      response: {},
      filters: [
        { id: "name", title: "rock.name", type: "text" },
        { id: "name_en", title: "rock.name_en", type: "text" },
        { id: "formula", title: "rock.formula", type: "text" },
        { id: "rock_type", title: "rock.rock_type", type: "text" },
        { id: "rock_rank", title: "rock.rock_rank", type: "text" },
        { id: "user_changed", title: "common.user_changed", type: "text" },
        { id: "id", title: "common.id", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "rock",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchRocks() {
      return new Promise(resolve => {
        resolve(fetchRocks(this.searchParameters));
      });
    },

    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },

    setDefaultSearchParameters() {
      return {
        name: null,
        name_en: null,
        formula: null,
        rock_type: null,
        rock_rank: null,
        in_portal: null,
        in_estonia: null,
        user_changed: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["name"],
        sortDesc: [true]
      };
    },
    resetSearchPreferences() {
      this.resetStorage();
      this.resetSearchParameters();
    },
    resetStorage() {
      this.$localStorage.remove("rockSearchHistory");
      this.$localStorage.remove("rockViewType");
    },
    resetSearchParameters() {
      this.searchParameters = this.setDefaultSearchParameters();
    }
  }
};
</script>

<style scoped></style>
