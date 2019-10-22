<template>
  <v-data-table
    class="taxon-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.taxon="{ item }">
      <a
        :href="getFossilsUrl(item.id)"
        :title="getFossilsUrl(item.id)"
        class="sarv-link"
        target="FossilsLink"
        >{{ item.taxon }}</a
      >
    </template>

    <template v-slot:item.parent__taxon="{ item }">
      <a
        :href="getFossilsUrl(item.parent_id)"
        :title="getFossilsUrl(item.parent_id)"
        class="sarv-link"
        target="FossilsLink"
        >{{ item.parent__taxon }}</a
      >
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getFossilsUrl(item.id)"
        :title="$t('editTaxon.viewMessage')"
        color="deep-orange"
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
  name: "TaxonTable",
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
      { text: "taxon.id", value: "id" },
      { text: "taxon.taxon", value: "taxon" },
      { text: "taxon.author_year", value: "author_year" },
      { text: "taxon.taxon_epithet", value: "taxon_epithet" },
      { text: "taxon.parent__taxon", value: "parent__taxon" },
      { text: "", value: "link", sortable: false }
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
  },
  methods: {
    getFossilsUrl(id) {
      return `https://fossiilid.info/${id}`;
    }
  }
};
</script>

<style scoped>
.taxon-table.v-data-table td,
.taxon-table.v-data-table th {
  padding: 0 8px;
}
</style>
