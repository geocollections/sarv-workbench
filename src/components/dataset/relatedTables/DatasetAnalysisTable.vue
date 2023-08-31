<template>
  <div class="dataset-analysis-table">
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
          v-if="$route.meta.isEdit"
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.analysis="{ item }">
        <router-link
          :to="{ path: '/analysis/' + item.analysis }"
          :title="$t('editAnalysis.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis }}
        </router-link>
      </template>

      <template v-slot:item.sample="{ item }">
        <router-link
          v-if="item.analysis__sample"
          :to="{ path: '/sample/' + item.analysis__sample }"
          :title="$t('editSample.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.analysis__sample }}
        </router-link>
      </template>

      <template v-slot:item.locality="{ item }">
        <router-link
          v-if="item.analysis__sample__locality"
          :to="{ path: '/locality/' + item.analysis__sample__locality }"
          :title="$t('editLocality.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.analysis__sample__locality__locality,
              en: item.analysis__sample__locality__locality_en,
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
            <span class="headline">{{ $t("header.dataset_analysis") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.analysis"
                    :color="bodyActiveColor"
                    :items="autocomplete.analysis"
                    :loading="autocomplete.loaders.analysis"
                    item-text="id"
                    :label="$t('dataset_analysis.analysis')"
                    use-state
                    is-link
                    route-object="analysis"
                    is-searchable
                    v-on:search:items="autocompleteAnalysisSearch"
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
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper.vue";
import InputWrapper from "../../partial/inputs/InputWrapper";
import relatedDataMixin from "@/mixins/relatedDataMixin";
import  cloneDeep  from "lodash/cloneDeep";
export default {
  name: "DatasetAnalysisTable",
  components: {
    AutocompleteWrapper,
    InputWrapper,
    RelatedDataDeleteDialog,
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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "preparation.analysis", value: "analysis" },
      {
        text: "analysis.method",
        value: "analysis__analysis_method__analysis_method",
      },
      {
        text: "analysis.method_specification",
        value: "analysis__method_details",
      },
      { text: "analysis.sample", value: "sample" },
      { text: "common.locality", value: "locality" },
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
      analysis: [],
      loaders: {
        analysis: false,
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
      return (
        typeof this.item.analysis === "object" && this.item.analysis !== null
      );
    },
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        analysis: null,
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "dataset_analysis",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "dataset_analysis",
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

      if (typeof item.analysis !== "object" && item.analysis !== null) {
        this.item.analysis = {
          id: item.analysis,
          analysis: item.reference__reference,
        };
        this.autocomplete.analysis.push(this.item.analysis);
      } else if (item.analysis !== null) {
        this.item.analysis = item.analysis;
        this.autocomplete.analysis.push(this.item.analysis);
      }

      this.item.remarks = item.remarks;

      this.dialog = true;
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
