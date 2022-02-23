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
          en: item.project_type__name_en,
        }"
      ></span>
    </template>

    <template v-slot:item.date_start="{ item }">
      <span>{{ item.date_start | moment("YYYY-DD-MM HH:mm") }}</span>
    </template>

    <template v-slot:item.date_end="{ item }">
      <span>{{ item.date_end | moment("YYYY-DD-MM HH:mm") }}</span>
    </template>
  </table-wrapper>
</template>

<script>
import moment from "moment";
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "ProjectTable",
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
          itemsPerPage: 25,
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
    names: [],
  }),
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },
  },
};
</script>
