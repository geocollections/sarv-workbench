<template>
  <div class="specimens">
    <table-view-title
      title="header.specimens"
      buttonPath="/specimen/add"
      class="d-print-none"
    />

    <table-view-search
      class="d-print-none"
      :show-search="block.search"
      v-on:update:showSearch="block.search = $event"
      :filters="filters"
      :search-parameters="searchParameters"
      :col-size="4"
    />

    <list-module-core
      module="specimen"
      title="titles.editSpecimen"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSpecimens"
      search-history="specimenSearchHistory"
      view-type="specimenViewType"
      :multi-ordering="true"
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
import { mapState } from "vuex";
import TableViewTitle from "../components/partial/tableView/TableViewTitle";
import TableViewSearch from "../components/partial/tableView/TableViewSearch";
import { fetchSpecimens } from "../assets/js/api/apiCalls";

export default {
  components: {
    ListModuleCore,
    TableViewSearch,
    TableViewTitle
  },
  name: "Specimens",
  data() {
    return {
      response: {},
      columns: [
        { id: "id", title: "specimen.id", type: "number" },
        { id: "coll__number", title: "specimen.coll__number", type: "text" },
        { id: "specimen_id", title: "specimen.number", type: "text" },
        { id: "specimen_nr", title: "specimen.specimen_nr", type: "text" },
        {
          id: "locality__locality_en",
          title: "specimen.locality",
          type: "text"
        },
        { id: "depth", title: "specimen.depth", type: "number" },
        {
          id: "stratigraphy__stratigraphy_en",
          title: "specimen.stratigraphy",
          type: "text"
        },
        {
          id: "agent_collected__agent",
          title: "specimen.agent_collected",
          type: "text"
        },
        { id: "storage__location", title: "specimen.storage", type: "text" },
        {
          id: "is_private",
          title: "specimen.is_private",
          type: "text",
          isPrivate: true
        },
        {
          id: "specimen",
          title: "specimen.specimen",
          type: "text",
          orderBy: false
        }
      ],
      filters: [
        { id: "idSpecimen", title: "specimen.idSpecimen", type: "text" },
        { id: "collNumber", title: "specimen.coll__number", type: "text" },
        { id: "fossil", title: "specimen.fossil", type: "text" },
        { id: "mineralRock", title: "specimen.mineralRock", type: "text" },
        { id: "locality", title: "specimen.locality", type: "text" },
        { id: "stratigraphy", title: "specimen.stratigraphy", type: "text" },
        {
          id: "agent_collected",
          title: "specimen.agent_collected",
          type: "text"
        }
      ],
      searchParameters: this.setDefaultSearchParameters(),
      block: { search: true }
    };
  },

  computed: {
    ...mapState(["databaseId"])
  },

  watch: {
    searchParameters: {
      handler: function(newVal) {
        this.$store.dispatch("updateSearchParameters", {
          module: "specimen",
          filters: this.filters,
          params: newVal
        });
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    fetchSpecimens() {
      return new Promise(resolve => {
        resolve(fetchSpecimens(this.searchParameters, this.databaseId));
      });
    },
    searchParametersChanged(newParams) {
      this.searchParameters = newParams;
    },
    setDefaultSearchParameters() {
      return {
        idSpecimen: null,
        collNumber: null,
        fossil: null,
        mineralRock: null,
        locality: null,
        stratigraphy: null,
        agent_collected: null,
        page: 1,
        paginateBy: 50,
        orderBy: "-id"
      };
    },
    setDefaultSearchParametersFromDeleteButton() {
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
