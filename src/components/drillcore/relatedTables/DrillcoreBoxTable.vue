<template>
  <div class="drillcore-box-table">
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

      <template v-slot:item.stratigraphy_base="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/stratigraphy/' + item.stratigraphy_base }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy_base__stratigraphy,
                en: item.stratigraphy_base__stratigraphy_en
              }"
            ></span>
          </router-link>
          <router-link
            v-else-if="item.stratigraphy_base"
            :to="{ path: '/stratigraphy/' + item.stratigraphy_base.id }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy_base.stratigraphy,
                en: item.stratigraphy_base.stratigraphy_en
              }"
            ></span>
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/stratigraphy/' + item.stratigraphy_base }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_base__stratigraphy,
              en: item.stratigraphy_base__stratigraphy_en
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.stratigraphy_top="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/stratigraphy/' + item.stratigraphy_top }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy_top__stratigraphy,
                en: item.stratigraphy_top__stratigraphy_en
              }"
            ></span>
          </router-link>
          <router-link
            v-else-if="item.stratigraphy_top"
            :to="{ path: '/stratigraphy/' + item.stratigraphy_top.id }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy_top.stratigraphy,
                en: item.stratigraphy_top.stratigraphy_en
              }"
            ></span>
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/stratigraphy/' + item.stratigraphy_top }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_top__stratigraphy,
              en: item.stratigraphy_top__stratigraphy_en
            }"
          ></span>
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
        <v-card>
          <v-card-title>
            <span class="headline">{{
              `${$t("common.new")} ${$t("header.dataset_reference")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.number"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.number')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_start"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.depth_start')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_end"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.depth_end')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy_base"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy_base"
                    :loading="autocomplete.loaders.stratigraphy_base"
                    :item-text="stratigraphyLabel"
                    :label="$t('drillcore_box.stratigraphy_base')"
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
                    :label="$t('drillcore_box.stratigraphy_top')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphyTopSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_other"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.depth_other')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.number_meters"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.number_meters')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.diameter"
                    :color="bodyActiveColor"
                    :label="$t('drillcore_box.diameter')"
                    type="number"
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
  name: "DrillcoreStudyTable",

  components: {
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
      { text: "drillcore_box.number", value: "number" },
      { text: "drillcore_box.depth_start", value: "depth_start" },
      { text: "drillcore_box.depth_end", value: "depth_end" },
      { text: "drillcore_box.stratigraphy_base", value: "stratigraphy_base" },
      { text: "drillcore_box.stratigraphy_top", value: "stratigraphy_top" },
      { text: "drillcore_box.depth_other", value: "depth_other" },
      { text: "drillcore_box.number_meters", value: "number_meters" },
      { text: "drillcore_box.diameter", value: "diameter" },
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
      number: "",
      depth_start: "",
      depth_end: "",
      stratigraphy_base: null,
      stratigraphy_top: null,
      depth_other: "",
      number_meters: "",
      diameter: "",
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      stratigraphy_base: [],
      stratigraphy_top: [],
      loaders: {
        stratigraphy_base: false,
        stratigraphy_top: false
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
      return this.item.number !== null && this.item.number.length > 0;
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        number: "",
        depth_start: "",
        depth_end: "",
        stratigraphy_base: null,
        stratigraphy_top: null,
        depth_other: "",
        number_meters: "",
        diameter: "",
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "drillcore_box",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "drillcore_box",
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

      if (
        typeof item.stratigraphy_base !== "object" &&
        item.stratigraphy_base !== null
      ) {
        this.item.stratigraphy_base = {
          id: item.stratigraphy_base,
          stratigraphy: item.stratigraphy_base__stratigraphy,
          stratigraphy_en: item.stratigraphy_base__stratigraphy_en
        };
        this.autocomplete.stratigraphy_base.push(this.item.stratigraphy_base);
      } else if (item.stratigraphy_base !== null) {
        this.item.stratigraphy_base = item.stratigraphy_base;
        this.autocomplete.stratigraphy_base.push(this.item.stratigraphy_base);
      }

      if (
        typeof item.stratigraphy_top !== "object" &&
        item.stratigraphy_top !== null
      ) {
        this.item.stratigraphy_top = {
          id: item.stratigraphy_top,
          stratigraphy: item.stratigraphy_top__stratigraphy,
          stratigraphy_en: item.stratigraphy_top__stratigraphy_en
        };
        this.autocomplete.stratigraphy_top.push(this.item.stratigraphy_top);
      } else if (item.stratigraphy_top !== null) {
        this.item.stratigraphy_top = item.stratigraphy_top;
        this.autocomplete.stratigraphy_top.push(this.item.stratigraphy_top);
      }

      this.item.number = item.number;
      this.item.depth_start = item.depth_start;
      this.item.depth_end = item.depth_end;
      this.item.depth_other = item.depth_other;
      this.item.number_meters = item.number_meters;
      this.item.diameter = item.diameter;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "drillcore_box",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
    }
  }
};
</script>

<style scoped />
