<template>
  <v-data-table
    class="web-news-table"
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
        :to="{ path: '/web_news/' + item.id }"
        :title="$t('editWebNews.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.title="{ item }">
      <div v-translate="{ et: item.title_et, en: item.title_en }"></div>
    </template>

    <template v-slot:item.text="{ item }">
      <div v-translate="{ et: item.text_et, en: item.text_en }"></div>
    </template>

    <template v-slot:item.is_private="{ item }">
      <v-icon small v-if="item.is_private" color="green">fas fa-check</v-icon>
      <v-icon small v-else color="red">fas fa-minus</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "WebNewsTable",
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
      { text: "web_news.title", value: "title" },
      { text: "web_news.text", value: "text" },
      { text: "common.is_private", value: "is_private", align: "center" }
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
.web-news-table.v-data-table td,
.web-news-table.v-data-table th {
  padding: 0 8px;
}
</style>
