<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
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
        :to="{ path: '/analysis_method/' + item.id }"
        :title="$t('editAnalysisMethod.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.analysis_method="{ item }">
      <span
        v-translate="{ et: item.analysis_method, en: item.method_en }"
      ></span>
    </template>

    <template v-slot:item.parent_method__analysis_method="{ item }">
      <span
        v-translate="{
          et: item.parent_method__analysis_method,
          en: item.parent_method__method_en,
        }"
      ></span>
    </template>
  </v-data-table>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "AnalysisMethodTable",
  mixins: [activeListMixin, tableHeaderMixin],
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
