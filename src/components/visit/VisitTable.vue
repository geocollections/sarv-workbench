<template>
  <v-data-table
    class="visit-table"
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
        :to="{ path: '/visit/' + item.id }"
        :title="$t('editVisit.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.visitor="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.visitor }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.visitor__agent }}
      </router-link>
    </template>

    <template v-slot:item.visitor_country="{ item }">
      <span
        v-translate="{
          et: item.visitor_country__value,
          en: item.visitor_country__value_en
        }"
      ></span>
    </template>

    <template v-slot:item.host="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.host }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.host__agent }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AccessionTable",
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
      { text: "visit.visitor", value: "visitor" },
      { text: "visit.visitor_country", value: "visitor_country" },
      { text: "visit.date_arrived", value: "date_arrived" },
      { text: "visit.date_left", value: "date_left" },
      { text: "visit.host", value: "host" }
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
.visit-table.v-data-table td,
.visit-table.v-data-table th {
  padding: 0 8px;
}
</style>
