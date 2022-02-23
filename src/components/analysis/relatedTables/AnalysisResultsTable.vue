<template>
  <div class="analysis-results-table">
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

      <template v-slot:item.parameter="{ item }">
        <div v-if="item.parameter">
          <div
            v-if="item.parameter.parameter_html"
            v-html="item.parameter.parameter_html"
          />
        </div>
      </template>

      <template v-slot:item.unit="{ item }">
        <div
          v-if="item.unit"
          v-translate="{ et: item.unit.value, en: item.unit.value_en }"
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
            <span class="headline">{{
              $t("analysis.relatedTables.analysis_results")
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.parameter"
                    :color="bodyActiveColor"
                    :items="autocomplete.analysis_parameter"
                    :loading="autocomplete.loaders.analysis_parameter"
                    item-text="parameter"
                    :label="$t('analysis.analysis_parameter')"
                    is-searchable
                    v-on:search:items="autocompleteAnalysisParameterSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.unit"
                    :color="bodyActiveColor"
                    :items="autocomplete.list_unit"
                    :loading="autocomplete.loaders.list_unit"
                    :item-text="commonLabel"
                    :label="$t('analysis.unit')"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_name')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_value')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_txt"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_txt')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_min"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_min')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_max"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_max')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.value_bin"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_bin')"
                    @change="item.value_bin = !item.value_bin"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value_error"
                    :color="bodyActiveColor"
                    :label="$t('analysis.relatedTables.result_error')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
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
import InputWrapper from "../../partial/inputs/InputWrapper";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "AnalysisResultsTable",

  components: {
    RelatedDataDeleteDialog,
    AutocompleteWrapper,
    CheckboxWrapper,
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
          itemsPerPage: 25,
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
      { text: "analysis.relatedTables.result_name", value: "name" },
      {
        text: "analysis.relatedTables.parameter",
        value: "parameter",
      },
      { text: "analysis.relatedTables.unit_value", value: "unit" },
      { text: "analysis.relatedTables.result_value", value: "value" },
      { text: "analysis.relatedTables.result_txt", value: "value_txt" },
      { text: "analysis.relatedTables.result_min", value: "value_min" },
      { text: "analysis.relatedTables.result_max", value: "value_max" },
      { text: "analysis.relatedTables.result_error", value: "value_error" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      parameter: null,
      unit: null,
      name: "",
      value: "",
      value_max: "",
      value_min: "",
      value_bin: false,
      value_txt: "",
      value_error: "",
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      analysis_parameter: [],
      list_unit: [],
      loaders: {
        analysis_parameter: false,
        list_unit: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return this.item.name.length > 0;
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
        parameter: null,
        unit: null,
        name: "",
        value: "",
        value_max: "",
        value_min: "",
        value_bin: false,
        value_txt: "",
        value_error: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (item.parameter) {
        this.item.parameter = item.parameter;
        this.autocomplete.analysis_parameter.push(this.item.parameter);
      }

      if (item.unit) {
        this.item.unit = item.unit;
        this.autocomplete.list_unit.push(this.item.unit);
      }

      this.item.name = item.name;
      this.item.value = item.value;
      this.item.value_max = item.value_max;
      this.item.value_min = item.value_min;
      this.item.value_bin = item.value_bin;
      this.item.value_txt = item.value_txt;
      this.item.value_error = item.value_error;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.list_unit.length <= 1) {
        this.autocomplete.loaders.list_unit = true;
        const response = await this.$api.rw.get("list_unit");
        this.autocomplete.list_unit = response?.results ?? [];
        this.autocomplete.loaders.list_unit = false;
      }
    },
  },
};
</script>
