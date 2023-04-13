<template>
  <div class="sample-preparation-table">
    <v-data-table
      mobile-breakpoint="0"
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
          v-if="$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.preparation_number="{ item }">
        <router-link
          :to="{ path: '/preparation/' + item.id }"
          :title="$t('editPreparation.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.preparation_number }}
        </router-link>
      </template>
      <template v-slot:item.taxon="{ item }">
        <router-link
          v-if="$route.meta.isEdit"
          :to="{ path: '/taxon/' + item.taxon }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.taxon__taxon }}
        </router-link>
        <router-link
          v-else-if="item.taxon"
          :to="{ path: '/taxon/' + item.taxon.id }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.taxon.taxon }}
        </router-link>
      </template>

      <template v-slot:item.storage="{ item }">
        <div v-if="$route.meta.isEdit">{{ item.storage__location }}</div>
        <div v-else-if="item.storage">{{ item.storage.location }}</div>
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
            <span class="headline">{{ $t("header.sample_preparation") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.preparation_number"
                    :color="bodyActiveColor"
                    :label="$t('preparation.preparation_number')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.taxon"
                    :color="bodyActiveColor"
                    :items="autocomplete.taxon"
                    :loading="autocomplete.loaders.taxon"
                    item-text="taxon"
                    :label="$t('preparation.fossil_group')"
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteTaxonSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.storage"
                    :color="bodyActiveColor"
                    :items="autocomplete.storage"
                    :loading="autocomplete.loaders.storage"
                    item-text="location"
                    :label="$t('preparation.storage')"
                    is-searchable
                    v-on:search:items="autocompleteStorageSearch"
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
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";

export default {
  name: "PreparationTable",

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
  },

  data: () => ({
    headers: [
      { text: "preparation.preparation_number", value: "preparation_number" },
      { text: "preparation.fossil_group", value: "taxon" },
      { text: "preparation.storage", value: "storage" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      preparation_number: "",
      taxon: null,
      storage: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      taxon: [],
      storage: [],
      loaders: {
        taxon: false,
        storage: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        this.item.preparation_number !== null &&
        this.item.preparation_number.length > 0
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        preparation_number: "",
        taxon: null,
        storage: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (typeof item.taxon !== "object" && item.taxon !== null) {
        this.item.taxon = {
          id: item.taxon,
          taxon: item.taxon__taxon,
        };
        this.autocomplete.taxon.push(this.item.taxon);
      } else if (item.taxon !== null) {
        this.item.taxon = item.taxon;
        this.autocomplete.taxon.push(this.item.taxon);
      }

      if (typeof item.storage !== "object" && item.storage !== null) {
        this.item.storage = {
          id: item.storage,
          location: item.storage__location,
        };
        this.autocomplete.storage.push(this.item.storage);
      } else if (item.storage !== null) {
        this.item.storage = item.storage;
        this.autocomplete.storage.push(this.item.storage);
      }

      this.item.preparation_number = item.preparation_number;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>
