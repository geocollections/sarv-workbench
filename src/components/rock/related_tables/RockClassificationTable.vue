<template>
  <div class="rock-classification-table">
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

      <template v-slot:item.rock="{ item }">
        <router-link
          v-if="item.rock"
          :to="{ path: '/rock/' + item.rock.id }"
          :title="$t('editRock.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div
            v-translate="{
              et: item.rock.name,
              en: item.rock.name_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.rock_classification="{ item }">
        <div
          v-if="item.rock_classification"
          v-translate="{
            et: item.rock_classification.name,
            en: item.rock_classification.name_en,
          }"
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
            <span class="headline">{{ $t("header.rock_classification") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('rock.rock')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock_classification"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock_classification"
                    :loading="autocomplete.loaders.rock_classification"
                    :item-text="nameLabel"
                    :label="$t('rock.rock_classification')"
                    is-searchable
                    v-on:search:items="autocompleteRockClassificationSearch"
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
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "RockClassificationTable",

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
      { text: "rock.rock", value: "rock" },
      { text: "rock.rock_classification", value: "rock_classification" },
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
      rock: null,
      rock_classification: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      rock_classification: [],
      rock: [],
      loaders: {
        rock_classification: false,
        rock: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return typeof this.item.rock !== "undefined" && this.item.rock !== null;
    },
  },

  methods: {
    resetItem() {
      this.item = {
        rock: null,
        rock_classification: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;
      this.item.parent = this.$route.params.id;

      if (item.rock) {
        this.item.rock = item.rock;
        this.autocomplete.rock.push(this.item.rock);
      }

      if (item.rock_classification) {
        this.item.rock_classification = item.rock_classification;
        this.autocomplete.rock_classification.push(
          this.item.rock_classification
        );
      }

      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>
