<template>
  <v-data-table
    class="site-table"
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
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/site/' + item.id }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.name="{ item }">
      <span v-translate="{ et: item.name, en: item.name_en }"></span>
    </template>

    <template v-slot:item.project="{ item }">
      <router-link
        :to="{ path: '/project/' + item.project }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
        v-if="item.project"
      >
        <span
          v-translate="{ et: item.project__name, en: item.project__name_en }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.date_start="{ item }">
      <span>{{ parseDate(item.date_start) }}</span>
    </template>

    <template v-slot:item.date_end="{ item }">
      <span>{{ parseDate(item.date_end) }}</span>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";

export default {
  name: "SiteTable",
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
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "site.id", value: "id" },
      { text: "site.name", value: "name" },
      { text: "site.number", value: "number" },
      { text: "site.project", value: "project" },
      { text: "site.date_start", value: "date_start" },
      { text: "site.date_end", value: "date_end" }
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
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
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
.site-table.v-data-table td,
.site-table.v-data-table th {
  padding: 0 8px;
}
</style>
