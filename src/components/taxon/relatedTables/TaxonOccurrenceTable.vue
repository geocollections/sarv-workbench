<template>
  <div class="taxon-occurrence-table">
    <v-data-table
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :search="filter"
      expand-icon="fas fa-caret-down"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.count"
      :class="bodyColor.split('n-')[0] + 'n-5'"
      :disable-sort="!$route.meta.isEdit"
    >
      <template v-slot:item.action="{ item }">
        <v-btn
          icon
          @click="editItem(item)"
          color="green"
          :title="$t('buttons.edit')"
          small
        >
          <v-icon small>far fa-edit</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.reference="{ item }">
        <router-link
          v-if="item.reference"
          :to="{ path: '/reference/' + item.reference.id }"
          :title="$t('editReference.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.reference.reference }}
        </router-link>
      </template>

      <template v-slot:item.locality="{ item }">
        <router-link
          v-if="item.locality"
          :to="{ path: '/locality/' + item.locality.id }"
          :title="$t('editLocality.editMessage')"
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
      </template>

      <template v-slot:item.stratigraphy_base="{ item }">
        <router-link
          v-if="item.stratigraphy_base"
          :to="{ path: '/stratigraphy/' + item.stratigraphy_base.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_base.stratigraphy,
              en: item.stratigraphy_base.stratigraphy_en,
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.stratigraphy_top="{ item }">
        <router-link
          v-if="item.stratigraphy_top"
          :to="{ path: '/stratigraphy/' + item.stratigraphy_top.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_top.stratigraphy,
              en: item.stratigraphy_top.stratigraphy_en,
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.stratigraphic_distribution="{ item }">
        <div
          v-translate="{
            et: item.stratigraphic_distribution,
            en: item.stratigraphic_distribution_en,
          }"
        ></div>
      </template>
    </v-data-table>

    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <template v-slot:activator="{ on }">
          <v-btn :color="bodyActiveColor" small dark v-on="on">{{
            $t("buttons.add_new")
          }}</v-btn>
        </template>
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{ $t("header.taxon_occurance") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('taxon.reference')"
                    use-state
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('taxon.locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth"
                    :color="bodyActiveColor"
                    :label="$t('common.depth')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_interval"
                    :color="bodyActiveColor"
                    :label="$t('common.depth_interval')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.locality_free"
                    :color="bodyActiveColor"
                    :label="$t('taxon.locality_free')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy_base"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy_base"
                    :loading="autocomplete.loaders.stratigraphy_base"
                    :item-text="stratigraphyLabel"
                    :label="$t('taxon.stratigraphy_base')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphyBaseSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy_top"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy_top"
                    :loading="autocomplete.loaders.stratigraphy_top"
                    :item-text="stratigraphyLabel"
                    :label="$t('taxon.stratigraphy_top')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphyTopSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.stratigraphic_distribution"
                    :color="bodyActiveColor"
                    :label="$t('taxon.stratigraphic_distribution')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.stratigraphic_distribution_en"
                    :color="bodyActiveColor"
                    :label="$t('taxon.stratigraphic_distribution_en')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancel">{{
              $t("buttons.cancel")
            }}</v-btn>
            <v-btn
              :disabled="!isItemValid"
              color="green"
              text
              @click="addItem"
              >{{ isNewItem ? $t("buttons.add") : $t("buttons.edit") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "TaxonOccurrenceTable",

  components: {
    RelatedDataDeleteDialog,
    AutocompleteWrapper,
    InputWrapper,
  },

  mixins: [autocompleteMixin, relatedDataMixin],

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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "common.reference", value: "reference" },
      { text: "taxon.locality", value: "locality" },
      { text: "taxon.locality_free", value: "locality_free" },
      { text: "taxon.stratigraphy_base", value: "stratigraphy_base" },
      { text: "taxon.stratigraphy_top", value: "stratigraphy_top" },
      {
        text: "taxon.stratigraphic_distribution",
        value: "stratigraphic_distribution",
      },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    item: {
      reference: null,
      locality: null,
      depth: "",
      depth_interval: "",
      locality_free: "",
      stratigraphy_base: null,
      stratigraphy_top: null,
      stratigraphic_distribution: "",
      stratigraphic_distribution_en: "",
      remarks: "",
    },
    autocomplete: {
      reference: [],
      locality: [],
      stratigraphy_base: [],
      stratigraphy_top: [],
      loaders: {
        reference: false,
        locality: false,
        stratigraphy_base: false,
        stratigraphy_top: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.reference !== "undefined" &&
        this.item.reference !== null
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        reference: null,
        locality: null,
        depth: "",
        depth_interval: "",
        locality_free: "",
        stratigraphy_base: null,
        stratigraphy_top: null,
        stratigraphic_distribution: "",
        stratigraphic_distribution_en: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.reference) {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      if (item.locality) {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (item.stratigraphy_base) {
        this.item.stratigraphy_base = item.stratigraphy_base;
        this.autocomplete.stratigraphy_base.push(this.item.stratigraphy_base);
      }

      if (item.stratigraphy_top) {
        this.item.stratigraphy_top = item.stratigraphy_top;
        this.autocomplete.stratigraphy_top.push(this.item.stratigraphy_top);
      }

      this.item.depth = item.depth;
      this.item.depth_interval = item.depth_interval;
      this.item.stratigraphic_distribution = item.stratigraphic_distribution;
      this.item.stratigraphic_distribution_en =
        item.stratigraphic_distribution_en;
      this.item.locality_free = item.locality_free;
      this.item.remarks = item.remarks;
    },
  },
};
</script>
