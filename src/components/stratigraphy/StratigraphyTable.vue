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
        :to="{ path: '/stratigraphy/' + item.id }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.stratigraphy="{ item }">
      <router-link
        :to="{ path: '/stratigraphy/' + item.id }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{ et: item.stratigraphy, en: item.stratigraphy_en }"
        />
      </router-link>
    </template>

    <template v-slot:item.type="{ item }">
      <span v-translate="{ et: item.type__value, en: item.type__value_en }" />
    </template>

    <template v-slot:item.rank="{ item }">
      <span v-translate="{ et: item.rank__value, en: item.rank__value_en }" />
    </template>

    <template v-slot:item.scope="{ item }">
      <span v-translate="{ et: item.scope__value, en: item.scope__value_en }" />
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'stratigraphy', id: item.id })"
        :title="$t('editStratigraphy.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
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
  name: "StratigraphyTable",
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
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },
  },
};
</script>
