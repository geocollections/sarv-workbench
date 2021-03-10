<template>
  <v-data-table
    :headers="$_tableHeaderMixin_shownHeaders"
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
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.drillcore="{ item }">
      <router-link
        :to="{ path: '/drillcore/' + item.drillcore }"
        :title="$t('editDrillcore.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.drillcore__drillcore,
            en: item.drillcore__drillcore_en
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/drillcore_box/' + item.id }"
        :title="$t('editDrillcoreBox.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.number }}
      </router-link>
    </template>

    <template v-slot:item.stratigraphy_base="{ item }">
      <router-link
        v-if="item.stratigraphy_base"
        :to="{ path: '/stratigraphy/' + item.stratigraphy_base }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.stratigraphy_base__stratigraphy,
            en: item.stratigraphy_base__stratigraphy_en
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.stratigraphy_top="{ item }">
      <router-link
        v-if="item.stratigraphy_top"
        :to="{ path: '/stratigraphy/' + item.stratigraphy_top }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.stratigraphy_top__stratigraphy,
            en: item.stratigraphy_top__stratigraphy_en
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        :href="getEmaUrl({ object: 'corebox', id: item.id })"
        :title="$t('editDrillcoreBox.viewMessage')"
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
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "DrillcoreBoxTable",
  mixins: [tableHeaderMixin],

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
