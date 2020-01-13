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

      <template v-slot:item.method="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.analysis_method__analysis_method,
              en: item.analysis_method__method_en
            }"
          />
          <span
            v-else-if="item.analysis_method"
            v-translate="{
              et: item.analysis_method.analysis_method,
              en: item.analysis_method.method_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.analysis_method__analysis_method,
            en: item.analysis_method__method_en
          }"
        ></div>
      </template>

      <template v-slot:item.agent="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/agent/' + item.agent }"
            :title="$t('editAgent.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.agent__agent }}
          </router-link>
          <router-link
            v-else-if="item.agent"
            :to="{ path: '/agent/' + item.agent.id }"
            :title="$t('editAgent.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.agent.agent }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/agent/' + item.agent }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.agent__agent }}
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
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import { fetchAnalysisMethod } from "../../../assets/js/api/apiCalls";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import DateWrapper from "../../partial/inputs/DateWrapper";

export default {
  name: "SampleAnalysisTable",

  components: {
    DateWrapper,
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
        align: "center"
      }
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
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      analysis_method: [],
      agent: [],
      loaders: {
        analysis_method: false,
        agent: false
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
      return (
        typeof this.item.analysis_method !== "undefined" &&
        this.item.analysis_method !== null
      );
    }
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        analysis_method: null,
        method_details: "",
        mass: "",
        date: null,
        date_end: null,
        date_free: "",
        agent: null,
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "analysis",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "analysis",
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

      if (typeof item.agent !== "object" && item.agent !== null) {
        this.item.agent = {
          id: item.agent,
          agent: item.agent__agent
        };
        this.autocomplete.agent.push(this.item.agent);
      } else if (item.agent !== null) {
        this.item.agent = item.agent;
        this.autocomplete.agent.push(this.item.agent);
      }

      if (
        typeof item.analysis_method !== "object" &&
        item.analysis_method !== null
      ) {
        this.item.analysis_method = {
          id: item.analysis_method,
          analysis_method: item.analysis_method__analysis_method,
          method_en: item.analysis_method__method_en
        };
      } else this.item.analysis_method = item.analysis_method;

      this.item.method_details = item.method_details;
      this.item.mass = item.mass;
      this.item.date = item.date;
      this.item.date_end = item.date_end;
      this.item.date_free = item.date_free;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "analysis",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.analysis_method.length === 0) {
        this.autocomplete.loaders.analysis_method = true;
        fetchAnalysisMethod().then(response => {
          if (response.status === 200) {
            this.autocomplete.analysis_method =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.analysis_method = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    },

    updateUserInputtedDate(fieldToBeUpdated, date) {
      if (typeof date !== "undefined" && date !== null && date.length > 0) {
        if (this.$moment(date, "YYYY-MM-DD", true).isValid()) {
          this.item[fieldToBeUpdated] = date;
        }
      }
    }
  }
};
</script>

<style scoped></style>
