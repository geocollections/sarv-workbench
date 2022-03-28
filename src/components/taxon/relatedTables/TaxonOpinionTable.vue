<template>
  <div class="taxon-opinion-table">
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

      <template v-slot:item.opinion_type="{ item }">
        <span
          v-if="item.opinion_type"
          v-translate="{
            et: item.opinion_type.value,
            en: item.opinion_type.value_en,
          }"
        />
      </template>

      <template v-slot:item.other_taxon="{ item }">
        <router-link
          v-if="item.other_taxon"
          :to="{ path: '/taxon/' + item.other_taxon.id }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.other_taxon.taxon }}
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

      <template v-slot:item.is_preferred="{ item }">
        <v-icon v-if="item.is_preferred" small>fas fa-check</v-icon>
        <v-icon v-else small>fas fa-times</v-icon>
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
            <span class="headline">{{ $t("header.taxon_opinion") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.opinion_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.opinion_type"
                    :loading="autocomplete.loaders.opinion_type"
                    :item-text="commonLabel"
                    :label="$t('taxon.opinion')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.other_taxon"
                    :color="bodyActiveColor"
                    :items="autocomplete.taxon"
                    :loading="autocomplete.loaders.taxon"
                    item-text="taxon"
                    :label="$t('taxon.other_taxon')"
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteTaxonSearch"
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
                  <input-wrapper
                    v-model="item.pages"
                    :color="bodyActiveColor"
                    :label="$t('taxon.pages')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.author"
                    :color="bodyActiveColor"
                    :label="$t('taxon.author')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.year"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred"
                    :color="bodyActiveColor"
                    :label="$t('taxon.is_preferred_opinion')"
                    @change="item.is_preferred = !item.is_preferred"
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
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "TaxonOpinionTable",

  components: {
    RelatedDataDeleteDialog,
    CheckboxWrapper,
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
  },

  data: () => ({
    headers: [
      { text: "taxon.opinion", value: "opinion_type" },
      { text: "taxon.other_taxon", value: "other_taxon" },
      { text: "common.reference", value: "reference" },
      { text: "taxon.pages", value: "pages" },
      { text: "taxon.author", value: "author" },
      { text: "common.year", value: "year" },
      { text: "taxon.is_preferred_opinion", value: "is_preferred" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    item: {
      opinion_type: null,
      other_taxon: null,
      reference: null,
      pages: "",
      author: "",
      year: "",
      is_preferred: false,
      remarks: "",
    },
    autocomplete: {
      opinion_type: [],
      taxon: [],
      reference: [],
      loaders: {
        opinion_type: false,
        taxon: false,
        reference: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.opinion_type !== "undefined" &&
        this.item.opinion_type !== null
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
        opinion_type: null,
        other_taxon: null,
        reference: null,
        pages: "",
        author: "",
        year: "",
        is_preferred: false,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.reference) {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      if (item.other_taxon) {
        this.item.other_taxon = item.other_taxon;
        this.autocomplete.taxon.push(this.item.other_taxon);
      }

      this.item.opinion_type = item.opinion_type;

      this.item.pages = item.pages;
      this.item.author = item.author;
      this.item.year = item.year;
      this.item.is_preferred = item.is_preferred === true;
      this.item.remarks = item.remarks;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.opinion_type.length <= 1) {
        this.autocomplete.loaders.opinion_type = true;
        const response = await this.$api.rw.get("taxon_opinion_type");
        this.autocomplete.opinion_type = response?.results ?? [];
        this.autocomplete.loaders.opinion_type = false;
      }
    },
  },
};
</script>
