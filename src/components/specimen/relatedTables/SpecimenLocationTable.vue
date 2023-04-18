<template>
  <div class="specimen-location-table">
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

      <template v-slot:item.type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.type__value,
              en: item.type__value_en,
            }"
          />
          <span
            v-else-if="item.type"
            v-translate="{
              et: item.type.value,
              en: item.type.value_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.type__value,
            en: item.type__value_en,
          }"
        ></div>
      </template>

      <template v-slot:item.storage="{ item }">
        <div v-if="isUsedAsRelatedData">
          <div v-if="$route.meta.isEdit">{{ item.storage__location }}</div>
          <div v-else-if="item.storage">{{ item.storage.location }}</div>
        </div>
        <div v-else>{{ item.storage__location }}</div>
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
              `${$t("common.new")} ${$t("header.specimen_location")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.number"
                    :color="bodyActiveColor"
                    :label="$t('specimen_location.number')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type"
                    :loading="autocomplete.loaders.type"
                    :item-text="commonLabel"
                    :label="$t('common.type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.part"
                    :color="bodyActiveColor"
                    :label="$t('specimen_location.part')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.storage"
                    :color="bodyActiveColor"
                    :items="autocomplete.storage"
                    :loading="autocomplete.loaders.storage"
                    item-text="location"
                    :label="$t('specimen_location.storage')"
                    use-state
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
  </div>
</template>

<script>
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import { fetchListSpecimenType } from "../../../assets/js/api/apiCalls";

export default {
  name: "SpecimenLocationTable",

  components: {
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
      { text: "specimen_location.number", value: "number" },
      { text: "common.type", value: "type" },
      { text: "specimen_location.part", value: "part" },
      { text: "specimen_location.storage", value: "storage" },
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
      number: "",
      type: null,
      part: "",
      storage: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      type: [],
      storage: [],
      loaders: {
        type: false,
        storage: false,
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
        typeof this.item.storage === "object" && this.item.storage !== null
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
        number: "",
        type: null,
        part: "",
        storage: null,
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "specimen_location",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "specimen_location",
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

      if (typeof item.type !== "object" && item.type !== null) {
        this.item.type = {
          id: item.type,
          value: item.type__value,
          value_en: item.type__value_en,
        };
      }

      this.item.number = item.number;
      this.item.part = item.part;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "specimen_location",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.type.length <= 1) {
        this.autocomplete.loaders.type = true;
        fetchListSpecimenType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.type = false;
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
