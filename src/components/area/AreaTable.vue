<template>
  <v-data-table
    class="area-table"
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
    <template v-slot:item.name="{ item }">
      <router-link
        :to="{ path: '/area/' + item.id }"
        :title="$t('editArea.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.name,
            en: item.name_en
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.area_type="{ item }">
      <span
        v-translate="{
          et: item.area_type__name,
          en: item.area_type__name_en
        }"
      />
    </template>

    <template v-slot:item.maakond="{ item }">
      <span
        v-translate="{
          et: item.maakond__maakond,
          en: item.maakond__maakond_en
        }"
      />
    </template>
  </v-data-table>
</template>

<script>
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "AreaTable",
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

  data: () => ({
    expanded: [],
    headers: [
      { text: "common.name", value: "name" },
      { text: "common.type", value: "area_type" },
      { text: "area.maardla", value: "maardla" },
      { text: "area.eelis", value: "eelis" },
      { text: "area.area_ha", value: "area_ha" },
      { text: "area.deposit_area_ha", value: "deposit_area_ha" },
      { text: "area.maakond", value: "maakond" }
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

<style>
.area-table.v-data-table td,
.area-table.v-data-table th {
  padding: 0 8px;
}
</style>
