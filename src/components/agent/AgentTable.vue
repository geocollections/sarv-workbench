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
        :to="{ path: '/agent/' + item.id }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.institution_name="{ item }">
      <div
        v-translate="{
          et: item.institution_name,
          en: item.institution_name_en,
        }"
      ></div>
    </template>

    <template v-slot:item.institution="{ item }">
      <div
        v-if="item.institution"
        v-translate="{
          et: item.institution.institution_name,
          en: item.institution.institution_name_en,
        }"
      ></div>
    </template>

    <template v-slot:item.type="{ item }">
      <div
        v-if="item.type"
        v-translate="{
          et: item.type.value,
          en: item.type.value_en,
        }"
      ></div>
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "AgentTable",
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
};
</script>
