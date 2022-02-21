<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    :show-select="!!activeLibrary"
    :value="selectedList"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
    @item-selected="itemSelected"
    @toggle-select-all="toggleSelectAll"
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
  </table-wrapper>
</template>

<script>
import activeListMixin from "../../mixins/activeListMixin";
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";
import { mapState } from "vuex";

export default {
  name: "ReferenceTable",
  components: { TableWrapper },
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
    headers: {
      type: Array,
      required: true,
      default: () => [],
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

  computed: {
    ...mapState("search", ["activeLibrary"]),
  },

  methods: {
    getGeoloogiaUrl(id) {
      return `https://kirjandus.geoloogia.info/reference/${id}`;
    },

    test(test) {
      console.log(test);
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
