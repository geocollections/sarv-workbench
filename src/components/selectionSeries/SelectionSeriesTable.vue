<template>
  <v-data-table
    class="selectionSeries-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/selection_series/' + item.id }"
        :title="$t('editSelectionSeries.editMessage')"
        class="sarv-link"
        >{{ item.id }}</router-link
      >
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SelectionSeriesTable",
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
      { text: "selectionSeries.id", value: "id" },
      { text: "selectionSeries.name", value: "name" },
      { text: "selectionSeries.remarks", value: "remarks" },
      { text: "selectionSeries.user_added", value: "user_added" }
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
  }
};
</script>

<style scoped></style>
