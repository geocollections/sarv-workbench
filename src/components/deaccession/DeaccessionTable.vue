<template>
  <v-data-table
    class="deaccession-table"
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
    @update:sort-desc="$emit('update:sorting', { value: $event, key: 'sortDesc' })"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/deaccession/' + item.id }"
        :title="$t('editDeaccession.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.number }}
      </router-link>
    </template>

    <template v-slot:item.agent_kandis="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.agent_kandis }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.agent_kandis__agent }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "DeaccessionTable",
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
      { text: "deaccession.number", value: "number" },
      { text: "deaccession.date_signed", value: "date_signed" },
      { text: "deaccession.agent_kandis", value: "agent_kandis" },
      { text: "deaccession.number_items", value: "number_items" },
      { text: "deaccession.description", value: "description" },
      { text: "common.id", value: "id" }
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
.deaccession-table.v-data-table td,
.deaccession-table.v-data-table th {
  padding: 0 8px;
}
</style>
