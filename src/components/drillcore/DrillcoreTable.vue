<template>
  <v-data-table
    class="drillcore-table"
    :headers="$_tableHeaderMixin_shownHeaders"
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
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/drillcore/' + item.id }"
        :title="$t('editDrillcore.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.drillcore="{ item }">
      <router-link
        :to="{ path: '/drillcore/' + item.id }"
        :title="$t('editDrillcore.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.drillcore,
            en: item.drillcore_en
          }"
        ></span>
      </router-link>
    </template>

    <template v-slot:item.depth="{ item }">
      <div v-if="item.depth">{{ item.depth }}</div>
      <div v-else>{{ item.locality__depth }}</div>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'drillcore', id: item.id })"
        :title="$t('editDrillcore.viewMessage')"
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
  name: "DrillcoreTable",
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
  data: () => ({
    headers: [
      { text: "common.id", value: "id" },
      { text: "drillcore.drillcore", value: "drillcore" },
      { text: "common.depth", value: "depth" },
      { text: "drillcore.boxes", value: "boxes" },
      { text: "drillcore.box_numbers", value: "box_numbers" },
      { text: "drillcore.location", value: "location" },
      { text: "common.year", value: "year" },
      { text: "drillcore.agent", value: "agent__agent" },
      { text: "common.remarks", value: "remarks" },
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
.drillcore-table.v-data-table td,
.drillcore-table.v-data-table th {
  padding: 0 8px;
}
</style>
