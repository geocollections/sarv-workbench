<template>
  <v-data-table
    class="analysis-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="!!activeSelectionSeries"
    @item-selected="$emit('toggle-item-in-selection-series', $event, 'locality')"
    @toggle-select-all="$emit('toggle-select-all', $event, 'locality')"
    expand-icon="fas fa-caret-down"
    :value="selected"
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
        :to="{ path: '/locality/' + item.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.id"
      >
        <span v-translate="{ et: item.locality, en: item.locality_en }"></span>
      </router-link>
    </template>

    <template v-slot:item.country__value="{ item }">
      <span
        v-translate="{
          et: item.country__value,
          en: item.country__value_en
        }"
      ></span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'locality', id: item.id })"
        :title="$t('editLocality.viewMessage')"
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
import activeListMixin from "../../mixins/activeListMixin";

export default {
  name: "LocalityTable",
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
  mixins: [activeListMixin],
  data: () => ({
    headers: [
      { text: "common.id", value: "id" },
      { text: "locality.locality", value: "locality" },
      { text: "locality.number", value: "number" },
      { text: "locality.country", value: "country__value" },
      { text: "locality.agent", value: "user_added" },
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

<style>
.locality-table.v-data-table td,
.locality-table.v-data-table th {
  padding: 0 8px;
}
</style>
