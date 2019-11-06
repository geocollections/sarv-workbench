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
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/journal/' + item.id }"
        :title="$t('editJournal.editMessage')"
        class="sarv-link"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.journal_name="{ item }">
      <router-link
        :to="{ path: '/journal/' + item.id }"
        :title="$t('editJournal.editMessage')"
        class="sarv-link"
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
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "journal.id", value: "id" },
      { text: "journal.journalName", value: "journal_name" },
      { text: "journal.journalShort", value: "journal_short" },
      { text: "journal.journalOriginal", value: "journal_original" },
      { text: "journal.publisher", value: "publisher" },
      { text: "journal.remarks", value: "remarks" }
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
