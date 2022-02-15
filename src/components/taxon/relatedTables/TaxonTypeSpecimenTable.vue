<template>
  <div class="taxon-type-specimen-table">
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

      <template v-slot:item.type_type="{ item }">
        <span
          v-if="item.type_type"
          v-translate="{
            et: item.type_type.value,
            en: item.type_type.value_en,
          }"
        />
      </template>

      <template v-slot:item.specimen="{ item }">
        <router-link
          v-if="item.specimen"
          :to="{ path: '/specimen/' + item.specimen.id }"
          :title="$t('editSpecimen.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.specimen.specimen_id }}
        </router-link>
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

      <template v-slot:item.stratigraphy="{ item }">
        <router-link
          v-if="item.stratigraphy"
          :to="{ path: '/stratigraphy/' + item.stratigraphy.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy.stratigraphy,
              en: item.stratigraphy.stratigraphy_en,
            }"
          />
        </router-link>
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
            <span class="headline">{{ $t("header.taxon_type_specimen") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.type_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type_type"
                    :loading="autocomplete.loaders.type_type"
                    :item-text="commonLabel"
                    :label="$t('taxon.type_type')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.repository"
                    :color="bodyActiveColor"
                    :label="$t('taxon.repository')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.specimen"
                    :color="bodyActiveColor"
                    :items="autocomplete.specimen"
                    :loading="autocomplete.loaders.specimen"
                    item-text="specimen_id"
                    :label="$t('taxon.specimen_sarv')"
                    is-link
                    route-object="specimen"
                    is-searchable
                    v-on:search:items="autocompleteSpecimenSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.specimen_number"
                    :color="bodyActiveColor"
                    :label="$t('taxon.specimen_number')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('taxon.reference')"
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
                  <autocomplete-wrapper
                    v-model="item.stratigraphy"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy"
                    :loading="autocomplete.loaders.stratigraphy"
                    :item-text="stratigraphyLabel"
                    :label="$t('common.stratigraphy')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphySearch"
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
import { fetchTaxonTypeType } from "@/assets/js/api/apiCalls";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "TaxonTypeSpecimenTable",

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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "taxon.type_type", value: "type_type" },
      { text: "taxon.repository", value: "repository" },
      { text: "taxon.specimen_sarv", value: "specimen" },
      { text: "taxon.specimen_number", value: "specimen_number" },
      { text: "common.reference", value: "reference" },
      { text: "taxon.locality", value: "locality" },
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    item: {
      type_type: null,
      repository: "",
      specimen: null,
      specimen_number: "",
      reference: null,
      locality: null,
      stratigraphy: null,
      remarks: "",
    },
    autocomplete: {
      type_type: [],
      specimen: [],
      reference: [],
      locality: [],
      stratigraphy: [],
      loaders: {
        type_type: false,
        specimen: false,
        reference: false,
        locality: false,
        stratigraphy: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.type_type !== "undefined" &&
        this.item.type_type !== null
      );
    },
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    },
  },

  methods: {
    resetItem() {
      this.item = {
        type_type: null,
        repository: "",
        specimen: null,
        specimen_number: "",
        reference: null,
        locality: null,
        stratigraphy: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.specimen) {
        this.item.specimen = item.specimen;
        this.autocomplete.specimen.push(this.item.specimen);
      }

      if (item.reference) {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      if (item.locality) {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (item.stratigraphy) {
        this.item.stratigraphy = item.stratigraphy;
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      }

      this.item.type_type = item.type_type;

      this.item.repository = item.repository;
      this.item.specimen_number = item.specimen_number;
      this.item.remarks = item.remarks;
    },

    fillListAutocompletes() {
      if (this.autocomplete.type_type.length <= 1) {
        this.autocomplete.loaders.type_type = true;
        fetchTaxonTypeType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.type_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.type_type = false;
      }
    },
  },
};
</script>
