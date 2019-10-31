<template>
  <v-data-table
    class="collection-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
  >
    <template v-slot:item.collection_id="{ item }">
      <router-link
        :to="{ path: '/collection/' + item.id }"
        :title="$t('editCollection.editMessage')"
        class="sarv-link"
        >{{ item.collection_id }}</router-link
      >
    </template>

    <template v-slot:item.name="{ item }">
      <span
        v-translate="{
          et: item.name,
          en: item.name_en
        }"
      ></span>
    </template>

    <template v-slot:item.name_long="{ item }">
      <span
        v-translate="{
          et: item.name_long,
          en: item.name_long_en
        }"
      ></span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'collection', id: item.id })"
        :title="$t('editCollection.viewMessage')"
        color="deep-orange"
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
  name: "CollectionTable",
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
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "collection.number", value: "collection_id" },
      { text: "collection.name", value: "name" },
      { text: "collection.name_long", value: "name_long" },
      { text: "collection.database", value: "database__acronym" },
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
.collection-table.v-data-table td,
.collection-table.v-data-table th {
  padding: 0 8px;
}
</style>