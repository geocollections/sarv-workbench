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
        :to="{ path: '/specimen/' + item.id }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>
    <template v-slot:item.identification="{ item }">
      <div
        v-if="
          item.specimen_identification &&
          item.specimen_identification.length > 0
        "
      >
        <ul class="pl-0" style="list-style-type: none">
          <li
            v-for="(item, index) in item.specimen_identification"
            :key="index"
          >
            <router-link
              :to="{ path: `/taxon/${item.taxon.id}` }"
              class="sarv-link"
              :class="`${bodyActiveColor}--text`"
              >{{ item.name || item.taxon.taxon }}</router-link
            >
            <v-icon v-if="item.current" color="green" x-small right
              >fas fa-check</v-icon
            >
            <v-icon v-else color="red" x-small right>fas fa-times</v-icon>
          </li>
        </ul>
      </div>
      <div
        v-else-if="
          item.specimen_identification_geology &&
          item.specimen_identification_geology.length > 0
        "
      >
        <ul class="pl-0" style="list-style-type: none">
          <li
            v-for="(item, index) in item.specimen_identification_geology"
            :key="index"
          >
            <router-link
              :to="{ path: `/rock/${item.rock.id}` }"
              class="sarv-link"
              :class="`${bodyActiveColor}--text`"
              ><span
                v-translate="{
                  et: item.rock.name,
                  en: item.rock.name_en,
                }"
              ></span>
            </router-link>
            <span
              class="ml-1"
              v-if="item.rock.formula_html"
              v-html="item.rock.formula_html"
            />
            <v-icon v-if="item.current" color="green" x-small right
              >fas fa-check</v-icon
            >
            <v-icon v-else color="red" x-small right>fas fa-times</v-icon>
          </li>
        </ul>
      </div>
    </template>
    <template v-slot:item.locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality.id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.locality"
      >
        <span
          v-translate="{
            et: item.locality.locality,
            en: item.locality.locality_en,
          }"
        />
      </router-link>
    </template>
    <template v-slot:item.depth="{ item }">
      <span v-if="item.depth && item.depth_interval"
        >{{ item.depth }} ... {{ item.depth_interval }} m</span
      >
      <span v-else>{{ item.depth }}</span>
    </template>
    <template v-slot:item.stratigraphy="{ item }">
      <div>
        <span
          v-translate="{
            et: item.stratigraphy.stratigraphy,
            en: item.stratigraphy.stratigraphy_en,
          }"
        />
        <span v-if="item.stratigraphy && item.lithostratigraphy"> | </span>
        <span
          v-translate="{
            et: item.lithostratigraphy.stratigraphy,
            en: item.lithostratigraphy.stratigraphy_en,
          }"
        />
      </div>
    </template>
    <template v-slot:item.storage="{ item }">
      <router-link
        :to="{ path: '/location/' + item.storage.id }"
        :title="$t('editLocation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.storage"
      >
        <span
          v-translate="{
            et: item.storage.location,
            en: item.storage.location,
          }"
        />
      </router-link>
    </template>
    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'specimen', id: item.id })"
        :title="$t('editSpecimen.viewMessage')"
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
  name: "SpecimenTable",
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
      default: () => {},
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
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },

    getTaxonUrl(id) {
      return "https://fossiilid.info/" + id;
    },

    getRockUrl(id) {
      return "https://kivid.info/" + id;
    },
  },
};
</script>
