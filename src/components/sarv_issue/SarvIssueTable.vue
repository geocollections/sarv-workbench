<template>
  <v-data-table
    class="sarv-issue-table"
    :headers="translatedHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.replied="{ item }">
      <v-icon
        v-if="item.response !== null && item.response !== ''"
        color="green"
        small
        >fas fa-check</v-icon
      >
      <v-icon v-else color="red" small>fas fa-times</v-icon>
    </template>

    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/sarv_issue/' + item.id }"
        :title="$t('editSarvIssue.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SarvIssueTable",
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
  data: () => ({
    expanded: [],
    headers: [
      { text: "sarv_issue.replied", value: "replied", sortable: false },
      { text: "common.id", value: "id" },
      { text: "sarv_issue.from_user", value: "from_user__username" },
      { text: "sarv_issue.to_user", value: "to_user__username" },
      { text: "sarv_issue.title", value: "title" },
      { text: "sarv_issue.description", value: "description" },
      { text: "sarv_issue.url", value: "url" },
      { text: "sarv_issue.response", value: "response" }
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

<style scoped>
.sarv-issue-table.v-data-table td,
.sarv-issue-table.v-data-table th {
  padding: 0 8px;
}
</style>
