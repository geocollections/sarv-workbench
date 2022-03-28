<template>
  <div class="dataset-analysis-table">
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

      <template #item.analysis="{ item }">
        <router-link
          v-if="item.analysis"
          :to="{ path: '/analysis/' + item.analysis.id }"
          :title="$t('editAnalysis.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis.id }}
        </router-link>
      </template>

      <template #item.sample="{ item }">
        <router-link
          v-if="item.analysis && item.analysis.sample"
          :to="{ path: '/sample/' + item.analysis.sample }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis.sample }}
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
              `${$t("common.new")} ${$t("header.dataset_analysis")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.analysis"
                    :color="bodyActiveColor"
                    :items="autocomplete.analysis"
                    :loading="autocomplete.loaders.analysis"
                    item-text="id"
                    :label="$t('preparation.analysis')"
                    use-state
                    is-link
                    route-object="analysis"
                    is-searchable
                    v-on:search:items="autocompleteAnalysisSearch"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
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
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import relatedDataMixin from "@/mixins/relatedDataMixin";
export default {
  name: "DatasetAnalysisTable",

  components: { RelatedDataDeleteDialog, TextareaWrapper, AutocompleteWrapper },

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
      { text: "preparation.analysis", value: "analysis" },
      { text: "preparation.sample", value: "sample", sortable: false },
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
      analysis: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      loaders: {
        analysis: false,
      },
      analysis: [],
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.analysis === "object" && this.item.analysis !== null
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        analysis: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.analysis) {
        this.item.analysis = item.analysis;
        this.autocomplete.analysis.push(this.item.analysis);
      }

      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>
