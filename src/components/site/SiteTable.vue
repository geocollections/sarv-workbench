<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
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
  </table-wrapper>
</template>

<script>
import moment from "moment";
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "SiteTable",
  components: { TableWrapper },
  mixins: [tableViewMixin],
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
    headers: {
      type: Array,
      required: true,
      default: () => [],
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
