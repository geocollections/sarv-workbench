<template>
  <v-data-table
    class="reference-table"
    :headers="translatedHeaders"
    dense
    hide-default-footer
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
    <template v-slot:header.is_estonian_author="{ item }">
      <span> EE <v-icon x-small>fas fa-user</v-icon> </span>
    </template>

    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/reference/' + item.id }"
        :title="$t('editReference.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.journal="{ item }">
      <router-link
        :to="{ path: '/journal/' + item.journal }"
        :title="$t('editJournal.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.journal"
      >
        <span v-if="item.journal__journal_name">{{
          item.journal__journal_name
        }}</span>
        <span v-else-if="item.journal_name">{{ item.journal_name }}</span>
      </router-link>
    </template>

    <template v-slot:item.is_estonian_reference="{ item }">
      <v-icon v-if="item.is_estonian_reference" small>fas fa-check</v-icon>
    </template>

    <template v-slot:item.is_estonian_author="{ item }">
      <v-icon v-if="item.is_estonian_author" small>fas fa-check</v-icon>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'reference', id: item.id })"
        :title="$t('editReference.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.doi="{ item }">
      <a
        v-if="item.doi"
        :href="getDoiUrl(item.doi)"
        :title="getDoiUrl(item.doi)"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        target="DoiWindow"
        >DOI</a
      >
    </template>

    <template v-slot:item.attachment__filename="{ item }">
      <v-btn
        v-if="item.attachment__filename"
        :href="getFileUrl(item.attachment__filename)"
        :title="getFileUrl(item.attachment__filename)"
        :color="bodyActiveColor"
        target="FileWindow"
        icon
      >
        <v-icon>far fa-file-pdf</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.url="{ item }">
      <v-btn
        v-if="item.url && getUrl(item.url)"
        :href="getUrl(item.url)"
        :title="getUrl(item.url)"
        :color="bodyActiveColor"
        target="UrlWindow"
        rel="noopener noreferrer"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.library="{ item }">
      <v-btn
        v-if="isLibraryActive"
        @click="$emit('add-reference-to-active-library', item.id)"
        :title="$t('reference.addReferenceToLibrary')"
        color="green"
        icon
      >
        <v-icon>far fa-plus-square</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "ReferenceTable",
  props: {
    response: {
      type: Object
    },
    isLibraryActive: {
      type: Boolean
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
      { text: "reference.id", value: "id" },
      { text: "reference.author", value: "author" },
      { text: "reference.year", value: "year" },
      { text: "reference.title", value: "title" },
      { text: "reference.journal", value: "journal" },
      { text: "reference.volume", value: "volume" },
      { text: "reference.pages_short", value: "pages" },
      {
        text: "reference.is_estonian_reference_short",
        value: "is_estonian_reference"
      },
      {
        text: "reference.is_estonian_author_short",
        value: "is_estonian_author"
      },
      { text: "", value: "link", sortable: false },
      { text: "reference.doi", value: "doi" },
      { text: "reference.pdf", value: "attachment__filename" },
      { text: "reference.url", value: "url" },
      { text: "reference.library_short", value: "library", sortable: false }
    ]
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
          if (this.isLibraryActive) return item;
          else if (item.value !== "library") return item;
        });
    }
  },
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },

    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
    },

    getFileUrl(uuid) {
      return `https://files.geocollections.info/${uuid.substring(
        0,
        2
      )}/${uuid.substring(2, 4)}/${uuid}`;
    },

    getUrl(url) {
      if (url.startsWith("http")) return url;
      else if (url.startsWith("www.")) return "http://" + url;
      else if (url.includes("www."))
        return "http://" + url.substring(url.indexOf("www."));
      else return false;
    }
  }
};
</script>

<style>
.reference-table.v-data-table td,
.reference-table.v-data-table th {
  padding: 0 8px;
}
</style>
