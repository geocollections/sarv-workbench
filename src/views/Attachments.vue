<template>
  <div class="attachments">
    <table-view-title
      title="header.attachments"
      buttonPath="/attachment/add/other_file"
    />

    <table-view-search
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
      v-on:reset:searchPreferences="resetSearchPreferences"
    />

    <list-module-core
      module="attachment"
      :searchParameters="searchParameters"
      :api-call="fetchAttachments"
      search-history="attachmentSearchHistory"
      view-type="attachmentViewType"
      :use-image-view="true"
      v-on:search-params-changed="searchParametersChanged"
    />
  </div>
</template>

<script>
import ListModuleCore from "./ListModuleCore";
import { fetchAttachments } from "../assets/js/api/apiCalls";
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";

export default {
  components: {
    ListModuleCore,
    TableViewTitle,
    TableViewSearch
  },
  name: "Attachments",

  data() {
    return {
      response: {},
      filters: [
        { id: "image_number", title: "attachment.imageNumber", type: "text" },
        { id: "filename", title: "attachment.filename", type: "text" },
        { id: "specimen", title: "attachment.specimen", type: "text" },
        { id: "imageInfo", title: "attachment.imageInfo", type: "text" },
        { id: "locality", title: "attachment.locality", type: "text" }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapState(["currentUser"])
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "attachment",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchAttachments() {
      return new Promise(resolve => {
        resolve(fetchAttachments(this.searchParameters, this.currentUser));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        image_number: null,
        filename: null,
        specimen: null,
        imageInfo: null,
        locality: null,
        specimen_image_attachment: ["2", "1", "3", "4"],
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
