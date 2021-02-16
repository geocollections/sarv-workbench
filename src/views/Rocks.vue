<template>
  <div class="rocks">
    <table-view-title title="header.rocks" buttonPath="/rock/add" />

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
      :api-call="fetchRocks"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import { fetchRocks } from "../assets/js/api/apiCalls";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Rocks",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true }
    };
  },

  async created() {
    await this.$_tableHeaderMixin_getAllFieldNames();
    this.setActiveSearchParametersFilters([
      { id: "name", title: "rock.name", type: "text" },
      { id: "name_en", title: "rock.name_en", type: "text" },
      { id: "formula", title: "rock.formula", type: "text" },
      { id: "rock_type", title: "rock.rock_type", type: "text" },
      { id: "rock_rank", title: "rock.rock_rank", type: "text" },
      { id: "user_changed", title: "common.user_changed", type: "text" },
      { id: "id", title: "common.id", type: "text" }
    ]);
  },

  methods: {
    fetchRocks() {
      return new Promise(resolve => {
        resolve(fetchRocks(this.searchParameters));
      });
    }
  }
};
</script>

<style scoped></style>
