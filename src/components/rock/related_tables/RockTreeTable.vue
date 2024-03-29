<template>
  <div class="rock-tree-table">
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

      <template v-slot:item.rock_classification="{ item }">
        <div v-if="isUsedAsRelatedData">
          <div
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.rock_classification__name,
              en: item.rock_classification__name_en,
            }"
          />
          <div
            v-else-if="item.rock_classification"
            v-translate="{
              et: item.rock_classification.name,
              en: item.rock_classification.name_en,
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.rock_classification__name,
            en: item.rock_classification__name_en,
          }"
        />
      </template>

      <template v-slot:item.parent="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/rock/' + item.parent }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.parent__name,
                en: item.parent__name_en,
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.parent"
            :to="{ path: '/rock/' + item.parent.id }"
            :title="$t('editRock.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <div
              v-translate="{
                et: item.parent.name,
                en: item.parent.name_en,
              }"
            />
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/rock/' + item.parent }"
          :title="$t('editRock.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <div
            v-translate="{
              et: item.parent__name,
              en: item.parent__name_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.is_preferred="{ item }">
        <v-icon v-if="item.is_preferred" color="green" small
          >fas fa-check</v-icon
        >
        <v-icon v-else color="red" small>fas fa-times</v-icon>
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
            <span class="headline">{{ $t("header.rock_tree") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock_classification"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock_classification"
                    :loading="autocomplete.loaders.rock_classification"
                    :item-text="nameLabel"
                    :label="$t('rock.rock_classification')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteRockClassificationSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.parent"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('rock.parent')"
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.parent_string"
                    :color="bodyActiveColor"
                    :label="$t('rock.parent_string')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred"
                    :color="bodyActiveColor"
                    :label="$t('common.is_preferred')"
                    @change="item.is_preferred = !item.is_preferred"
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
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "RockTreeTable",

  components: {
    RelatedDataDeleteDialog,
    CheckboxWrapper,
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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "rock.rock_classification", value: "rock_classification" },
      { text: "rock.parent", value: "parent" },
      { text: "rock.parent_string", value: "parent_string" },
      { text: "common.is_preferred", value: "is_preferred" },
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
      rock_classification: null,
      parent: null,
      parent_string: "",
      is_preferred: false,
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
      return (
        typeof this.item.rock_classification !== "undefined" &&
        this.item.rock_classification !== null
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        rock_classification: null,
        parent: null,
        parent_string: "",
        is_preferred: false,
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (
        typeof item.rock_classification !== "object" &&
        item.rock_classification !== null
      ) {
        this.item.rock_classification = {
          id: item.rock_classification,
          name: item.rock_classification__name,
          name_en: item.rock_classification__name_en,
        };
        this.autocomplete.rock_classification.push(
          this.item.rock_classification
        );
      } else if (item.rock_classification !== null) {
        this.item.rock_classification = item.rock_classification;
        this.autocomplete.rock_classification.push(
          this.item.rock_classification
        );
      }

      if (typeof item.parent !== "object" && item.parent !== null) {
        this.item.parent = {
          id: item.parent,
          name: item.parent__name,
          name_en: item.parent__name_en,
        };
        this.autocomplete.rock.push(this.item.parent);
      } else if (item.parent !== null) {
        this.item.parent = item.parent;
        this.autocomplete.rock.push(this.item.parent);
      }

      this.item.parent_string = item.parent_string;
      this.item.is_preferred = item.is_preferred;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>
