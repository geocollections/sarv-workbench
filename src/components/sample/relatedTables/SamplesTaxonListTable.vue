<template>
  <div class="sample-taxon-list-table">
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

      <template v-slot:item.taxon="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/taxon/' + item.id }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.taxon }}
          </router-link>
          <router-link
            v-else-if="item.taxon"
            :to="{ path: '/taxon/' + item.id }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.taxon.taxon }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/taxon/' + item.id }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.taxon }}
        </router-link>
      </template>

      <template v-slot:item.agent_identified="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/agent/' + item.agent_identified }"
            :title="$t('editAgent.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.agent_identified__agent }}
          </router-link>
          <router-link
            v-else-if="item.agent_identified"
            :to="{ path: '/agent/' + item.agent_identified.id }"
            :title="$t('editAgent.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.agent_identified.agent }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/agent/' + item.agent_identified }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.agent_identified__agent }}
        </router-link>
      </template>

      <template v-slot:item.extra="{ item }">
        <v-icon v-if="item.extra" small>fas fa-plus</v-icon>
        <v-icon v-else small>fas fa-minus</v-icon>
      </template>

      <template v-slot:item.preparation="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/preparation/' + item.preparation }"
            :title="$t('editPreparation.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.preparation_number }}
          </router-link>
          <router-link
            v-else-if="item.preparation"
            :to="{ path: '/preparation/' + item.preparation.id }"
            :title="$t('editPreparation.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.preparation.preparation_number }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/preparation/' + item.preparation }"
          :title="$t('editPreparation.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.preparation_number }}
        </router-link>
      </template>

      <template v-slot:item.is_private="{ item }">
        <v-icon v-if="item.is_private" small>fas fa-plus</v-icon>
        <v-icon v-else small>fas fa-minus</v-icon>
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
            <span class="headline">{{ $t("header.sample_taxon_list") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.taxon"
                    :color="bodyActiveColor"
                    :items="autocomplete.taxon"
                    :loading="autocomplete.loaders.taxon"
                    item-text="taxon"
                    :label="$t('taxon.taxon')"
                    use-state
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteTaxonSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('taxon.taxon_free')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.frequency"
                    :color="bodyActiveColor"
                    :label="$t('taxon.abundance')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent_identified"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('taxon.det_agent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="item.date_identified"
                    :color="bodyActiveColor"
                    :label="$t('taxon.det_date')"
                    v-on:date:clear="item.date_identified = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_identified', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.extra"
                    :color="bodyActiveColor"
                    :label="$t('taxon.extra')"
                    @change="item.extra = !item.extra"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.preparation"
                    :color="bodyActiveColor"
                    :items="autocomplete.preparation"
                    :loading="autocomplete.loaders.preparation"
                    item-text="preparation_number"
                    :label="$t('taxon.preparation')"
                    is-link
                    route-object="preparation"
                    is-searchable
                    v-on:search:items="autocompletePreparationSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_private"
                    :color="bodyActiveColor"
                    :label="$t('common.is_private')"
                    @change="item.is_private = !item.is_private"
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
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import DateWrapper from "../../partial/inputs/DateWrapper";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "SampleTaxonListTable",

  components: {
    CheckboxWrapper,
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
      { text: "taxon.taxon", value: "taxon" },
      { text: "taxon.taxon_free", value: "name" },
      { text: "taxon.abundance", value: "frequency" },
      { text: "taxon.det_agent", value: "agent_identified" },
      { text: "taxon.det_date", value: "date_identified" },
      { text: "taxon.extra", value: "extra" },
      { text: "taxon.preparation", value: "preparation" },
      { text: "common.is_private", value: "is_private" },
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
      taxon: null,
      name: "",
      frequency: "",
      agent_identified: null,
      date_identified: "",
      extra: "",
      preparation: null,
      is_private: false,
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      taxon: [],
      agent: [],
      preparation: [],
      loaders: {
        taxon: false,
        agent: false,
        preparation: false
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
      return typeof this.item.taxon === "object" && this.item.taxon !== null;
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        taxon: null,
        name: "",
        frequency: "",
        agent_identified: null,
        date_identified: "",
        extra: "",
        preparation: null,
        is_private: false,
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_list",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_list",
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

      if (typeof item.taxon !== "object" && item.taxon !== null) {
        this.item.taxon = {
          id: item.taxon,
          taxon: item.taxon__taxon
        };
        this.autocomplete.taxon.push(this.item.taxon);
      } else if (item.taxon !== null) {
        this.item.taxon = item.taxon;
        this.autocomplete.taxon.push(this.item.taxon);
      }

      if (
        typeof item.agent_identified !== "object" &&
        item.agent_identified !== null
      ) {
        this.item.agent_identified = {
          id: item.agent_identified,
          agent: item.agent_identified__agent
        };
        this.autocomplete.agent.push(this.item.agent_identified);
      } else if (item.agent_identified !== null) {
        this.item.agent_identified = item.agent_identified;
        this.autocomplete.agent.push(this.item.agent_identified);
      }

      if (typeof item.preparation !== "object" && item.preparation !== null) {
        this.item.preparation = {
          id: item.preparation,
          preparation_number: item.preparation_number
        };
        this.autocomplete.preparation.push(this.item.preparation);
      } else if (item.preparation !== null) {
        this.item.preparation = item.preparation;
        this.autocomplete.preparation.push(this.item.preparation);
      }

      this.item.name = item.name;
      this.item.frequency = item.frequency;
      this.item.date_identified = item.date_identified;
      this.item.extra = item.extra === true;
      this.item.preparation_number = item.preparation_number;
      this.item.is_private = item.is_private === true;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_list",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
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
