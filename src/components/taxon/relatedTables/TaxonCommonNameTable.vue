<template>
  <div class="taxon-common-name-table">
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
          v-if="!$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.language="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.language__value,
              en: item.language__value_en,
            }"
          />
          <span
            v-else-if="item.language"
            v-translate="{
              et: item.language.value,
              en: item.language.value_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.language__value,
            en: item.language__value_en,
          }"
        ></div>
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
            <span class="headline">{{ $t("header.taxon_common_name") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('common.name')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.language"
                    :color="bodyActiveColor"
                    :items="autocomplete.language"
                    :loading="autocomplete.loaders.language"
                    :item-text="commonLabel"
                    :label="$t('taxon.language')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred"
                    :color="bodyActiveColor"
                    :label="$t('taxon.is_preferred')"
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
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import { fetchListLanguages } from "../../../assets/js/api/apiCalls";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "TaxonCommonNameTable",

  components: {
    CheckboxWrapper,
    AutocompleteWrapper,
    InputWrapper,
  },

  mixins: [autocompleteMixin],

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
      { text: "common.name", value: "name" },
      { text: "taxon.language", value: "language" },
      { text: "taxon.is_preferred", value: "is_preferred" },
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
      name: "",
      language: null,
      is_preferred: false,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      language: [],
      loaders: {
        language: false,
      },
    },
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        };
      });
    },

    isItemValid() {
      return this.item.name !== null && this.item.name.length > 0;
    },
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        name: "",
        language: null,
        is_preferred: false,
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_common_name",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_common_name",
          item: formattedItem,
          rawItem: this.item,
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;

      if (this.$route.meta.isEdit) this.item.id = item.id;
      // else this.item.onEditIndex = this.response.results.indexOf(item);

      if (typeof item.language !== "object" && item.language !== null) {
        this.item.language = {
          id: item.language,
          value: item.language__value,
          value_en: item.language__value_en,
        };
      } else this.item.language = item.language;

      this.item.name = item.name;
      this.item.is_preferred = item.is_preferred === true;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_common_name",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.language.length <= 1) {
        this.autocomplete.loaders.language = true;
        fetchListLanguages().then((response) => {
          if (response.status === 200) {
            this.autocomplete.language =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.language = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    },
  },
};
</script>

<style scoped></style>
