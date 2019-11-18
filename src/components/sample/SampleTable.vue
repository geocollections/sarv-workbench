<template>
  <v-data-table
    class="sample-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="isSelectionSeriesActive"
    @item-selected="$emit('add-item-to-selection-series', $event, 'sample')"
    @toggle-select-all="$emit('toggle-select-all', $event, 'sample')"
    expand-icon="fas fa-caret-down"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
  >
    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/sample/' + item.id }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
      >
        <span v-if="item.number">{{ item.number }}</span>
        <span v-else>{{ item.id }}</span>
      </router-link>
    </template>

    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality }"
        :title="$t('editLocality.viewMessage')"
        v-if="item.locality__locality || item.locality__locality_en"
        class="sarv-link"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en
          }"
        ></span>
      </router-link>

      <span v-else-if="item.locality_free">{{ item.locality_free }}</span>

      <span v-else-if="item.site__name">{{ item.site__name }}</span>
    </template>

    <template v-slot:item.locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality_id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        v-if="item.locality_id"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.depth="{ item }">
      <span v-if="item.depth && item.depth_interval"
        >{{ item.depth }} - {{ item.depth_interval }} m</span
      >
      <span v-else>{{ item.depth }}</span>
    </template>

    <template v-slot:item.stratigraphy__stratigraphy="{ item }">
      <div>
        <span
          v-translate="{
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en
          }"
        ></span>
      </div>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'sample', id: item.id })"
        :title="$t('editSample.viewMessage')"
        color="deep-orange"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.selection_series="{ item }">
      <v-btn
        v-if="isSelectionSeriesActive"
        @click="$emit('add-item-to-selection-series', item.id, 'sample')"
        title="Add sample to selection series"
        color="green"
        icon
      >
        <v-icon>fas fa-plus-square</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SampleTable",
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
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "sample.numberSlashId", value: "number" },
      { text: "sample.id", value: "id" },
      { text: "sample.locality", value: "locality" },
      { text: "sample.depth", value: "depth" },
      { text: "sample.stratigraphy", value: "stratigraphy" },
      { text: "sample.agent_collected", value: "agent_collected__agent" },
      { text: "sample.storage", value: "storage__location" },
      { text: "", value: "link", sortable: false },
      { text: "", value: "selection_series", sortable: false }
    ],
    names: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers
        .map(header => {
          return {
            ...header,
            text: this.$t(header.text)
          };
        })
        .filter(item => {
          if (this.isSelectionSeriesActive) return item;
          else if (item.value !== "selection_series") return item;
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

<style scoped></style>
