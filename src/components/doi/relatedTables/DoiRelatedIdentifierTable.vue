<template>
  <div class="doi-related-identifier-table">
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

      <template v-slot:item.identifier_type="{ item }">
        <div v-if="item.identifier_type">{{ item.identifier_type.value }}</div>
      </template>

      <template v-slot:item.relation_type="{ item }">
        <div v-if="item.relation_type">{{ item.relation_type.value }}</div>
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
              $t("header.doi_related_identifier")
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.identifier_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.identifier_type"
                    :loading="autocomplete.loaders.identifier_type"
                    item-text="value"
                    :label="$t('doi.identifierType')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.relation_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.relation_type"
                    :loading="autocomplete.loaders.relation_type"
                    item-text="value"
                    :label="$t('doi.relatedType')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.value"
                    :color="bodyActiveColor"
                    :label="$t('doi.value')"
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
import { cloneDeep } from "lodash";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import {
  fetchDoiRelatedIdentifierType,
  fetchDoiRelationType,
} from "../../../assets/js/api/apiCalls";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "DoiRelatedIdentifierTable",

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
      { text: "doi.identifierType", value: "identifier_type" },
      { text: "doi.relatedType", value: "relation_type" },
      { text: "doi.value", value: "value" },
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
      identifier_type: null,
      relation_type: null,
      value: "",
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      identifier_type: [],
      relation_type: [],
      loaders: {
        identifier_type: false,
        relation_type: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.identifier_type !== "undefined" &&
        this.item.identifier_type !== null &&
        typeof this.item.relation_type !== "undefined" &&
        this.item.relation_type !== null
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
        identifier_type: null,
        relation_type: null,
        value: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      this.item.identifier_type = item.identifier_type;
      this.item.relation_type = item.relation_type;
      this.item.value = item.value;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    fillListAutocompletes() {
      if (this.autocomplete.identifier_type.length <= 1) {
        this.autocomplete.loaders.identifier_type = true;
        fetchDoiRelatedIdentifierType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.identifier_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.identifier_type = false;
      }
      if (this.autocomplete.relation_type.length === 0) {
        this.autocomplete.loaders.relation_type = true;
        fetchDoiRelationType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.relation_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.relation_type = false;
      }
    },
  },
};
</script>
