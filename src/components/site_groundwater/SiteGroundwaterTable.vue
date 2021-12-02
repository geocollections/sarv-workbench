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
        :to="{ path: '/site/' + item.site.id }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.site.id }}
      </router-link>
    </template>

    <template v-slot:item.site="{ item }">
      <router-link
        :to="{ path: '/site/' + item.site }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <div
          v-translate="{ et: item.site__name, en: item.site__name_en }"
        ></div>
      </router-link>
    </template>

    <template v-slot:item.url_veka="{ item }">
      <v-btn
        v-if="item.url_veka"
        :href="item.url_veka"
        :title="$t('editSiteGroundwater.viewMessage')"
        :color="bodyActiveColor"
        target="VekaWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </table-wrapper>
</template>

<script>
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "SiteGroundwaterTable",
  components: { TableWrapper },
  mixins: [tableViewMixin],
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
};
</script>
