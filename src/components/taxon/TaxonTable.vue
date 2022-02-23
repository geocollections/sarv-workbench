<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="headers"
    :items="response.results"
    :count="response.count"
    :options="searchParameters"
    :show-search="false"
    :show-select="$_activeListMixin_isShowSelect"
    :value="selectedList"
    @change:headers="$emit('change:headers', $event)"
    @reset:headers="$emit('reset:headers')"
    @update:options="$emit('update:options', $event)"
    @item-selected="$_activeListMixin_itemSelected"
    @toggle-select-all="$_activeListMixin_toggleSelectAll"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.id }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.taxon }}</router-link
      >
    </template>

    <template v-slot:item.author_year="{ item }">
      <router-link
        v-if="item.reference && $route.meta.object !== 'reference'"
        :to="{ path: '/reference/' + item.reference }"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.author_year }}
      </router-link>
      <span v-else>{{ item.author_year }}</span>
    </template>

    <template v-slot:item.parent__taxon="{ item }">
      <router-link
        :to="{ path: '/taxon/' + item.parent }"
        :title="$t('editTaxon.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.parent__taxon }}</router-link
      >
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="`https://fossiilid.info/${item.id}`"
        :title="$t('editTaxon.viewMessage')"
        :color="bodyActiveColor"
        target="FossilsWindow"
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
  name: "TaxonTable",
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
          itemsPerPage: 25,
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
    ...mapState("search", ["activeSelectionSeries"]),
  },
};
</script>
