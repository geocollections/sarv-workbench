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
    :show-select="!!activeSelectionSeries"
    :single-select="true"
    @item-selected="$emit('add-item-to-selection-series', $event, 'analysis')"
    @toggle-select-all="$emit('toggle-select-all', $event, 'analysis')"
    expand-icon="fas fa-caret-down"
    :value="selected"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/analysis/' + item.id }"
        :title="$t('editAnalysis.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.sample="{ item }">
      <router-link
        :to="{ path: '/sample/' + item.sample }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.sample }}
      </router-link>
    </template>

    <template v-slot:item.sample__locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.sample__locality }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
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
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";

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
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },
  mixins: [activeListMixin],
  data: () => ({
    headers: [
      { text: "common.id", value: "id" },
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
    ]
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
