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
    :show-select="isSelectionSeriesActive"
    @item-selected="$emit('add-item-to-selection-series', $event, 'taxon')"
    @toggle-select-all="$emit('toggle-select-all', $event, 'taxon')"
    expand-icon="fas fa-caret-down"
    :value="selected"
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
        :to="{ path: '/taxon/' + item.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.taxon }}</router-link
      >
    </template>

    <template v-slot:item.author_year="{ item }">
      <router-link
        v-if="item.reference && $route.meta.object !== 'reference'"
        :to="{ path: '/reference/' + item.reference }"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.author_year }}
      </router-link>
      <span v-else>{{ item.author_year }}</span>
    </template>

    <template v-slot:item.parent__taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.parent_id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.parent__taxon }}</router-link
      >
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getFossilsUrl(item.id)"
        :title="$t('editTaxon.viewMessage')"
        :color="bodyActiveColor"
        target="FossilsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.selection_series="{ item }">
      <v-btn
        v-if="isSelectionSeriesActive"
        @click="$emit('add-item-to-selection-series', item.id, 'taxon')"
        title="Add taxon to selection series"
        color="amber"
        icon
      >
        <v-icon>fas fa-plus-square</v-icon>
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
    },
    isSelectionSeriesActive: {
      type: Boolean
    },
    activeSelectionSeries: {
      type: Object
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
      { text: "taxon.taxon", value: "taxon" },
      { text: "taxon.author_year", value: "author_year" },
      { text: "taxon.taxon_epithet", value: "taxon_epithet" },
      { text: "taxon.parent__taxon", value: "parent__taxon" },
      { text: "taxon.fossil_group__taxon", value: "fossil_group__taxon" },
      { text: "", value: "link", sortable: false },
      { text: "", value: "selection_series", sortable: false }
    ],
    // Todo: Get all item from active selection series
    selected: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers
        .map(header => {
          return {
            ...header,
            text: this.$t(header.text)
          };
        })
        .filter(item => {
          if (this.isSelectionSeriesActive) return item;
          else if (item.value !== "selection_series") return item;
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

<style>
.taxon-table.v-data-table td,
.taxon-table.v-data-table th {
  padding: 0 8px;
}
</style>
