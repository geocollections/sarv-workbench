<template>
  <div class="drillcoreBoxes">
    <table-view-title title="header.drillcoreBoxes" />

    <table-view-search />

    <list-module-core
      :module="$route.meta.object"
      :api-call="apiCall"
      :use-image-view="true"
      :use-list-view="true"
    />
  </div>
</template>

<script>
import TableViewSearch from "../../components/partial/table_view/TableViewSearch";
import TableViewTitle from "../../components/partial/table_view/TableViewTitle";
import ListModuleCore from "../../components/ListModuleCore";
import {
  fetchDrillcoreBoxes,
  fetchDrillcoreBoxImages,
} from "../../assets/js/api/apiCalls";
import searchParametersMixin from "../../mixins/searchParametersMixin";
import { mapState } from "vuex";
import tableViewMixin from "@/mixins/tableViewMixin";
export default {
  name: "DrillcoreBoxes",

  components: { ListModuleCore, TableViewTitle, TableViewSearch },

  mixins: [tableViewMixin],

  methods: {
    apiCall() {
      return this.$api.rw.get("drillcore_box", {
        defaultParams: {
          nest: 1,
        },
        options: this.$_tableViewMixin_options,
        searchFields: this.$_tableViewMixin_searchFields,
      });
    },
  },
};
</script>

<style scoped />
