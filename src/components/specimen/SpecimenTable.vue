<template>
  <v-data-table
    class="specimen-table"
    :headers="translatedHeaders"
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
            names.find(specimen => specimen.id === item.id)
        "
      >
        <div v-if="names.find(specimen => specimen.id === item.id).taxonId">
          <i
            v-translate="{
              et: names.find(specimen => specimen.id === item.id).name,
              en: names.find(specimen => specimen.id === item.id).name_en
            }"
          />
        </div>

        <div v-else-if="names.find(specimen => specimen.id === item.id).rockId">
          <i
            v-translate="{
              et: names.find(specimen => specimen.id === item.id).name,
              en: names.find(specimen => specimen.id === item.id).name_en
            }"
          />
        </div>

        <i
          v-else
          v-translate="{
            et: names.find(specimen => specimen.id === item.id).name,
            en: names.find(specimen => specimen.id === item.id).name_en
          }"
        />
      </div>
    </template>

    <template v-slot:item.locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality_id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.locality_id"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en
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
        <!--        <a-->
        <!--          v-if="item.stratigraphy_id"-->
        <!--          :href="-->
        <!--            getGeoDetailUrl({-->
        <!--              object: 'stratigraphy',-->
        <!--              id: item.stratigraphy_id-->
        <!--            })-->
        <!--          "-->
        <!--          :title="$t('editStratigraphy.viewMessage')"-->
        <!--          class="sarv-link"-->
        <!--          target="GeocollectionsWindow"-->
        <!--        >-->
        <span
          v-translate="{
            et: item.stratigraphy__stratigraphy,
            en: item.stratigraphy__stratigraphy_en
          }"
        />
        <!--        </a>-->
        <span v-if="item.stratigraphy_id && item.lithostratigraphy_id">
          |
        </span>
        <!--        <a-->
        <!--          v-if="item.lithostratigraphy_id"-->
        <!--          :href="-->
        <!--            getGeoDetailUrl({-->
        <!--              object: 'stratigraphy',-->
        <!--              id: item.lithostratigraphy_id-->
        <!--            })-->
        <!--          "-->
        <!--          :title="$t('editStratigraphy.viewMessage')"-->
        <!--          class="sarv-link"-->
        <!--          target="GeocollectionsWindow"-->
        <!--        >-->
        <span
          v-translate="{
            et: item.lithostratigraphy__stratigraphy,
            en: item.lithostratigraphy__stratigraphy_en
          }"
        />
        <!--        </a>-->
      </div>
    </template>

    <template v-slot:item.storage__location="{ item }">
      <router-link
        :to="{ path: '/location/' + item.storage__id }"
        :title="$t('editLocation.editMessage')"
        class="sarv-link"
        :class="`${bodyActiveColor}--text`"
        v-if="item.storage__id"
      >
        <span
          v-translate="{
            et: item.storage__location,
            en: item.storage__location
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
  fetchSpecimenIdentificationsList
} from "../../assets/js/api/apiCalls";
import { mapState } from "vuex";
import activeListMixin from "../../mixins/activeListMixin";

export default {
  name: "SpecimenTable",
  props: {
    response: {
      type: Object
    },
    filter: {
      type: String,
      required: false
    },
    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25
        };
      }
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },
  mixins: [activeListMixin],
  data: () => ({
    headers: [
      { text: "common.id", value: "id" },
      { text: "specimen.number", value: "specimen_id" },
      { text: "common.name", value: "name", sortable: false },
      { text: "specimen.locality", value: "locality__locality" },
      { text: "common.depth", value: "depth" },
      { text: "common.stratigraphy", value: "stratigraphy__stratigraphy" },
      { text: "specimen.agent_collected", value: "agent_collected__agent" },
      { text: "specimen.storage", value: "storage__location" },
      { text: "", value: "link", sortable: false }
    ],
    names: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  },
  watch: {
    "response.results": {
      handler(newVal) {
        this.getNames(newVal);
      },
      immediate: true
    }
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
        let listOfIds = listOfSpecimens.map(specimen => specimen.id);

        const taxonResponse = await fetchSpecimenIdentificationsList(listOfIds);
        const rockResponse = await fetchSpecimenIdentificationGeologiesList(
          listOfIds
        );

        if (taxonResponse.status === 200 && rockResponse.status === 200) {
          let taxonList = [];
          let rockList = [];

          if (taxonResponse.data.count > 0) {
            taxonList = taxonResponse.data.results.map(entity => {
              return {
                id: entity.specimen_id,
                name: entity.taxon__taxon ? entity.taxon__taxon : entity.name,
                name_en: entity.taxon__taxon
                  ? entity.taxon__taxon
                  : entity.name,
                taxonId: entity.taxon_id
              };
            });
          }

          if (rockResponse.data.count > 0) {
            rockList = rockResponse.data.results.map(entity => {
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
                rockId: entity.rock_id
              };
            });
          }

          if (taxonList.length > 0 && rockList.length > 0) {
            rockList.forEach(rock => {
              let item = taxonList.find(taxon => rock.id === taxon.id);
              item ? this.names.push(item) : this.names.push(rock);
            });

            taxonList.forEach(taxonItem => {
              let secondItem = rockList.find(
                rockItem => taxonItem.id === rockItem.id
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
    }
  }
};
</script>

<style>
.specimen-table.v-data-table td,
.specimen-table.v-data-table th {
  padding: 0 8px;
}
</style>
