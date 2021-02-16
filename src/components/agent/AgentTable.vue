<template>
  <v-data-table
    class="agent-table"
    :headers="$_tableHeaderMixin_shownHeaders"
    dense
    hide-default-footer
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
        :to="{ path: '/agent/' + item.id }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.institution_name="{ item }">
      <div
        v-translate="{
          et: item.institution_name,
          en: item.institution_name_en
        }"
      ></div>
    </template>

    <template v-slot:item.institution="{ item }">
      <div
        v-translate="{
          et: item.institution__institution_name,
          en: item.institution__institution_name_en
        }"
      ></div>
    </template>

    <template v-slot:item.type="{ item }">
      <div
        v-translate="{
          et: item.type__value,
          en: item.type__value_en
        }"
      ></div>
    </template>
  </v-data-table>
</template>

<script>
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "AgentTable",
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
  },
};
</script>

<style>
.agent-table.v-data-table td,
.agent-table.v-data-table th {
  padding: 0 8px;
}
</style>
