<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
    hide-default-footer
    dense
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    expand-icon="fas fa-caret-down"
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
        :to="{ path: '/doi/' + item.id }"
        :title="$t('editSite.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.id }}
      </router-link>
    </template>
    @chenfengyuan/vue-qrcode@1
    <template v-slot:item.datacite_created="{ item }">
      <span v-if="$dayjs(item.datacite_created).isValid()">
        {{ $dayjs(item.datacite_created).format("YYYY-MM-DD HH:mm") }}
      </span>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getSarvDoiUrl(item.identifier)"
        :title="$t('editDoi.viewMessage')"
        :color="bodyActiveColor"
        target="DoiWindow"
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
  name: "DoiTable",
  mixins: [tableHeaderMixin],
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
  created() {
    console.log(this.$dayjs);
  },
  methods: {
    getSarvDoiUrl(doiIdentifier) {
      if (doiIdentifier)
        return "https://doi.geocollections.info/" + doiIdentifier;
    },
  },
};
</script>
