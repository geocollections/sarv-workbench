<template>
  <v-data-table
    class="taxon-pages-table"
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
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/taxon_page/' + item.id }"
        :title="$t('editTaxonPages.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <!--    <template v-slot:item.content="{ item }">-->
    <!--      <div-->
    <!--          v-translate="{-->
    <!--          et: item.content_et,-->
    <!--          en: item.content_en,-->
    <!--          useInnerText: true,-->
    <!--          characterLimit: 1000-->
    <!--        }"-->
    <!--      ></div>-->
    <!--    </template>-->
    <template v-slot:item.taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.taxon }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.taxon }}
      </router-link>
    </template>
    <template v-slot:item.public="{ item }">
      <v-icon small v-if="!item.public" color="green">fas fa-check</v-icon>
      <v-icon small v-else color="red">fas fa-minus</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "TaxonPagesTable",
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
      { text: "taxon_page.taxon", value: "taxon" },
      { text: "common.language", value: "language" },
      { text: "taxon_page.title", value: "title" }
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
.taxon-pages-table.v-data-table td,
.taxon-pages-table.v-data-table th {
  padding: 0 8px;
}
</style>
