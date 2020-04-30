<template>
  <v-data-table
    class="accession-table"
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
    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/accession/' + item.id }"
        :title="$t('editAccession.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.number }}
      </router-link>
    </template>

    <template v-slot:item.agent_andis="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.agent_andis }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.agent_andis__agent }}
      </router-link>
    </template>

    <template v-slot:item.agent_vottis="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.agent_vottis }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.agent_vottis__agent }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AccessionTable",
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
      { text: "accession.number", value: "number" },
      { text: "accession.date_signed", value: "date_signed" },
      { text: "accession.agent_andis", value: "agent_andis" },
      { text: "accession.agent_vottis", value: "agent_vottis" },
      { text: "accession.number_items", value: "number_items" },
      { text: "accession.description", value: "description" },
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
.accession-table.v-data-table td,
.accession-table.v-data-table th {
  padding: 0 8px;
}
</style>
