<template>
  <div class="rock-property-table">
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

      <template v-slot:item.property_type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <div
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.property_type__property,
              en: item.property_type__property_en,
            }"
          />
          <div
            v-else-if="item.property_type"
            v-translate="{
              et: item.property_type.property,
              en: item.property_type.property_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.property_type__property,
            en: item.property_type__property_en,
          }"
        />
      </template>

      <template v-slot:item.is_private="{ item }">
        <v-icon v-if="item.is_private" color="green" small>fas fa-check</v-icon>
        <v-icon v-else color="red" small>fas fa-times</v-icon>
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
            <span class="headline">{{ $t("header.rock_property") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.property_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.property_type"
                    :loading="autocomplete.loaders.property_type"
                    :item-text="propertyLabel"
                    :label="$t('rock.property_type')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_txt"
                    :color="bodyActiveColor"
                    :label="$t('rock.value_txt')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_min"
                    :color="bodyActiveColor"
                    :label="$t('rock.value_min')"
                    type="number"
                    step="0.01"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_max"
                    :color="bodyActiveColor"
                    :label="$t('rock.value_max')"
                    type="number"
                    step="0.01"
                  />
                </v-col>

                <checkbox-wrapper
                  v-model="item.is_private"
                  :color="bodyActiveColor"
                  :label="$t('common.is_private')"
                  @change="item.is_private = !item.is_private"
                />

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
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import  cloneDeep  from "lodash/cloneDeep";
import { fetchListRockPropertyType } from "../../../assets/js/api/apiCalls";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "RockPropertyTable",

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
      { text: "rock.property_type", value: "property_type" },
      { text: "rock.value_txt", value: "value_txt" },
      { text: "rock.value_min", value: "value_min" },
      { text: "rock.value_max", value: "value_max" },
      { text: "common.is_private", value: "is_private" },
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
      property_type: null,
      value_txt: "",
      value_min: "",
      value_max: "",
      is_private: false,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      property_type: [],
      loaders: {
        property_type: false,
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
        typeof this.item.property_type !== "undefined" &&
        this.item.property_type !== null
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
        property_type: null,
        value_txt: "",
        value_min: "",
        value_max: "",
        is_private: false,
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "rock_property",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "rock_property",
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

      if (
        typeof item.property_type !== "object" &&
        item.property_type !== null
      ) {
        this.item.property_type = {
          id: item.property_type,
          property: item.property_type__property,
          property_en: item.property_type__property_en,
        };
        this.autocomplete.property_type.push(this.item.property_type);
      } else if (item.property_type !== null) {
        this.item.property_type = item.property_type;
        this.autocomplete.property_type.push(this.item.property_type);
      }

      this.item.value_txt = item.value_txt;
      this.item.value_min = item.value_min;
      this.item.value_max = item.value_max;
      this.item.is_private = item.is_private;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "rock_property",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.property_type.length <= 1) {
        this.autocomplete.loaders.property_type = true;
        fetchListRockPropertyType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.property_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.property_type = false;
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
