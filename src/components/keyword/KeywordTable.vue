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
        :to="{ path: '/keyword/' + item.id }"
        :title="$t('editKeyword.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.language__value="{ item }">
      <span
        v-translate="{
          et: item.language__value,
          en: item.language__value_en,
        }"
      ></span>
    </template>

    <template v-slot:item.is_primary="{ item }">
      <v-icon v-if="item.is_primary" small color="green">fas fa-check</v-icon>
      <v-icon v-else small color="red">fas fa-minus</v-icon>
    </template>

    <template v-slot:item.is_preferred="{ item }">
      <v-icon v-if="item.is_preferred" small color="green">fas fa-check</v-icon>
      <v-icon v-else small color="red">fas fa-minus</v-icon>
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "KeywordTable",
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
};
</script>
