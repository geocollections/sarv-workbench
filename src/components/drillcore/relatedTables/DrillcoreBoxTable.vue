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
          :to="{ path: '/drillcore_box/' + item.id }"
          :title="$t('editDrillcoreBox.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.number }}
        </router-link>
      </template>

      <template v-slot:item.stratigraphy_base="{ item }">
        <router-link
          v-if="item.stratigraphy_base"
          :to="{ path: '/stratigraphy/' + item.stratigraphy_base.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_base.stratigraphy,
              en: item.stratigraphy_base.stratigraphy_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.stratigraphy_top="{ item }">
        <router-link
          v-if="item.stratigraphy_top"
          :to="{ path: '/stratigraphy/' + item.stratigraphy_top.id }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy_top.stratigraphy,
              en: item.stratigraphy_top.stratigraphy_en,
            }"
          />
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
            <span class="headline">{{ $t("header.drillcore_box") }}</span>
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

    <RelatedDataDeleteDialog
      :dialog="deleteDialog"
      @cancel="cancelDeletion"
      @delete="runDeletion"
    />
  </div>
</template>

<script>
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "DrillcoreBoxTable",

  components: {
    RelatedDataDeleteDialog,
    AutocompleteWrapper,
    InputWrapper,
  },

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
        align: "center",
      },
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
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      stratigraphy_base: [],
      stratigraphy_top: [],
      loaders: {
        stratigraphy_base: false,
        stratigraphy_top: false,
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
        depth_start: "",
        depth_end: "",
        stratigraphy_base: null,
        stratigraphy_top: null,
        depth_other: "",
        number_meters: "",
        diameter: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (item.stratigraphy_base) {
        this.item.stratigraphy_base = item.stratigraphy_base;
        this.autocomplete.stratigraphy_base.push(this.item.stratigraphy_base);
      }

      if (item.stratigraphy_top) {
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
  },
};
</script>
