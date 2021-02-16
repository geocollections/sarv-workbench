<template>
  <v-data-table
    class="taxon-table"
    :headers="$_tableHeaderMixin_shownHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="!!activeSelectionSeries"
    @item-selected="$emit('toggle-item-in-selection-series', $event, 'taxon')"
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
  </v-data-table>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "TaxonTable",
  mixins: [activeListMixin, tableHeaderMixin],
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
    headers: [
      { text: "common.id", value: "id" },
      { text: "taxon.taxon", value: "taxon" },
      { text: "taxon.author_year", value: "author_year" },
      { text: "taxon.taxon_epithet", value: "taxon_epithet" },
      { text: "taxon.parent__taxon", value: "parent__taxon" },
      { text: "taxon.fossil_group__taxon", value: "fossil_group__taxon" },
      { text: "", value: "link", sortable: false }
    ]
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

<style>
.taxon-table.v-data-table td,
.taxon-table.v-data-table th {
  padding: 0 8px;
}
</style>
