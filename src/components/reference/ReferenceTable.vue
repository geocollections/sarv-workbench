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
    expand-icon="fas fa-caret-down"
    :sort-by="searchParameters.sortBy"
    :sort-desc="searchParameters.sortDesc"
    :show-select="!!activeLibrary"
    @item-selected="$emit('toggle-reference-in-active-library', $event)"
    @toggle-select-all="$emit('toggle-select-all', $event, 'reference')"
    :value="selected"
    @update:sort-by="$emit('update:sorting', { value: $event, key: 'sortBy' })"
    @update:sort-desc="
      $emit('update:sorting', { value: $event, key: 'sortDesc' })
    "
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

    <template v-slot:item.journal__journal_name="{ item }">
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
        :href="getGeoloogiaUrl(item.id)"
        :title="$t('editReference.viewMessageGeology')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
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
  </v-data-table>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableViewMixin from "@/mixins/tableViewMixin";

export default {
  name: "ReferenceTable",
  mixins: [activeListMixin, tableViewMixin],
  props: {
    response: {
      type: Object,
    },
    filter: {
      type: String,
      required: false,
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function () {
        return {
          page: 1,
          paginateBy: 25,
        };
      },
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
  },

  methods: {
    getGeoloogiaUrl(id) {
      return `https://kirjandus.geoloogia.info/reference/${id}`;
    },

    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
    },

    getFileUrl(uuid) {
      return `${this.$constants.IMAGE_URL}${uuid.substring(
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
    },
  },
};
</script>
