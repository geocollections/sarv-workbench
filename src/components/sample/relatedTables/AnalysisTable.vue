<template>
  <div class="sample-analysis-table">
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

      <template v-slot:item.id="{ item }">
        <router-link
          :to="{ path: '/analysis/' + item.id }"
          :title="$t('editAnalysis.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.id }}
        </router-link>
      </template>

      <template v-slot:item.method="{ item }">
        <span
          v-if="item.analysis_method"
          v-translate="{
            et: item.analysis_method.analysis_method,
            en: item.analysis_method.method_en,
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
            <span class="headline">{{ $t("header.sample_analysis") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.analysis_method"
                    :color="bodyActiveColor"
                    :items="autocomplete.analysis_method"
                    :loading="autocomplete.loaders.analysis_method"
                    :item-text="analysisMethodLabel"
                    :label="$t('analysis.analysis_method')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteAnalysisMethodSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.method_details"
                    :color="bodyActiveColor"
                    :label="$t('analysis.method_specification')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.mass"
                    :color="bodyActiveColor"
                    :label="$t('analysis.mass')"
                    type="number"
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
                  <date-wrapper
                    v-model="item.date_end"
                    :color="bodyActiveColor"
                    :label="$t('analysis.date_end')"
                    v-on:date:clear="item.date_end = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_end', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.date_free"
                    :color="bodyActiveColor"
                    :label="$t('analysis.date_free')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('analysis.agent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
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
import InputWrapper from "../../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import DateWrapper from "../../partial/inputs/DateWrapper";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "AnalysisTable",

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
      { text: "common.id", value: "id" },
      { text: "analysis.method", value: "method" },
      { text: "analysis.method_specification", value: "method_details" },
      { text: "analysis.mass", value: "mass" },
      { text: "common.date", value: "date" },
      { text: "common.date_end", value: "date_end" },
      { text: "analysis.date_free", value: "date_free" },
      { text: "analysis.agent", value: "agent" },
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
      analysis_method: null,
      method_details: "",
      mass: "",
      date: null,
      date_end: null,
      date_free: "",
      agent: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      analysis_method: [],
      agent: [],
      loaders: {
        analysis_method: false,
        agent: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.analysis_method !== "undefined" &&
        this.item.analysis_method !== null
      );
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
        analysis_method: null,
        method_details: "",
        mass: "",
        date: null,
        date_end: null,
        date_free: "",
        agent: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (item.agent) {
        this.item.agent = item.agent;
        this.autocomplete.agent.push(this.item.agent);
      }

      if (item.analysis_method) {
        this.item.analysis_method = item.analysis_method;
        this.autocomplete.analysis_method.push(this.item.analysis_method);
      }

      this.item.method_details = item.method_details;
      this.item.mass = item.mass;
      this.item.date = item.date;
      this.item.date_end = item.date_end;
      this.item.date_free = item.date_free;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.analysis_method.length <= 1) {
        this.autocomplete.loaders.analysis_method = true;
        const response = await this.$api.rw.get("analysis_method");
        this.autocomplete.analysis_method = response?.results ?? [];
        this.autocomplete.loaders.analysis_method = false;
      }
    },
  },
};
</script>
