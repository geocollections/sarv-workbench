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
    />

    <list-module-core
      module="attachment"
      title="titles.editAttachment"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchAttachments"
      search-history="attachmentSearchHistory"
      view-type="attachmentViewType"
      :use-list-view="true"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="
        setDefaultSearchParametersFromDeleteButton
      "
    ></list-module-core>
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
      columns: [
        {
          id: "file",
          title: "attachment.file",
          type: "number",
          orderBy: false,
          showHeader: true
        },
        { id: "id", title: "attachment.id", type: "text" },
        {
          id: "format",
          title: "attachment.format",
          type: "text",
          orderBy: false,
          showHeader: true
        },
        {
          id: "image_number",
          title: "attachment.imageNumber_short",
          type: "text"
        },
        { id: "author__agent", title: "attachment.author", type: "text" },
        { id: "date_created", title: "attachment.date", type: "text" },
        { id: "specimen", title: "attachment.specimen_short", type: "text" },
        {
          id: "reference__reference",
          title: "attachment.reference",
          type: "text"
        },
        {
          id: "specimen_image_attachment",
          title: "attachment.specimenImageAttachment",
          type: "text"
        },
        {
          id: "is_private",
          title: "attachment.is_private_text_short",
          type: "text",
          isPrivate: true
        },
        { id: "attachment__filename", title: "", type: "text", orderBy: false }
      ],
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
        orderBy: "-id"
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
