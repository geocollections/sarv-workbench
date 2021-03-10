<template>
  <v-data-table
    :headers="$_tableHeaderMixin_shownHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="!!activeSelectionSeries"
    @item-selected="
      $emit('toggle-item-in-selection-series', $event, 'analysis')
    "
    @toggle-select-all="$emit('toggle-select-all', $event, 'analysis')"
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
        :to="{ path: '/analysis/' + item.id }"
        :title="$t('editAnalysis.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.sample="{ item }">
      <router-link
        :to="{ path: '/sample/' + item.sample }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.sample }}
      </router-link>
    </template>

    <template v-slot:item.sample__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.sample__locality }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.sample__locality"
      >
        <span
          v-translate="{
            et: item.sample__locality__locality,
            en: item.sample__locality__locality_en
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getEmaUrl({ object: 'analysis', id: item.id })"
        :title="$t('editAnalysis.viewMessage')"
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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "AnalysisTable",
  mixins: [activeListMixin, tableHeaderMixin],
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
  methods: {
    getEmaUrl(params) {
      return `https://ema.geoloogia.info/${params.object}/${params.id}`;
    }
  }
};
</script>
