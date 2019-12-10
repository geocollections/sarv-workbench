<template>
  <v-data-table
    class="project-table"
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
        :to="{ path: '/doi/' + item.id }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.datacite_created="{ item }">
      <span>{{ parseDate(item.datacite_created) }}</span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getSarvDoiUrl(item.identifier)"
        :title="$t('editDoi.viewMessage')"
        :color="bodyActiveColor"
        target="DoiWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";

export default {
  name: "DoiTable",
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
      { text: "doi.identifier", value: "id" },
      { text: "doi.creators", value: "creators" },
      { text: "doi.year", value: "publication_year" },
      { text: "doi.title", value: "title" },
      { text: "doi.resource_type", value: "resource_type__value" },
      { text: "doi.datacite_created", value: "datacite_created" },
      { text: "", value: "link", sortable: false }
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
  },
  methods: {
    getSarvDoiUrl(doiIdentifier) {
      if (doiIdentifier)
        return "https://doi.geocollections.info/" + doiIdentifier;
    },

    parseDate(date) {
      if (date) {
        return moment(String(date)).format("DD.MM.YYYY HH:mm");
      }
    }
  }
};
</script>

<style>
.doi-table.v-data-table td,
.doi-table.v-data-table th {
  padding: 0 8px;
}
</style>
