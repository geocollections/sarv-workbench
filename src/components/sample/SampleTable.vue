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
    <template v-slot:item.number="{ item }">
      <router-link
        :to="{ path: '/sample/' + item.id }"
        :title="$t('editSample.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span v-if="item.number">{{ item.number }}</span>
        <span v-else>{{ item.id }}</span>
      </router-link>
    </template>

    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality.id }"
        :title="$t('editLocality.viewMessage')"
        v-if="item.locality"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.locality.locality,
            en: item.locality.locality_en,
          }"
        />
      </router-link>

      <span v-else-if="item.locality_free">{{ item.locality_free }}</span>

      <span v-else-if="item.site">
        <router-link
          :to="{ path: '/site/' + item.site.id }"
          :title="$t('editSite.viewMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.site.name,
              en: item.site.name_en,
            }"
          />
        </router-link>
      </span>
    </template>

    <template v-slot:item.depth="{ item }">
      <span v-if="item.depth && item.depth_interval"
        >{{ item.depth }} - {{ item.depth_interval }} m</span
      >
      <span v-else>{{ item.depth }}</span>
    </template>

    <template v-slot:item.stratigraphy="{ item }">
      <router-link
        :to="{ path: '/stratigraphy/' + item.stratigraphy.id }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.stratigraphy"
      >
        <span
          v-translate="{
            et: item.stratigraphy.stratigraphy,
            en: item.stratigraphy.stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.lithostratigraphy="{ item }">
      <router-link
        :to="{ path: '/stratigraphy/' + item.lithostratigraphy.id }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.lithostratigraphy"
      >
        <span
          v-translate="{
            et: item.lithostratigraphy.stratigraphy,
            en: item.lithostratigraphy.stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.storage="{ item }">
      <router-link
        :to="{ path: '/location/' + item.storage.id }"
        :title="$t('editLocation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.storage"
      >
        {{ item.storage.location }}
      </router-link>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getEmaUrl({ object: 'sample', id: item.id })"
        :title="$t('editSample.viewMessage')"
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
import { mapState } from "vuex";

export default {
  name: "SampleTable",
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
  methods: {
    getEmaUrl(params) {
      return `https://geoloogia.info/${params.object}/${params.id}`;
    },
  },
};
</script>
