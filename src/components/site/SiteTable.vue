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
        :to="{ path: '/site/' + item.id }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.project="{ item }">
      <router-link
        :to="{ path: '/project/' + item.project }"
        :title="$t('editProject.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.project"
      >
        <span
          v-translate="{ et: item.project__name, en: item.project__name_en }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.date_start="{ item }">
      <span>{{
        unformatISOStringToDate(item.date_start, "YYYY-MM-DD HH:mm")
      }}</span>
    </template>

    <template v-slot:item.date_end="{ item }">
      <span>{{
        unformatISOStringToDate(item.date_end, "YYYY-MM-DD HH:mm")
      }}</span>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "SiteTable",
  mixins: [tableHeaderMixin],
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
  data: () => ({
    expanded: [],
    headers: [
      { text: "common.id", value: "id" },
      { text: "common.name", value: "name" },
      { text: "site.number", value: "number" },
      { text: "site.project", value: "project" },
      { text: "common.date_start", value: "date_start" },
      { text: "common.date_end", value: "date_end" },
    ],
    names: [],
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },
  },
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },

    unformatISOStringToDate(date, format = "YYYY-MM-DD HH:mm:ss") {
      if (typeof date !== "undefined" && date !== null) {
        let datePart = date.split("T")[0];
        let timePart = date.split("T")[1].slice(0, -1);

        return moment(datePart + " " + timePart).format(format);
      } else return null;
    },
  },
};
</script>
