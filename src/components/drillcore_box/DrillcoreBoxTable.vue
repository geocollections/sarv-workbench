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
    <template v-slot:item.drillcore="{ item }">
      <router-link
        v-if="item.drillcore"
        :to="{ path: '/drillcore/' + item.drillcore.id }"
        :title="$t('editDrillcore.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.drillcore.drillcore,
            en: item.drillcore.drillcore_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/drillcore_box/' + item.id }"
        :title="$t('editDrillcoreBox.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        {{ item.number }}
      </router-link>
    </template>

    <template v-slot:item.stratigraphy_base="{ item }">
      <router-link
        v-if="item.stratigraphy_base"
        :to="{ path: '/stratigraphy/' + item.stratigraphy_base }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.stratigraphy_base__stratigraphy,
            en: item.stratigraphy_base__stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.stratigraphy_top="{ item }">
      <router-link
        v-if="item.stratigraphy_top"
        :to="{ path: '/stratigraphy/' + item.stratigraphy_top }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.stratigraphy_top__stratigraphy,
            en: item.stratigraphy_top__stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        :href="getEmaUrl({ object: 'corebox', id: item.id })"
        :title="$t('editDrillcoreBox.viewMessage')"
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
import tableViewMixin from "@/mixins/tableViewMixin";
import TableWrapper from "@/components/tables/TableWrapper";

export default {
  name: "DrillcoreBoxTable",
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

  methods: {
    getEmaUrl(params) {
      return `https://geoloogia.info/${params.object}/${params.id}`;
    },
  },
};
</script>
