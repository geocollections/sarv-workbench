<template>
  <div class="rock-classification-table">
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

      <template v-slot:item.rock="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/rock/' + item.rock }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.rock__name,
                en: item.rock__name_en,
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.rock"
            :to="{ path: '/rock/' + item.rock.id }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.rock.name,
                en: item.rock.name_en,
              }"
            />
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/rock/' + item.rock }"
          :title="$t('editRock.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div
            v-translate="{
              et: item.rock__name,
              en: item.rock__name_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.rock_classification="{ item }">
        <div v-if="isUsedAsRelatedData">
          <div
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.rock_classification__name,
              en: item.rock_classification__name_en,
            }"
          />
          <div
            v-else-if="item.rock_classification"
            v-translate="{
              et: item.rock_classification.name,
              en: item.rock_classification.name_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.rock_classification__name,
            en: item.rock_classification__name_en,
          }"
        />
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
            <span class="headline">{{ $t("header.rock_classification") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('rock.rock')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock_classification"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock_classification"
                    :loading="autocomplete.loaders.rock_classification"
                    :item-text="nameLabel"
                    :label="$t('rock.rock_classification')"
                    is-searchable
                    v-on:search:items="autocompleteRockClassificationSearch"
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

export default {
  name: "RockClassificationTable",

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
      { text: "rock.rock", value: "rock" },
      { text: "rock.rock_classification", value: "rock_classification" },
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
      rock: null,
      rock_classification: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      rock_classification: [],
      rock: [],
      loaders: {
        rock_classification: false,
        rock: false,
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
      return typeof this.item.rock !== "undefined" && this.item.rock !== null;
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        rock: null,
        rock_classification: null,
        remarks: "",
      };
    },

    addItem() {
      if (this.$route.meta.isEdit) this.item.parent = this.$route.params.id;

      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "rock_tree",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "rock_tree",
          item: formattedItem,
          rawItem: this.item,
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;

      if (this.$route.meta.isEdit) {
        this.item.id = item.id;
        this.item.parent = this.$route.params.id;
      }
      // else this.item.onEditIndex = this.response.results.indexOf(item);

      if (typeof item.rock !== "object" && item.rock !== null) {
        this.item.rock = {
          id: item.rock,
          name: item.rock__name,
          name_en: item.rock__name_en,
        };
        this.autocomplete.rock.push(this.item.rock);
      } else if (item.rock !== null) {
        this.item.rock = item.rock;
        this.autocomplete.rock.push(this.item.rock);
      }

      if (
        typeof item.rock_classification !== "object" &&
        item.rock_classification !== null
      ) {
        this.item.rock_classification = {
          id: item.rock_classification,
          name: item.rock_classification__name,
          name_en: item.rock_classification__name_en,
        };
        this.autocomplete.rock_classification.push(
          this.item.rock_classification
        );
      } else if (item.rock_classification !== null) {
        this.item.rock_classification = item.rock_classification;
        this.autocomplete.rock_classification.push(
          this.item.rock_classification
        );
      }

      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "rock_tree",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
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
