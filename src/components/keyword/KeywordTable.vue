<template>
  <v-data-table
    class="keyword-table"
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
        :to="{ path: '/keyword/' + item.id }"
        :title="$t('editKeyword.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.language__value="{ item }">
      <span
        v-translate="{
          et: item.language__value,
          en: item.language__value_en
        }"
      ></span>
    </template>

    <template v-slot:item.is_primary="{ item }">
      <v-icon v-if="item.is_primary" small color="green">fas fa-check</v-icon>
      <v-icon v-else small color="red">fas fa-minus</v-icon>
    </template>

    <template v-slot:item.is_preferred="{ item }">
      <v-icon v-if="item.is_preferred" small color="green">fas fa-check</v-icon>
      <v-icon v-else small color="red">fas fa-minus</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "KeywordTable",
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
      { text: "keyword.keyword", value: "keyword" },
      { text: "keyword.language", value: "language__value" },
      { text: "keyword.keyword_category", value: "keyword_category__name" },
      {
        text: "keyword.is_primary_table",
        value: "is_primary",
        align: "center"
      },
      {
        text: "keyword.is_preferred_table",
        value: "is_preferred",
        align: "center"
      }
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
.keyword-table.v-data-table td,
.keyword-table.v-data-table th {
  padding: 0 8px;
}
</style>
