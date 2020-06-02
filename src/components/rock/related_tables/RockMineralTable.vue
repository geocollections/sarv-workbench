<template>
  <div class="rock-mineral-table">
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

      <template v-slot:item.mineral="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/rock/' + item.mineral }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.mineral__name,
                en: item.mineral__name_en
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.mineral"
            :to="{ path: '/rock/' + item.mineral.id }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.mineral.name,
                en: item.mineral.name_en
              }"
            />
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/rock/' + item.mineral }"
          :title="$t('editRock.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div
            v-translate="{
              et: item.mineral__name,
              en: item.mineral__name_en
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.mineral_type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.mineral_type__name,
              en: item.mineral_type__name_en
            }"
          />
          <span
            v-else-if="item.mineral_type"
            v-translate="{
              et: item.mineral_type.name,
              en: item.mineral_type.name_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.mineral_type__name,
            en: item.mineral_type__name_en
          }"
        ></div>
      </template>

      <template v-slot:item.is_primary="{ item }">
        <v-icon v-if="item.is_primary" color="green" small>fas fa-check</v-icon>
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
            <span class="headline">{{ $t("rock.mineral") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.mineral"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('rock.mineral')"
                    use-state
                    is-searchable
                    is-link
                    route-object="rock"
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.mineral_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.mineral_type"
                    :loading="autocomplete.loaders.mineral_type"
                    :item-text="nameLabel"
                    :label="$t('rock.mineral_type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.sort"
                    :color="bodyActiveColor"
                    :label="$t('rock.sort')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_primary"
                    :color="bodyActiveColor"
                    :label="$t('common.is_primary')"
                    @change="item.is_primary = !item.is_primary"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="item.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <textarea-wrapper
                    v-model="item.description_en"
                    :color="bodyActiveColor"
                    :label="$t('common.description_en')"
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
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import TextareaWrapper from "../../partial/inputs/TextareaWrapper";
import {
  fetchListIdentificationType,
  fetchListRockMineralType
} from "../../../assets/js/api/apiCalls";

export default {
  name: "RockMineralTable",

  components: {
    TextareaWrapper,
    CheckboxWrapper,
    AutocompleteWrapper,
    InputWrapper
  },

  mixins: [autocompleteMixin],

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
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    headers: [
      { text: "rock.mineral", value: "mineral" },
      { text: "rock.mineral_type", value: "mineral_type" },
      { text: "rock.sort", value: "sort" },
      { text: "common.is_primary", value: "is_primary" },
      { text: "common.description", value: "description" },
      { text: "common.description_en", value: "description_en" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      mineral: null,
      mineral_type: null,
      sort: "",
      is_primary: false,
      description: "",
      description_en: "",
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      rock: [],
      mineral_type: [],
      loaders: {
        rock: false,
        mineral_type: false
      }
    }
  }),

  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    },

    isItemValid() {
      return (
        typeof this.item.mineral !== "undefined" && this.item.mineral !== null
      );
    }
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        mineral: null,
        mineral_type: null,
        sort: "",
        is_primary: false,
        description: "",
        description_en: "",
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "rock_mineral",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "rock_mineral",
          item: formattedItem,
          rawItem: this.item
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;

      if (this.$route.meta.isEdit) this.item.id = item.id;
      // else this.item.onEditIndex = this.response.results.indexOf(item);

      if (typeof item.mineral !== "object" && item.mineral !== null) {
        this.item.mineral = {
          id: item.mineral,
          name: item.mineral__name,
          name_en: item.mineral__name_en
        };
        this.autocomplete.rock.push(this.item.mineral);
      } else if (item.mineral !== null) {
        this.item.mineral = item.mineral;
        this.autocomplete.rock.push(this.item.mineral);
      }

      if (typeof item.mineral_type !== "object" && item.mineral_type !== null) {
        this.item.mineral_type = {
          id: item.mineral_type,
          name: item.mineral_type__name,
          name_en: item.mineral_type__name_en
        };
        this.autocomplete.mineral_type.push(this.item.mineral_type);
      } else if (item.mineral_type !== null) {
        this.item.mineral_type = item.mineral_type;
        this.autocomplete.mineral_type.push(this.item.mineral_type);
      }

      this.item.sort = item.sort;
      this.item.is_primary = item.is_primary;
      this.item.description = item.description;
      this.item.description_en = item.description_en;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "rock_mineral",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.mineral_type.length <= 1) {
        this.autocomplete.loaders.mineral_type = true;
        fetchListRockMineralType().then(response => {
          if (response.status === 200) {
            this.autocomplete.mineral_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.mineral_type = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    }
  }
};
</script>

<style scoped></style>
