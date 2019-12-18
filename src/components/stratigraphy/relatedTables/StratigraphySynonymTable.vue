<template>
  <div>
    <v-data-table
      class="stratigraphy-synonym-table"
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
        <v-icon small class="mr-2" @click="editItem(item)" color="green">far fa-edit</v-icon>
        <v-icon v-if="!$route.meta.isEdit" small @click="deleteItem(item)" color="red">far fa-trash-alt</v-icon>
      </template>

      <template v-slot:item.language="{ item }">
      <span
        v-translate="{ et: item.language__value, en: item.language__value_en }"
      />
      </template>

      <template v-slot:item.reference="{ item }">
        <router-link
          :to="{ path: '/reference/' + item.reference }"
          :title="$t('editReference.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.reference__reference }}
        </router-link>
      </template>
    </v-data-table>
    <v-toolbar dense flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <template v-slot:activator="{ on }">
          <v-btn :color="bodyActiveColor" small dark v-on="on"
          >New Item</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Stratigraphy Synonym</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.synonym"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_synonym.synonym')"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.language"
                    :color="bodyActiveColor"
                    :items="autocomplete.list_language"
                    :loading="autocomplete.loaders.list_language"
                    :item-text="commonLabel"
                    :label="$t('stratigraphy_synonym.language')"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('stratigraphy_synonym.reference')"
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_synonym.remarks')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="red" text @click="cancel">Cancel</v-btn>
            <v-btn color="green" text @click="addItem">{{ isNewItem ? 'Add' : 'Edit' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </div>
</template>

<script>
import InputWrapper from "../../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
export default {
  name: "StratigraphySynonymTable",
  components: { AutocompleteWrapper, InputWrapper },
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
    autocomplete: Object
  },
  mixins: [autocompleteMixin],
  data: () => ({
    dialog: false,
    item: {
      synonym: "",
      language: null,
      reference: null,
      remarks: ""
    },
    isNewItem: true,
    headers: [
      { text: "stratigraphy_synonym.synonym", value: "synonym" },
      { text: "stratigraphy_synonym.language", value: "language" },
      { text: "stratigraphy_synonym.reference", value: "reference" },
      { text: "stratigraphy_synonym.remarks", value: "remarks" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  computed: {
    translatedHeaders() {
      return this.headers.map(header => {
        return {
          ...header,
          text: this.$t(header.text)
        };
      });
    }
  },
  methods: {
    getGeoDetailUrl(params) {
      return `https://geocollections.info/${params.object}/${params.id}`;
    },

    cancel() {
      this.item = {
        synonym: "",
        language: null,
        reference: null,
        remarks: ""
      };
      this.dialog = false;
      this.isNewItem = true;
    },

    addItem() {
      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "stratigraphy_synonym",
          item: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "stratigraphy_synonym",
          item: this.item
        });
      }
      this.cancel();
    },

    editItem(item) {
      this.isNewItem = false;

      this.item.synonym = item.synonym;
      if (item.language) {
        this.item.language = {
          id: item.language,
          value: item.language__value,
          value_en: item.language__value_en
        };
      }
      if (item.reference) {
        this.item.reference = {
          id: item.reference,
          reference: item.reference__reference
        };
      }

      this.item.remarks = item.remarks;

      this.$emit("related:fill-autocompletes", item);
      this.dialog = true;
    },

    deleteItem(item) {
      console.log(item);
    }
  }
};
</script>

<style scoped></style>
