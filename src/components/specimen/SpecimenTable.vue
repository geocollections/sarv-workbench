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
    :show-select="isSelectionSeriesActive"
    @item-selected="$emit('add-item-to-selection-series', $event, 'specimen')"
    @toggle-select-all="$emit('toggle-select-all', $event, 'specimen')"
    expand-icon="fas fa-caret-down"
    :value="selected"
  >
    <template v-slot:item.id="{ item }">
      <router-link
        :to="{ path: '/specimen/' + item.id }"
        :title="$t('editSpecimen.editMessage')"
        class="sarv-link"
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
          ></i>
        </div>

        <div v-else-if="names.find(specimen => specimen.id === item.id).rockId">
          <i
            v-translate="{
              et: names.find(specimen => specimen.id === item.id).name,
              en: names.find(specimen => specimen.id === item.id).name_en
            }"
          ></i>
        </div>

        <i
          v-else
          v-translate="{
            et: names.find(specimen => specimen.id === item.id).name,
            en: names.find(specimen => specimen.id === item.id).name_en
          }"
        ></i>
      </div>
    </template>

    <template v-slot:item.locality__locality="{ item }">
      <router-link
        :to="{ path: '/locality/' + item.locality_id }"
        :title="$t('editLocality.editMessage')"
        class="sarv-link"
        v-if="item.locality_id"
      >
        <span
          v-translate="{
            et: item.locality__locality,
            en: item.locality__locality_en
          }"
        ></span>
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
        ></span>
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
        ></span>
        <!--        </a>-->
      </div>
    </template>

    <template v-slot:item.link="{ item }">
      <v-btn
        v-if="!item.is_private"
        :href="getGeoDetailUrl({ object: 'specimen', id: item.id })"
        :title="$t('editSpecimen.viewMessage')"
        color="deep-orange"
        target="GeocollectionsWindow"
        icon
      >
        <v-icon>far fa-eye</v-icon>
      </v-btn>
    </template>

    <template v-slot:item.selection_series="{ item }">
      <v-btn
        v-if="isSelectionSeriesActive"
        @click="$emit('add-item-to-selection-series', item.id, 'specimen')"
        title="Add specimen to selection series"
        color="green"
        icon
      >
        <v-icon>fas fa-plus-square</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {
  fetchSpecimenIdentificationGeologiesList,
  fetchSpecimenIdentificationsList
} from "../../assets/js/api/apiCalls";

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
    isSelectionSeriesActive: {
      type: Boolean
    },
    activeSelectionSeries: {
      type: Object
    }
  },
  data: () => ({
    expanded: [],
    headers: [
      { text: "specimen.id", value: "id" },
      { text: "specimen.number", value: "specimen_id" },
      { text: "specimen.name", value: "name", sortable: false },
      { text: "specimen.locality", value: "locality__locality" },
      { text: "specimen.depth", value: "depth" },
      { text: "specimen.stratigraphy", value: "stratigraphy__stratigraphy" },
      { text: "specimen.agent_collected", value: "agent_collected__agent" },
      { text: "", value: "link", sortable: false },
      { text: "", value: "selection_series", sortable: false }
    ],
    names: [],
    // Todo: Get all item from active selection series
    selected: []
  }),
  computed: {
    translatedHeaders() {
      return this.headers
        .map(header => {
          return {
            ...header,
            text: this.$t(header.text)
          };
        })
        .filter(item => {
          if (this.isSelectionSeriesActive) return item;
          else if (item.value !== "selection_series") return item;
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

          if (taxonResponse.body.count > 0) {
            taxonList = taxonResponse.body.results.map(entity => {
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

          if (rockResponse.body.count > 0) {
            rockList = rockResponse.body.results.map(entity => {
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
            rockList.forEach(taxon => {
              let item = taxonList.find(rock => taxon.id === rock.id);
              item ? this.names.push(item) : this.names.push(taxon);
            });
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
