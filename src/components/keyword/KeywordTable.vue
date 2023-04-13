<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
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
          en: item.language__value_en,
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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "KeywordTable",
  mixins: [tableHeaderMixin],
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
};
</script>
