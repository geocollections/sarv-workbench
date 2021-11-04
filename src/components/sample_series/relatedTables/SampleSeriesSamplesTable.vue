<template>
  <div class="sample-series-sample-table">
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

      <template v-slot:item.number="{ item }">
        <router-link
          :to="{ path: '/sample/' + item.id }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div v-if="item.number">{{ item.number }}</div>
          <div v-else>{{ item.number_additional }}</div>
        </router-link>
      </template>

      <template v-slot:item.locality="{ item }">
        <router-link
          v-if="item.locality"
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
          />
        </router-link>
        <div v-else>{{ item.locality_free }}</div>
      </template>

      <template v-slot:item.stratigraphy="{ item }">
        <router-link
          v-if="item.stratigraphy"
          :to="{ path: '/stratigraphy/' + item.stratigraphy }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy__stratigraphy,
              en: item.stratigraphy__stratigraphy_en,
            }"
          ></span>
        </router-link>
        <div v-else>{{ item.stratigraphy_free }}</div>
      </template>

      <template v-slot:item.lithostratigraphy="{ item }">
        <router-link
          v-if="item.lithostratigraphy"
          :to="{ path: '/stratigraphy/' + item.lithostratigraphy }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.lithostratigraphy__stratigraphy,
              en: item.lithostratigraphy__stratigraphy_en,
            }"
          ></span>
        </router-link>
        <div v-else>{{ item.lithostratigraphy_free }}</div>
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
            <span class="headline">{{ $t("header.sample") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.number"
                    :color="bodyActiveColor"
                    :label="$t('common.depth')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('common.locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth"
                    :color="bodyActiveColor"
                    :label="$t('common.depth')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_interval"
                    :color="bodyActiveColor"
                    :label="$t('common.depth_interval')"
                    type="number"
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
                    v-on:search:items="autocompleteChronostratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.lithostratigraphy"
                    :color="bodyActiveColor"
                    :items="autocomplete.lithostratigraphy"
                    :loading="autocomplete.loaders.lithostratigraphy"
                    :item-text="stratigraphyLabel"
                    :label="$t('common.lithostratigraphy')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteLithostratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.stratigraphy_free"
                    :color="bodyActiveColor"
                    :label="$t('common.stratigraphy_free')"
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
export default {
  name: "SampleSeriesSamplesTable",

  components: { InputWrapper, AutocompleteWrapper },

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
  },

  data: () => ({
    headers: [
      { text: "common.number", value: "number" },
      {
        text: "common.locality",
        value: "locality",
      },
      {
        text: "common.depth",
        value: "depth",
      },
      { text: "common.depth_interval", value: "depth_interval" },
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "common.lithostratigraphy", value: "lithostratigraphy" },
      { text: "common.stratigraphy_free", value: "stratigraphy_free" },
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
      locality: null,
      depth: "",
      depth_interval: "",
      stratigraphy: null,
      lithostratigraphy: null,
      stratigraphy_free: "",
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      locality: [],
      stratigraphy: [],
      lithostratigraphy: [],
      loaders: {
        locality: false,
        stratigraphy: false,
        lithostratigraphy: false,
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
      return this.item.number !== null && this.item.number.length > 0;
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        number: "",
        locality: null,
        depth: "",
        depth_interval: "",
        stratigraphy: null,
        lithostratigraphy: null,
        stratigraphy_free: "",
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "sample",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "sample",
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
      } else if (item.locality !== null) {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (typeof item.stratigraphy !== "object" && item.stratigraphy !== null) {
        this.item.stratigraphy = {
          id: item.stratigraphy,
          stratigraphy: item.stratigraphy__stratigraphy,
          stratigraphy_en: item.stratigraphy__stratigraphy_en,
        };
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      } else if (item.stratigraphy !== null) {
        this.item.stratigraphy = item.stratigraphy;
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      }

      if (
        typeof item.lithostratigraphy !== "object" &&
        item.lithostratigraphy !== null
      ) {
        this.item.lithostratigraphy = {
          id: item.lithostratigraphy,
          stratigraphy: item.lithostratigraphy__stratigraphy,
          stratigraphy_en: item.lithostratigraphy__stratigraphy_en,
        };
        this.autocomplete.lithostratigraphy.push(this.item.lithostratigraphy);
      } else if (item.lithostratigraphy !== null) {
        this.item.lithostratigraphy = item.lithostratigraphy;
        this.autocomplete.lithostratigraphy.push(this.item.lithostratigraphy);
      }

      this.item.number = item.number;
      this.item.depth = item.depth;
      this.item.depth_interval = item.depth_interval;
      this.item.stratigraphy_free = item.stratigraphy_free;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "sample",
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

<style scoped />
