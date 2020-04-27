<template>
  <v-data-table
    class="preparation-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="$emit('update:sorting', { value: $event, key: 'sortDesc' })"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/preparation/' + item.id }"
        :title="$t('editPreparation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.preparation_number="{ item }">
      <router-link
        :to="{ path: '/preparation/' + item.id }"
        :title="$t('editPreparation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.preparation_number }}
      </router-link>
    </template>

    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.sample__locality }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.sample__locality__locality,
            en: item.sample__locality__locality_en
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.stratigraphy="{ item }">
      <div
        v-translate="{
          et: item.sample__stratigraphy__stratigraphy,
          en: item.sample__stratigraphy__stratigraphy_en
        }"
      ></div>
    </template>

    <template v-slot:item.agent="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.agent }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.agent__agent }}
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'preparation', id: item.id })"
        :title="$t('editPreparation.viewMessage')"
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
  name: "PreparationTable",
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
    isSelectionSeriesActive: {
      type: Boolean
    },
    activeSelectionSeries: {
      type: Object
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
    headers: [
      { text: "common.id", value: "id" },
      { text: "preparation.preparation_number", value: "preparation_number" },
      { text: "preparation.sample__locality", value: "locality" },
      { text: "preparation.sample__stratigraphy", value: "stratigraphy" },
      { text: "preparation.agent", value: "agent" },
      { text: "", value: "link", sortable: false }
    ]
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
.preparation-table.v-data-table td,
.preparation-table.v-data-table th {
  padding: 0 8px;
}
</style>
