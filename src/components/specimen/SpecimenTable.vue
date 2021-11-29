<template>
  <div>
    <table-wrapper
      v-bind="$attrs"
      :headers="$_tableViewMixin_headers"
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      :page="searchParameters.page"
      :count="response.count"
      :show-search="false"
      @change:headers="
        $_tableViewMixin_updateHeaders({
          value: $event,
        })
      "
      @reset:headers="$_tableViewMixin_resetHeaders()"
      :sort-by="searchParameters.sortBy"
      :sort-desc="searchParameters.sortDesc"
      @update:sort-by="
        $emit('update:sorting', { value: $event, key: 'sortBy' })
      "
      @update:sort-desc="
        $emit('update:sorting', { value: $event, key: 'sortDesc' })
      "
      @update:page="$emit('update:options', { value: $event, key: 'page' })"
      @update:paginateBy="
        $emit('update:options', { value: $event, key: 'paginateBy' })
      "
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
          >{{ item.depth }} - {{ item.depth_interval }} m</span
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
  </div>
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

        const taxonResponse = await this.$api.rw.get(
          "specimen_identification",
          {
            defaultParams: {
              specimen__in: listOfIds.toString(),
              current: true,
            },
            options: {
              sortBy: ["name"],
              sortDesc: [false],
            },
          }
        );
        const rockResponse = await this.$api.rw.get(
          "specimen_identification_geology",
          {
            defaultParams: {
              specimen__in: listOfIds.toString(),
              current: true,
            },
            options: {
              sortBy: ["name"],
              sortDesc: [false],
            },
          }
        );

        if (taxonResponse?.count > 0 && rockResponse?.count > 0) {
          const taxonList = taxonResponse.results.map((entity) => {
            return {
              id: entity.specimen,
              name: entity?.taxon?.taxon ?? entity?.name,
              name_en: entity?.taxon?.taxon ?? entity?.name,
              taxonId: entity?.taxon?.id,
            };
          });

          const rockList = rockResponse.results.map((entity) => {
            let name = "";
            let name_en = "";

            if (entity?.rock?.name && !entity?.name) name = entity.rock.name;
            else if (
              entity?.rock?.name &&
              entity?.name &&
              entity?.rock?.name !== entity?.name
            )
              name = entity.name + " | " + entity.rock.name;
            else name = entity?.name;

            if (entity?.rock?.name_en && !entity?.name_en)
              name_en = entity.rock.name_en;
            else if (
              entity?.rock?.name_en &&
              entity?.name_en &&
              entity?.rock?.name_en !== entity?.name_en
            )
              name_en = entity.name_en + " | " + entity.rock.name_en;
            else name_en = entity?.name_en;

            if (entity?.rock?.formula_html) {
              name += " | " + entity?.rock?.formula_html;
              name_en += " | " + entity?.rock?.formula_html;
            }

            return {
              id: entity.specimen,
              name: name,
              name_en: name_en,
              rockId: entity?.rock?.id,
            };
          });

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
          } else if (taxonList.length > 0) this.names = taxonList;
          else if (rockList.length > 0) this.names = rockList;
        }
      }
    },
  },
};
</script>
