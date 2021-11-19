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
      :dynamic-search-fields="$_tableHeaderMixin_searchFields"
      :api-call="apiCall"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import { mapGetters } from "vuex";
import { fetchAttachments, fetchImagesets } from "@/assets/js/api/apiCalls";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "Imagesets",

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

  async created() {
    this.setActiveSearchParametersFilters([
      { id: "number", title: "imageset.imagesetNumber", type: "text" },
      { id: "description", title: "imageset.description", type: "text" },
    ]);
  },

  computed: {
    ...mapGetters("user", ["getCurrentAgent"]),
  },

  methods: {
    apiCall() {
      const legacyQueryString = fetchImagesets(
        this.searchParameters,
        this.getCurrentAgent.id,
        this.$_tableHeaderMixin_searchFields
      );
      return this.$api.rw.getLegacy(
        "imageset",
        {
          defaultParams: {
            nest: 1,
          },
        },
        legacyQueryString,
        this.searchParameters
      );
    },
  },
};
</script>

<style scoped />
