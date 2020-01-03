<template>
  <div class="taxon-type-specimen-table">
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

      <template v-slot:item.type_type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.type_type__value,
              en: item.type_type__value_en
            }"
          />
          <span
            v-else-if="item.type_type"
            v-translate="{
              et: item.type_type.value,
              en: item.type_type.value_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.type_type__value,
            en: item.type_type__value_en
          }"
        ></div>
      </template>

      <template v-slot:item.specimen="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/specimen/' + item.specimen }"
            :title="$t('editSpecimen.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.specimen__specimen_id }}
          </router-link>
          <router-link
            v-else-if="item.specimen"
            :to="{ path: '/specimen/' + item.specimen.id }"
            :title="$t('editSpecimen.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.specimen.specimen_id }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/specimen/' + item.specimen }"
          :title="$t('editSpecimen.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.specimen__specimen_id }}
        </router-link>
      </template>

      <template v-slot:item.reference="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/reference/' + item.reference }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.reference__reference }}
          </router-link>
          <router-link
            v-else-if="item.reference"
            :to="{ path: '/reference/' + item.reference.id }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.reference.reference }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/reference/' + item.reference }"
          :title="$t('editReference.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.reference__reference }}
        </router-link>
      </template>

      <template v-slot:item.locality="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/locality/' + item.locality }"
            :title="$t('editLocality.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.locality__locality,
                en: item.locality__locality_en
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.locality"
            :to="{ path: '/locality/' + item.locality.id }"
            :title="$t('editLocality.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.locality.locality,
                en: item.locality.locality_en
              }"
            />
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/locality/' + item.locality }"
          :title="$t('editLocality.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.locality__locality,
              en: item.locality__locality_en
            }"
          />
        </router-link>
      </template>

      <template v-slot:item.stratigraphy="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/stratigraphy/' + item.stratigraphy }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy__stratigraphy,
                en: item.stratigraphy__stratigraphy_en
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.stratigraphy"
            :to="{ path: '/stratigraphy/' + item.stratigraphy.id }"
            :title="$t('editStratigraphy.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy.stratigraphy,
                en: item.stratigraphy.stratigraphy_en
              }"
            />
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/stratigraphy/' + item.stratigraphy }"
          :title="$t('editStratigraphy.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy__stratigraphy,
              en: item.stratigraphy__stratigraphy_en
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
                    v-model="item.type_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type_type"
                    :loading="autocomplete.loaders.type_type"
                    :item-text="commonLabel"
                    :label="$t('taxon.type_type')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.repository"
                    :color="bodyActiveColor"
                    :label="$t('taxon.repository')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.specimen"
                    :color="bodyActiveColor"
                    :items="autocomplete.specimen"
                    :loading="autocomplete.loaders.specimen"
                    item-text="specimen_id"
                    :label="$t('taxon.specimen_sarv')"
                    is-link
                    route-object="specimen"
                    is-searchable
                    v-on:search:items="autocompleteSpecimenSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.specimen_number"
                    :color="bodyActiveColor"
                    :label="$t('taxon.specimen_number')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('taxon.reference')"
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('taxon.locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy"
                    :loading="autocomplete.loaders.stratigraphy"
                    :item-text="stratigraphyLabel"
                    :label="$t('taxon.stratigraphy')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('taxon.remarks')"
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
import { fetchTaxonTypeType } from "../../../assets/js/api/apiCalls";
import autocompleteMixin from "../../../mixins/autocompleteMixin";

export default {
  name: "TaxonTypeSpecimenTable",

  components: {
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
      { text: "taxon.type_type", value: "type_type" },
      { text: "taxon.repository", value: "repository" },
      { text: "taxon.specimen_sarv", value: "specimen" },
      { text: "taxon.specimen_number", value: "specimen_number" },
      { text: "taxon.reference", value: "reference" },
      { text: "taxon.locality", value: "locality" },
      { text: "taxon.stratigraphy", value: "stratigraphy" },
      { text: "taxon.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      type_type: null,
      repository: "",
      specimen: null,
      specimen_number: "",
      reference: null,
      locality: null,
      stratigraphy: null,
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      type_type: [],
      specimen: [],
      reference: [],
      locality: [],
      stratigraphy: [],
      loaders: {
        type_type: false,
        specimen: false,
        reference: false,
        locality: false,
        stratigraphy: false
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
        typeof this.item.type_type !== "undefined" &&
        this.item.type_type !== null
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
        type_type: null,
        repository: "",
        specimen: null,
        specimen_number: "",
        reference: null,
        locality: null,
        stratigraphy: null,
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_type_specimen",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_type_specimen",
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

      if (typeof item.specimen !== "object" && item.specimen !== null) {
        this.item.specimen = {
          id: item.specimen,
          specimen_id: item.specimen__specimen_id
        };
        this.autocomplete.specimen.push(this.item.specimen);
      } else if (item.specimen !== null) {
        this.item.specimen = item.specimen;
        this.autocomplete.specimen.push(this.item.specimen);
      }

      if (typeof item.reference !== "object" && item.reference !== null) {
        this.item.reference = {
          id: item.reference,
          reference: item.reference__reference
        };
        this.autocomplete.reference.push(this.item.reference);
      } else if (item.reference !== null) {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      if (typeof item.locality !== "object" && item.locality !== null) {
        this.item.locality = {
          id: item.locality,
          locality: item.locality__locality,
          locality_en: item.locality__locality_en
        };
        this.autocomplete.locality.push(this.item.locality);
      } else if (item.locality !== null) {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }

      if (typeof item.stratigraphy !== "object" && item.stratigraphy !== null) {
        this.item.stratigraphy = {
          id: item.stratigraphy,
          stratigraphy: item.stratigraphy__stratigraphy,
          stratigraphy_en: item.stratigraphy__stratigraphy_en
        };
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      } else if (item.stratigraphy !== null) {
        this.item.stratigraphy = item.stratigraphy;
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      }

      if (typeof item.type_type !== "object" && item.type_type !== null) {
        this.item.type_type = {
          id: item.type_type,
          value: item.type_type__value,
          value_en: item.type_type__value_en
        };
      } else this.item.type_type = item.type_type;

      this.item.repository = item.repository;
      this.item.specimen_number = item.specimen_number;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_type_specimen",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.type_type.length === 0) {
        this.autocomplete.loaders.type_type = true;
        fetchTaxonTypeType().then(response => {
          if (response.status === 200) {
            this.autocomplete.type_type =
              response.body.count > 0 ? response.body.results : [];
          }
        });
        this.autocomplete.loaders.type_type = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    }
  }
};
</script>

<style scoped></style>
