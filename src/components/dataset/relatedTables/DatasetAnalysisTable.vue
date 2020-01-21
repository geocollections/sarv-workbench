<template>
  <div class="dataset-analysis-table">
    <v-data-table
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      expand-icon="fas fa-caret-down"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :class="bodyColor.split('n-')[0] + 'n-5'"
      :disable-sort="!$route.meta.isEdit"
    >
      <template v-slot:item.analysis="{ item }">
        <router-link
          :to="{ path: '/analysis/' + item.analysis }"
          :title="$t('editAnalysis.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis }}
        </router-link>
      </template>

      <template v-slot:item.sample="{ item }">
        <router-link
          v-if="item.analysis__sample"
          :to="{ path: '/sample/' + item.analysis__sample }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis__sample }}
        </router-link>
      </template>

      <template v-slot:item.locality="{ item }">
        <router-link
          v-if="item.analysis__sample__locality"
          :to="{ path: '/locality/' + item.analysis__sample__locality }"
          :title="$t('editLocality.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.analysis__sample__locality__locality,
              en: item.analysis__sample__locality__locality_en
            }"
          />
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "DatasetAnalysisTable",

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
    },
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    headers: [
      { text: "preparation.analysis", value: "analysis" },
      {
        text: "analysis.method",
        value: "analysis__analysis_method__analysis_method"
      },
      { text: "analysis.method_specification", value: "analysis__method_details" },
      { text: "analysis.sample", value: "sample" },
      { text: "common.locality", value: "locality" }
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
  }
};
</script>

<style scoped />
