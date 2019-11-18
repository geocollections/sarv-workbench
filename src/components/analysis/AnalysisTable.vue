<template>
  <v-data-table
    class="analysis-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/analysis/' + item.id }"
        :title="$t('editAnalysis.editMessage')"
        class="sarv-link"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.sample="{ item }">
      <router-link
        :to="{ path: '/sample/' + item.sample }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
      >
        {{ item.sample }}
      </router-link>
    </template>

    <template v-slot:item.sample__locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.sample__locality }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        v-if="item.sample__locality"
      >
        <span
          v-translate="{
            et: item.sample__locality__locality,
            en: item.sample__locality__locality_en
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'analysis', id: item.id })"
        :title="$t('editAnalysis.viewMessage')"
        color="deep-orange"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AnalysisTable",
  props: {
    response: {
      type: Object
    },
    filter: {
      type: String,
      required: false
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25
        };
      }
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "analysis.id", value: "id" },
      { text: "analysis.sample__id", value: "sample" },
      { text: "analysis.sample__number", value: "sample__number" },
      {
        text: "analysis.sample__locality",
        value: "sample__locality__locality"
      },
      { text: "analysis.sample__depth", value: "sample__depth" },
      {
        text: "analysis.analysis_method",
        value: "analysis_method__analysis_method"
      },
      { text: "analysis.date_", value: "date" },
      { text: "analysis.labor_txt", value: "lab_txt" },
      { text: "analysis.agent", value: "agent__agent" },
      { text: "", value: "link", sortable: false }
    ],
    names: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  },
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    }
  }
};
</script>

<style>
.analysis-table.v-data-table td,
.analysis-table.v-data-table th {
  padding: 0 8px;
}
</style>
