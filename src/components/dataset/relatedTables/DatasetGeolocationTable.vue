<template>
  <div class="dataset-geolocation-table">
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
            />
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
            />
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
          />
        </router-link>
      </template>

      <template v-slot:item.polygon="{ item }">
        <div v-if="item.polygon">
          <v-btn
            icon
            small
            :color="bodyActiveColor"
            @click.stop="openPolygonDialog(item.polygon, true)"
            :title="$t('doi.viewPolygon')"
          >
            <v-icon small>far fa-eye</v-icon>
          </v-btn>
        </div>
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
            <span class="headline">{{ $t("header.dataset_geolocation") }}</span>
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
                    :label="$t('doi.locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                    @change="updateFieldsAccordingToLocality"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.place"
                    :color="bodyActiveColor"
                    :label="$t('doi.place')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.point_longitude"
                    :color="bodyActiveColor"
                    :label="$t('doi.pointLongitude')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.point_latitude"
                    :color="bodyActiveColor"
                    :label="$t('doi.pointLatitude')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.polygon"
                    :color="bodyActiveColor"
                    :label="$t('doi.polygon')"
                    readonly
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <div class="d-flex flew-row flex-wrap">
                    <v-btn
                      text
                      :color="bodyActiveColor"
                      @click.stop="openPolygonDialog(item.polygon, false)"
                    >
                      {{
                        item.polygon
                          ? $t("doi.editPolygon")
                          : $t("doi.addPolygon")
                      }}
                    </v-btn>
                  </div>
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

      <v-dialog
        v-model="polygonDialog"
        max-width="500px"
        style="z-index: 51000"
      >
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title class="headline">{{
            $t("doi.polygonMap")
          }}</v-card-title>

          <PolygonMap
            v-if="polygonDialog"
            :map-state="polygonDialog"
            :polygon="item.polygon"
            :is-view-only="viewPolygon"
            v-on:polygon:updated="item.polygon = $event"
          />

          <v-card-actions>
            <v-spacer />
            <div v-if="!viewPolygon">
              <v-btn color="red" text @click="closeAndReset">{{
                $t("buttons.cancel")
              }}</v-btn>
              <v-btn color="green" text @click="polygonDialog = false">{{
                $t("buttons.edit")
              }}</v-btn>
            </div>
            <div v-else>
              <v-btn color="red" text @click="polygonDialog = false">{{
                $t("buttons.close")
              }}</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </div>
</template>

<script>
import PolygonMap from "@/components/partial/PolygonMap";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import { cloneDeep } from "lodash";

export default {
  name: "DatasetGeolocationTable",

  components: {
    PolygonMap,
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
      { text: "doi.locality", value: "locality" },
      { text: "doi.place", value: "place" },
      { text: "doi.pointLongitude", value: "point_longitude" },
      { text: "doi.pointLatitude", value: "point_latitude" },
      { text: "doi.polygon", value: "polygon" },
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
      place: "",
      point_longitude: "",
      point_latitude: "",
      polygon: "",
    },
    isNewItem: true,
    autocomplete: {
      locality: [],
      loaders: {
        locality: false,
      },
    },
    polygonDialog: false,
    viewPolygon: false,
    originalPolygon: "",
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
        (typeof this.item.locality !== "undefined" &&
          this.item.locality !== null) ||
        (typeof this.item.place !== "undefined" &&
          this.item.place !== null &&
          this.item.place.trim().length > 0) ||
        (this.item.polygon && this.item.polygon.length > 0)
      );
    },
  },

  methods: {
    closeAndReset() {
      this.polygonDialog = false;
      this.item.polygon = this.originalPolygon;
    },

    openPolygonDialog(polygon, viewOnly) {
      this.originalPolygon = polygon;
      this.item.polygon = polygon;
      this.viewPolygon = viewOnly;
      this.polygonDialog = true;
    },

    updateFieldsAccordingToLocality(locality) {
      if (typeof locality !== "undefined" && locality !== null) {
        this.item.point_longitude = locality.longitude;
        this.item.point_latitude = locality.latitude;
      }
    },

    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        locality: null,
        place: "",
        point_longitude: "",
        point_latitude: "",
        polygon: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "dataset_geolocation",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "dataset_geolocation",
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

      this.item.place = item.place;
      this.item.point_longitude = item.point_longitude;
      this.item.point_latitude = item.point_latitude;
      this.item.polygon = item.polygon;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "dataset_geolocation",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
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
