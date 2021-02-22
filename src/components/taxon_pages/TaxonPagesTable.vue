<template>
  <v-data-table
    :headers="$_tableHeaderMixin_shownHeaders"
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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "TaxonPagesTable",
  mixins: [tableHeaderMixin],
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
  }
};
</script>
