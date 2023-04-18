<template>
  <v-data-table
    mobile-breakpoint="0"
    :headers="$_tableHeaderMixin_shownHeaders"
    dense
    hide-default-footer
    :items="response.results"
    :items-per-page="searchParameters.paginateBy"
    multi-sort
    :page="searchParameters.page"
    :search="filter"
    :show-select="!!activeSelectionSeries"
    @item-selected="
      $emit('toggle-item-in-selection-series', $event, 'specimen')
    "
    @toggle-select-all="$emit('toggle-select-all', $event, 'specimen')"
    expand-icon="fas fa-caret-down"
    :value="selected"
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
        :to="{ path: '/specimen/' + item.id }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        >{{ item.id }}</router-link
      >
    </template>

    <template v-slot:item.name="{ item }">
      <div
        v-if="
          names &&
          names.length > 0 &&
          names.find((specimen) => specimen.id === item.id)
        "
      >
        <div v-if="names.find((specimen) => specimen.id === item.id).taxonId">
          <i
            v-translate="{
              et: names.find((specimen) => specimen.id === item.id).name,
              en: names.find((specimen) => specimen.id === item.id).name_en,
            }"
          />
        </div>

        <div
          v-else-if="names.find((specimen) => specimen.id === item.id).rockId"
        >
          <i
            v-translate="{
              et: names.find((specimen) => specimen.id === item.id).name,
              en: names.find((specimen) => specimen.id === item.id).name_en,
            }"
          />
        </div>

        <i
          v-else
          v-translate="{
            et: names.find((specimen) => specimen.id === item.id).name,
            en: names.find((specimen) => specimen.id === item.id).name_en,
          }"
        />
      </div>
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

    <template v-slot:item.stratigraphy__stratigraphy="{ item }">
      <div>
        <span
          v-translate="{
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en,
          }"
        />
        <span v-if="item.stratigraphy && item.lithostratigraphy"> | </span>
        <span
          v-translate="{
            et: item.lithostratigraphy__stratigraphy,
            en: item.lithostratigraphy__stratigraphy_en,
          }"
        />
      </div>
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
        :href="getGeoDetailUrl({ object: 'specimen', id: item.id })"
        :title="$t('editSpecimen.viewMessage')"
        :color="bodyActiveColor"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {
  fetchSpecimenIdentificationGeologiesList,
  fetchSpecimenIdentificationsList,
} from "../../assets/js/api/apiCalls";
import { mapState } from "vuex";
import activeListMixin from "../../mixins/activeListMixin";
import tableHeaderMixin from "@/mixins/tableHeaderMixin";

export default {
  name: "SpecimenTable",
  mixins: [activeListMixin, tableHeaderMixin],
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
    names: [],
  }),
  watch: {
    "response.results": {
      handler(newVal) {
        this.getNames(newVal);
      },
      immediate: true,
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

    async getNames(listOfSpecimens) {
      if (listOfSpecimens && listOfSpecimens.length > 0) {
        let listOfIds = listOfSpecimens.map((specimen) => specimen.id);

        const taxonResponse = await fetchSpecimenIdentificationsList(listOfIds);
        const rockResponse = await fetchSpecimenIdentificationGeologiesList(
          listOfIds
        );

        if (taxonResponse.status === 200 && rockResponse.status === 200) {
          let taxonList = [];
          let rockList = [];

          if (taxonResponse.data.count > 0) {
            taxonList = taxonResponse.data.results.map((entity) => {
              return {
                id: entity.specimen_id,
                name: entity.taxon__taxon ? entity.taxon__taxon : entity.name,
                name_en: entity.taxon__taxon
                  ? entity.taxon__taxon
                  : entity.name,
                taxonId: entity.taxon,
              };
            });
          }

          if (rockResponse.data.count > 0) {
            rockList = rockResponse.data.results.map((entity) => {
              let name = "";
              let name_en = "";

              if (entity.rock__name && !entity.name) name = entity.rock__name;
              else if (
                entity.rock__name &&
                entity.name &&
                entity.rock__name !== entity.name
              )
                name = entity.name + " | " + entity.rock__name;
              else name = entity.name;

              if (entity.rock__name_en && !entity.name_en)
                name_en = entity.rock__name_en;
              else if (
                entity.rock__name_en &&
                entity.name_en &&
                entity.rock__name_en !== entity.name_en
              )
                name_en = entity.name_en + " | " + entity.rock__name_en;
              else name_en = entity.name_en;

              if (entity.rock__formula_html) {
                name += " | " + entity.rock__formula_html;
                name_en += " | " + entity.rock__formula_html;
              }

              return {
                id: entity.specimen_id,
                name: name,
                name_en: name_en,
                rockId: entity.rock,
              };
            });
          }

          if (taxonList.length > 0 && rockList.length > 0) {
            rockList.forEach((rock) => {
              let item = taxonList.find((taxon) => rock.id === taxon.id);
              item ? this.names.push(item) : this.names.push(rock);
            });

            taxonList.forEach((taxonItem) => {
              let secondItem = rockList.find(
                (rockItem) => taxonItem.id === rockItem.id
              );
              secondItem
                ? this.names.push(secondItem)
                : this.names.push(taxonItem);
            });
            // console.log(this.names);
          } else if (taxonList.length > 0) this.names = taxonList;
          else if (rockList.length > 0) this.names = rockList;
        }
      }
    },
  },
};
</script>
