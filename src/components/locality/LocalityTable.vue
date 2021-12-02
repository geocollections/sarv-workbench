<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>

    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.id"
      >
        <span v-translate="{ et: item.locality, en: item.locality_en }"></span>
      </router-link>
    </template>

    <template v-slot:item.country__value="{ item }">
      <span
        v-translate="{
          et: item.country__value,
          en: item.country__value_en,
        }"
      ></span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getEmaUrl({ object: 'locality', id: item.id })"
        :title="$t('editLocality.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
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

export default {
  name: "LocalityTable",
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
  methods: {
    getEmaUrl(params) {
      return `https://geoloogia.info/${params.object}/${params.id}`;
    },
  },
};
</script>
