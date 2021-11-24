<template>
  <div class="imagesets">
    <table-view-title title="header.imagesets" />

    <table-view-search />

    <list-module-core :module="$route.meta.object" :api-call="apiCall" />
  </div>
</template>

<script>
import ListModuleCore from "../../components/ListModuleCore";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import { mapGetters } from "vuex";
import { fetchAttachments, fetchImagesets } from "@/assets/js/api/apiCalls";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "Imagesets",

  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle,
  },

  mixins: [tableViewMixin],

  computed: {
    ...mapGetters("user", ["getCurrentAgent"]),
  },

  methods: {
    apiCall() {
      return this.$api.rw.get("imageset", {
        defaultParams: {
          nest: 1,
          author: this.getCurrentAgent.id,
        },
        options: this.$_tableViewMixin_options,
        searchFields: this.$_tableViewMixin_searchFields,
      });
    },
  },
};
</script>

<style scoped />
