<template>
  <v-data-table
    class="dataset-table"
    :headers="translatedHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
    :sort-by.sync="searchParameters.sortBy"
    :sort-desc.sync="searchParameters.sortDesc"
    :server-items-length="response.count"
    :class="bodyColor.split('n-')[0] + 'n-5'"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/dataset/' + item.id }"
        :title="$t('editDataset.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.name="{ item }">
      <router-link
        :to="{ path: '/dataset/' + item.id }"
        :title="$t('editDataset.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span v-translate="{ et: item.name, en: item.name_en }"></span>
      </router-link>
    </template>

    <template v-slot:item.date="{ item }">
      <span v-if="item.date">{{ item.date }}</span>
      <span v-else>{{ item.date_txt }}</span>
    </template>

    <template v-slot:item.owner="{ item }">
      <router-link
        :to="{ path: '/agent/' + item.owner }"
        :title="$t('editAgent.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.owner"
      >
        {{ item.owner__agent }}
      </router-link>
      <span v-else>{{ item.owner_txt }}</span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'dataset', id: item.id })"
        :title="$t('editDataset.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "DatasetTable",
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
      { text: "dataset.id", value: "id" },
      { text: "dataset.name", value: "name" },
      { text: "dataset.date", value: "date" },
      { text: "dataset.owner", value: "owner" },
      { text: "dataset.database", value: "database__acronym" },
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
.dataset-table.v-data-table td,
.dataset-table.v-data-table th {
  padding: 0 8px;
}
</style>
