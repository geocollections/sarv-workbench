<template>
  <div>
    <v-data-table
      class="agent-table"
      :headers="translatedHeaders"
      dense
      hide-default-footer
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :class="bodyColor.split('-')[0] + '-5'"
    >
      <template v-slot:item.id="{ item }">
        <router-link
          :to="{ path: '/agent/' + item.id }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
          >{{ item.id }}</router-link
        >
      </template>

      <template v-slot:item.institution_name="{ item }">
        <div
          v-translate="{
            et: item.institution_name,
            en: item.institution_name_en
          }"
        ></div>
      </template>

      <template v-slot:item.institution__institution_name="{ item }">
        <div
          v-translate="{
            et: item.institution__institution_name,
            en: item.institution__institution_name_en
          }"
        ></div>
      </template>

      <template v-slot:item.type="{ item }">
        <div
          v-translate="{
            et: item.type__value,
            en: item.type__value_en
          }"
        ></div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "AgentTable",
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
    isSelectionSeriesActive: {
      type: Boolean
    },
    activeSelectionSeries: {
      type: Object
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
  data: () => ({
    headers: [
      { text: "agent.id", value: "id" },
      { text: "agent.name", value: "agent" },
      { text: "agent.forename", value: "forename" },
      { text: "agent.surename", value: "surename" },
      { text: "agent.institution", value: "institution_name" },
      {
        text: "agent.institution__institution",
        value: "institution__institution_name"
      },
      { text: "agent.remarks", value: "remarks" },
      { text: "agent.type", value: "type" }
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

<style scoped>
.agent-table.v-data-table td,
.agent-table.v-data-table th {
  padding: 0 8px;
}
</style>
