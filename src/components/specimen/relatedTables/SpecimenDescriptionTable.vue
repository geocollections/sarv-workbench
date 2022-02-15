<template>
  <div class="specimen-description-table">
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

      <template v-slot:item.unit="{ item }">
        <span
          v-if="item.unit"
          v-translate="{
            et: item.unit.value,
            en: item.unit.value_en,
          }"
        />
      </template>

      <template v-slot:item.agent="{ item }">
        <router-link
          v-if="item.agent"
          :to="{ path: '/agent/' + item.agent.id }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.agent.agent }}
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
              `${$t("common.new")} ${$t("header.specimen_description")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.length"
                    :color="bodyActiveColor"
                    :label="$t('specimen_description.length')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.width"
                    :color="bodyActiveColor"
                    :label="$t('specimen_description.width')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.height"
                    :color="bodyActiveColor"
                    :label="$t('specimen_description.height')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.unit"
                    :color="bodyActiveColor"
                    :items="autocomplete.unit"
                    :loading="autocomplete.loaders.unit"
                    :item-text="commonLabel"
                    :label="$t('specimen_description.unit')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.mass"
                    :color="bodyActiveColor"
                    :label="$t('specimen_description.mass')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('specimen_description.agent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="item.date"
                    :color="bodyActiveColor"
                    :label="$t('common.date')"
                    v-on:date:clear="item.date = null"
                    v-on:date:update="updateUserInputtedDate('date', $event)"
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
import DateWrapper from "../../partial/inputs/DateWrapper";
import { fetchListUnit } from "../../../assets/js/api/apiCalls";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "SpecimenDescriptionTable",

  components: {
    RelatedDataDeleteDialog,
    DateWrapper,
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
      { text: "specimen_description.length", value: "length" },
      { text: "specimen_description.width", value: "width" },
      { text: "specimen_description.height", value: "height" },
      { text: "specimen_description.unit", value: "unit" },
      { text: "specimen_description.mass", value: "mass" },
      { text: "common.description", value: "description" },
      { text: "specimen_description.agent", value: "agent" },
      { text: "common.date", value: "date" },
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
      length: "",
      width: "",
      height: "",
      unit: null,
      mass: "",
      description: "",
      agent: null,
      date: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      unit: [],
      agent: [],
      loaders: {
        unit: false,
        agent: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return this.item.description !== null && this.item.description.length > 0;
    },
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    },
  },

  methods: {
    resetItem() {
      this.item = {
        length: "",
        width: "",
        height: "",
        unit: null,
        mass: "",
        description: "",
        agent: null,
        date: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.agent) {
        this.item.agent = item.agent;
        this.autocomplete.agent.push(this.item.agent);
      }

      this.item.unit = item.unit;
      this.item.length = item.length;
      this.item.width = item.width;
      this.item.height = item.height;
      this.item.mass = item.mass;
      this.item.description = item.description;
      this.item.date = item.date;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    fillListAutocompletes() {
      if (this.autocomplete.unit.length <= 1) {
        this.autocomplete.loaders.unit = true;
        fetchListUnit().then((response) => {
          if (response.status === 200) {
            this.autocomplete.unit =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.unit = false;
      }
    },
  },
};
</script>
