<template>
  <v-data-table
    class="stratigraphy-table"
    :headers="translatedHeaders"
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
    @update:sort-desc="$emit('update:sorting', { value: $event, key: 'sortDesc' })"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
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
  </v-data-table>
</template>

<script>
export default {
  name: "StratigraphyTable",
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
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "common.type", value: "type" },
      { text: "stratigraphy.rank", value: "rank" },
      { text: "stratigraphy.scope", value: "scope" },
      { text: "", value: "link", sortable: false }
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

<style scoped>
.stratigraphy-table.v-data-table td,
.stratigraphy-table.v-data-table th {
  padding: 0 8px;
}
</style>
