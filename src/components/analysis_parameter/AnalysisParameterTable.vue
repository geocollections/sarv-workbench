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
        :to="{ path: '/analysis_parameter/' + item.id }"
        :title="$t('editAnalysisParameter.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.parameter_html="{ item }">
      <span v-html="item.parameter_html"></span>
    </template>
    <template v-slot:item.parameter_name="{ item }">
      <span
        v-translate="{ et: item.parameter_name, en: item.parameter_name_en }"
      ></span>
    </template>

    <template v-slot:item.synonyms="{ item }">
      {{ item.synonyms }}
    </template>
    <template v-slot:item.parent_parameter="{ item }">
      <span
        v-translate="{
          et: item.parent_parameter__parameter_name,
          en: item.parent_parameter__parameter_name_en,
        }"
      ></span>
    </template>
  </table-wrapper>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "AnalysisParameterTable",
  components: { TableWrapper },
  mixins: [activeListMixin, tableViewMixin],
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
};
</script>
