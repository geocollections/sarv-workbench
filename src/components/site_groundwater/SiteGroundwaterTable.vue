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
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/site_groundwater/' + item.id }"
        :title="$t('editSiteGroundwater.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.site="{ item }">
      <router-link
        :to="{ path: '/site/' + item.site }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <div v-translate="{ et: item.site__name, en: item.site__name_en }"></div>
      </router-link>
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
      { text: "site_groundwater.site", value: "site" },
      // { text: "loan.borrower", value: "borrower" },
      // { text: "loan.project", value: "project" },
      // { text: "loan.date_start", value: "date_start" },
      // { text: "loan.date_end", value: "date_end" },
      // { text: "loan.returned", value: "returned", align: "center" },
      // { text: "loan.database", value: "database", align: "center" }
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
