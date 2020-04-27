<template>
  <v-data-table
    class="journal-table"
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
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/journal/' + item.id }"
        :title="$t('editJournal.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.journal_name="{ item }">
      <router-link
        :to="{ path: '/journal/' + item.id }"
        :title="$t('editJournal.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.journal_name }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "JournalTable",
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
      { text: "common.id", value: "id" },
      { text: "journal.journalName", value: "journal_name" },
      { text: "journal.journalShort", value: "journal_short" },
      { text: "journal.journalOriginal", value: "journal_original" },
      { text: "journal.publisher", value: "publisher" },
      { text: "common.remarks", value: "remarks" }
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

<style>
.journal-table.v-data-table td,
.journal-table.v-data-table th {
  padding: 0 8px;
}
</style>
