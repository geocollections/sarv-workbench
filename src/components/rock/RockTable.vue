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
        :to="{ path: '/rock/' + item.id }"
        :title="$t('editRock.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.formula_html="{ item }">
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else-if="item.formula">{{ item.formula }}</div>
    </template>

    <template v-slot:item.rock_type="{ item }">
      <div
        v-translate="{ et: item.rock_type__name, et: item.rock_type__name_en }"
      />
    </template>

    <template v-slot:item.rock_rank="{ item }">
      <div
        v-translate="{ et: item.rock_rank__name, et: item.rock_rank__name_en }"
      />
    </template>

    <template v-slot:item.in_estonia="{ item }">
      <v-icon v-if="item.in_estonia" color="green" small>fas fa-check</v-icon>
      <v-icon v-else color="red" small>fas fa-times</v-icon>
    </template>

    <template v-slot:item.in_portal="{ item }">
      <v-icon v-if="item.in_portal" color="green" small>fas fa-check</v-icon>
      <v-icon v-else color="red" small>fas fa-times</v-icon>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        :href="getRockUrl(item.id)"
        :title="getRockUrl(item.id)"
        :color="bodyActiveColor"
        target="RockWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.mindat_id="{ item }">
      <v-btn
        :href="getMindatUrl(item.mindat_id)"
        :title="getMindatUrl(item.mindat_id)"
        :color="bodyActiveColor"
        target="RockWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "RockTable",
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
  methods: {
    getRockUrl(id) {
      if (id) return `https://kivid.info/${id}`;
      else return null;
    },

    getMindatUrl(mindatId) {
      if (mindatId) return `https://www.mindat.org/min-${mindatId}.html`;
      else return null;
    },
  },
};
</script>
