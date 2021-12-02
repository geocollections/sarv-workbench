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

    <template v-slot:item.locality__id="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality }"
        :title="$t('editLocality.viewMessage')"
        v-if="item.locality__locality || item.locality__locality_en"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en,
          }"
        />
      </router-link>

      <span v-else-if="item.locality_free">{{ item.locality_free }}</span>

      <span v-else-if="item.site">
        <router-link
          :to="{ path: '/site/' + item.site }"
          :title="$t('editSite.viewMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-if="item.site__name || item.site__name_en"
            v-translate="{
              et: item.site__name,
              en: item.site__name_en,
            }"
          />
          <span v-else>{{ item.site }}</span>
        </router-link>
      </span>
    </template>

    <template v-slot:item.locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.locality"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.depth="{ item }">
      <span v-if="item.depth && item.depth_interval"
        >{{ item.depth }} - {{ item.depth_interval }} m</span
      >
      <span v-else>{{ item.depth }}</span>
    </template>

    <template v-slot:item.stratigraphy__id="{ item }">
      <router-link
        :to="{ path: '/stratigraphy/' + item.stratigraphy }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.stratigraphy"
      >
        <span
          v-translate="{
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.lithostratigraphy__id="{ item }">
      <router-link
        :to="{ path: '/stratigraphy/' + item.lithostratigraphy }"
        :title="$t('editStratigraphy.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.lithostratigraphy"
      >
        <span
          v-translate="{
            et: item.lithostratigraphy__stratigraphy,
            en: item.lithostratigraphy__stratigraphy_en,
          }"
        />
      </router-link>
    </template>

    <template v-slot:item.storage__location="{ item }">
      <router-link
        :to="{ path: '/location/' + item.storage }"
        :title="$t('editLocation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.storage"
      >
        <span
          v-translate="{
            et: item.storage__location,
            en: item.storage__location,
          }"
        />
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
