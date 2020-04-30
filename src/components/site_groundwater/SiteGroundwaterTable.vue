<template>
  <v-data-table
    class="site-groundwater-table"
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
        :to="{ path: '/site/' + item.site }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.site }}
      </router-link>
    </template>

    <template v-slot:item.site="{ item }">
      <router-link
        :to="{ path: '/site/' + item.site }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <div
          v-translate="{ et: item.site__name, en: item.site__name_en }"
        ></div>
      </router-link>
    </template>

    <template v-slot:item.url_veka="{ item }">
      <v-btn
        v-if="item.url_veka"
        :href="item.url_veka"
        :title="$t('editSiteGroundwater.viewMessage')"
        :color="bodyActiveColor"
        target="VekaWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SiteGroundwaterTable",
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
      { text: "site_groundwater.type_txt", value: "type_txt" },
      { text: "site_groundwater.aquifer_system", value: "aquifer_system" },
      { text: "site_groundwater.aquifer", value: "aquifer" },
      { text: "site_groundwater.well_depth", value: "well_depth" },
      { text: "site_groundwater.filter_type", value: "filter_type" },
      { text: "site_groundwater.filter_top", value: "filter_top" },
      { text: "site_groundwater.filter_bottom", value: "filter_bottom" },
      { text: "site_groundwater.filter_top_z", value: "filter_top_z" },
      { text: "site_groundwater.filter_bottom_z", value: "filter_bottom_z" },
      { text: "site_groundwater.url_veka_short", value: "url_veka" },
      { text: "common.remarks", value: "remarks" }
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
.site-groundwater-table.v-data-table td,
.site-groundwater-table.v-data-table th {
  padding: 0 8px;
}
</style>
