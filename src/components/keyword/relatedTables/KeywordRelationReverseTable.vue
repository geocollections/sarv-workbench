<template>
  <div class="keyword-relation-reverse-table">
    <div class="title ml-2">{{ $t("keyword.information") }}:</div>
    <v-data-table
      mobile-breakpoint="0"
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      expand-icon="fas fa-caret-down"
      disable-sort
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :mobile-breakpoint="0"
      :class="bodyColor.split('n-')[0] + 'n-5'"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          icon
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
        <v-btn
          v-if="!$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.keyword_relation_type="{ item }">
        <div
          v-translate="{
            et: item.keyword_relation_type__reverse,
            en: item.keyword_relation_type__reverse_en,
          }"
        ></div>
      </template>

      <template v-slot:item.keyword="{ item }">
        <router-link
          v-if="$route.meta.isEdit"
          :to="{ path: '/keyword/' + item.keyword }"
          :title="$t('editKeyword.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.keyword__keyword }}
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "KeywordRelationReverseTable",

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

  data: () => ({
    headers: [
      {
        text: "keyword.keyword_relation_type_reverse",
        value: "keyword_relation_type",
      },
      { text: "keyword.keyword", value: "keyword" },
    ],
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },
  },
};
</script>

<style scoped></style>
