<template>
  <v-data-table
    class="library-table"
    :headers="translatedHeaders"
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
  >
    <template v-slot:item.library="{ item }">
      <router-link
        :to="{ path: '/library/' + item.library }"
        :title="$t('editLibrary.editMessage')"
        class="sarv-link"
      >
        {{ item.library }}
      </router-link>
    </template>

    <template v-slot:item.library__title="{ item }">
      <router-link
        :to="{ path: '/library/' + item.library }"
        :title="$t('editLibrary.editMessage')"
        class="sarv-link"
      >
        {{ item.library__title }}
      </router-link>
    </template>

    <template v-slot:item.library__is_private="{ item }">
      <v-checkbox
        hide-details
        class="mt-0"
        v-model="item.library__is_private"
        @change="
          $emit('toggle-privacy-state', item.library__is_private, item.library)
        "
      ></v-checkbox>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'library', id: item.library })"
        :title="$t('editLibrary.viewMessage')"
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
  name: "LibraryTable",
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
      { text: "library.id", value: "library" },
      { text: "library.title", value: "library__title" },
      { text: "library.author_txt", value: "agent__agent" },
      { text: "library.private", value: "library__is_private" },
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
.library-table.v-data-table td,
.library-table.v-data-table th {
  padding: 0 8px;
}
</style>
