<template>
  <div class="attachments">
    <table-view-title
      title="header.attachments"
      buttonPath="/attachment/add/other_file"
    />

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
      :use-image-view="true"
      v-on:update:searchParameters="updateSearchParamsByField"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAttachments } from "@/assets/js/api/apiCalls";
import { mapActions, mapState } from "vuex";
import TableViewTitle from "../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../mixins/searchParametersMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch,
  },
  name: "Attachments",

  mixins: [searchParametersMixin, tableHeaderMixin],

  data() {
    return {
      block: { search: true },
    };
  },

  computed: {
    ...mapState("search", ["selection_seriesSearchParameters"]),
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
      { id: "id", title: "common.id", type: "text" },
      { id: "filename", title: "attachment.filename", type: "text" },
      { id: "image_number", title: "attachment.photoNumber", type: "text" },
      { id: "specimen", title: "attachment.specimen", type: "text" },
      { id: "imageInfo", title: "attachment.imageInfo", type: "text" },
      { id: "locality", title: "attachment.locality", type: "text" },
      { id: "selection", title: "specimen.selection", type: "text" },
      { id: "keyword", title: "keyword.keyword", type: "text" },
      { id: "author", title: "attachment.author", type: "text" },
    ]);
  },

  methods: {
    ...mapActions("search", ["setActiveSearchParameters"]),

    apiCall(timestamp) {
      return fetchAttachments(
        this.searchParameters,
        this.$_tableHeaderMixin_searchFields,
        timestamp
      );
    },
  },
};
</script>

<style scoped></style>
