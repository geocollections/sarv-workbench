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
        <div v-else>{{ item.locality_free }}</div>
      </template>

      <template v-slot:item.stratigraphy="{ item }">
        <router-link
          v-if="item.stratigraphy"
          :to="{ path: '/stratigraphy/' + item.stratigraphy.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy.stratigraphy,
              en: item.stratigraphy.stratigraphy_en,
            }"
          ></span>
        </router-link>
        <div v-else>{{ item.stratigraphy_free }}</div>
      </template>

      <template v-slot:item.lithostratigraphy="{ item }">
        <router-link
          v-if="item.lithostratigraphy"
          :to="{ path: '/stratigraphy/' + item.lithostratigraphy.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.lithostratigraphy.stratigraphy,
              en: item.lithostratigraphy.stratigraphy_en,
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

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import { cloneDeep } from "lodash";
import relatedDataMixin from "@/mixins/relatedDataMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
export default {
  name: "SampleTable",

  components: { RelatedDataDeleteDialog, InputWrapper, AutocompleteWrapper },

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
    isItemValid() {
      return this.item.number !== null && this.item.number.length > 0;
    },
  },

  methods: {
    resetItem() {
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

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (item.locality) {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (item.stratigraphy) {
        this.item.stratigraphy = item.stratigraphy;
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      }

      if (item.lithostratigraphy) {
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
  },
};
</script>
