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
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
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

    <template v-slot:item.related_keyword__keyword="{ item }">
      <span
        v-translate="{
          et: item.keyword_category__name,
          en: item.keyword_category__name_en
        }"
      ></span>
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
      { text: "keyword.related_keyword", value: "related_keyword__keyword" },
      { text: "keyword.is_primary", value: "is_primary" }
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
