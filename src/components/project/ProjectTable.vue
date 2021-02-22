<template>
  <v-data-table
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
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/project/' + item.id }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.name="{ item }">
      <router-link
        :to="{ path: '/project/' + item.id }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
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
      <span>{{ item.date_start | moment("YYYY-DD-MM HH:mm") }}</span>
    </template>

    <template v-slot:item.date_end="{ item }">
      <span>{{ item.date_end | moment("YYYY-DD-MM HH:mm") }}</span>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "ProjectTable",
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
      { text: "common.id", value: "id" },
      { text: "common.name", value: "name" },
      { text: "common.type", value: "project_type__name" },
      { text: "common.date_start", value: "date_start" },
      { text: "common.date_end", value: "date_end" },
      { text: "common.date_txt", value: "date_free" },
      { text: "common.owner", value: "owner__agent" }
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
    }
  }
};
</script>
