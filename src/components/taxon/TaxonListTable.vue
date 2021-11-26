<template>
  <v-data-table
    class="taxon-list-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
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
    <template v-slot:item.taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.taxon }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.taxon }}</router-link
      >
    </template>

    <template v-slot:item.taxon__taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.taxon }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.taxon__taxon }}</router-link
      >
    </template>

    <template v-slot:item.taxon__author_year="{ item }">
      <router-link
        v-if="item.taxon__reference"
        :to="{ path: '/reference/' + item.taxon__reference }"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.taxon__author_year }}
      </router-link>
      <span v-else>{{ item.taxon__author_year }}</span>
    </template>

    <template v-slot:item.taxon__parent__taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.taxon__parent_id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.taxon__parent__taxon }}</router-link
      >
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.taxon__is_private"
        :href="`https://fossiilid.info/${item.taxon}`"
        :title="$t('editTaxon.viewMessage')"
        :color="bodyActiveColor"
        target="FossilsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "TaxonListTable",
  props: {
    response: {
      type: Object,
    },
    filter: {
      type: String,
      required: false,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          paginateBy: 25,
        };
      },
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "common.id", value: "taxon" },
      { text: "taxon.taxon", value: "taxon__taxon" },
      { text: "taxon.author_year", value: "taxon__author_year" },
      { text: "taxon.taxon_epithet", value: "taxon__taxon_epithet" },
      { text: "taxon.parent__taxon", value: "taxon__parent__taxon" },
      {
        text: "taxon.fossil_group__taxon",
        value: "taxon__fossil_group__taxon",
      },
      { text: "", value: "link", sortable: false },
    ],
    names: [],
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },
  },
};
</script>

<style>
.taxon-table.v-data-table td,
.taxon-table.v-data-table th {
  padding: 0 8px;
}
</style>
