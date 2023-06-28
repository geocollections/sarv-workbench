<template>
  <div class="stratigraphy-stratotype-table">
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

      <template v-slot:item.locality="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/locality/' + item.locality }"
            :title="$t('editLocality.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.locality__locality,
                en: item.locality__locality_en,
              }"
            ></span>
          </router-link>
          <router-link
            v-else-if="item.locality"
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
            ></span>
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/locality/' + item.locality }"
          :title="$t('editLocality.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.locality__locality,
              en: item.locality__locality_en,
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.stratotype_type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.stratotype_type__value,
              en: item.stratotype_type__value_en,
            }"
          />
          <span
            v-else-if="item.stratotype_type"
            v-translate="{
              et: item.stratotype_type.value,
              en: item.stratotype_type.value_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.stratotype_type__value,
            en: item.stratotype_type__value_en,
          }"
        ></div>
      </template>

      <template v-slot:item.reference="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/reference/' + item.reference }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.reference__reference }}
          </router-link>
          <router-link
            v-else-if="item.reference"
            :to="{ path: '/reference/' + item.reference.id }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.reference.reference }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/reference/' + item.reference }"
          :title="$t('editReference.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.reference__reference }}
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
            <span class="headline">{{
              `${$t("common.new")} ${$t("header.stratigraphy_stratotype")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('stratigraphy_stratotype.locality')"
                    use-state
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratotype_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratotype_type"
                    :loading="autocomplete.loaders.stratotype_type"
                    :item-text="commonLabel"
                    :label="$t('stratigraphy_stratotype.stratotype_type')"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_stratotype.depth_base')"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_stratotype.depth_top')"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('stratigraphy_stratotype.reference')"
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
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
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import { cloneDeep } from "lodash";
import { fetchListStratotypeType } from "../../../assets/js/api/apiCalls";

export default {
  name: "StratigraphyStratotypeTable",

  components: { AutocompleteWrapper, InputWrapper },

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
      { text: "stratigraphy_stratotype.locality", value: "locality" },
      {
        text: "stratigraphy_stratotype.stratotype_type",
        value: "stratotype_type",
      },
      { text: "stratigraphy_stratotype.depth_base", value: "depth_base" },
      { text: "stratigraphy_stratotype.depth_top", value: "depth_top" },
      { text: "common.reference", value: "reference" },
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
      locality: null,
      stratotype_type: null,
      depth_base: null,
      depth_top: null,
      reference: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      locality: [],
      stratotype_type: [],
      reference: [],
      loaders: {
        locality: false,
        stratotype_type: false,
        reference: false,
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
      return (
        typeof this.item.locality === "object" && this.item.locality !== null
      );
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
        locality: null,
        stratotype_type: null,
        depth_base: null,
        depth_top: null,
        reference: null,
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "stratigraphy_stratotype",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "stratigraphy_stratotype",
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

      if (typeof item.locality !== "object" && item.locality !== null) {
        this.item.locality = {
          id: item.locality,
          locality: item.locality__locality,
          locality_en: item.locality__locality_en,
        };
        this.autocomplete.locality.push(this.item.locality);
      } else {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (
        typeof item.stratotype_type !== "object" &&
        item.stratotype_type !== null
      ) {
        this.item.stratotype_type = {
          id: item.stratotype_type,
          value: item.stratotype_type__value,
          value_en: item.stratotype_type__value_en,
        };
      } else this.item.stratotype_type = item.stratotype_type;

      this.item.depth_base = item.depth_base;
      this.item.depth_top = item.depth_top;

      if (typeof item.reference !== "object" && item.reference !== null) {
        this.item.reference = {
          id: item.reference,
          reference: item.reference__reference,
        };
        this.autocomplete.reference.push(this.item.reference);
      } else {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "stratigraphy_stratotype",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.stratotype_type.length <= 1) {
        this.autocomplete.loaders.stratotype_type = true;
        fetchListStratotypeType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.stratotype_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.stratotype_type = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
    },
  },
};
</script>

<style scoped></style>
