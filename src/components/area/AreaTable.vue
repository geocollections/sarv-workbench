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
    <template v-slot:item.name="{ item }">
      <router-link
        :to="{ path: '/area/' + item.id }"
        :title="$t('editArea.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.name,
            en: item.name_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.area_type="{ item }">
      <span
        v-translate="{
          et: item.area_type__name,
          en: item.area_type__name_en,
        }"
      />
    </template>

    <template v-slot:item.maakond="{ item }">
      <span
        v-translate="{
          et: item.maakond__maakond,
          en: item.maakond__maakond_en,
        }"
      />
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "AreaTable",
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
