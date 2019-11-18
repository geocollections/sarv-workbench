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
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/project/' + item.id }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.name="{ item }">
      <router-link
        :to="{ path: '/project/' + item.id }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
      >
        {{ item.name }}
      </router-link>
    </template>

    <template v-slot:item.project_type__name="{ item }">
      <span
        v-translate="{
          et: item.project_type__name,
          en: item.project_type__name_en
        }"
      ></span>
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
  name: "ProjectTable",
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
      { text: "project.id", value: "id" },
      { text: "project.name", value: "name" },
      { text: "project.project_type", value: "project_type__name" },
      { text: "project.date_start", value: "date_start" },
      { text: "project.date_end", value: "date_end" },
      { text: "project.date_free", value: "date_free" },
      { text: "project.owner", value: "owner__agent" }
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
.project-table.v-data-table td,
.project-table.v-data-table th {
  padding: 0 8px;
}
</style>
