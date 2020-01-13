<template>
  <div class="taxon-description-table">
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

      <template v-slot:item.language="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.language__value,
              en: item.language__value_en
            }"
          />
          <span
            v-else-if="item.language"
            v-translate="{
              et: item.language.value,
              en: item.language.value_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.language__value,
            en: item.language__value_en
          }"
        ></div>
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
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('taxon.author')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.author_free"
                    :color="bodyActiveColor"
                    :label="$t('taxon.author')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.date_free"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.language"
                    :color="bodyActiveColor"
                    :items="autocomplete.language"
                    :loading="autocomplete.loaders.language"
                    :item-text="commonLabel"
                    :label="$t('taxon.language')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                    use-state
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
import { fetchListLanguages } from "../../../assets/js/api/apiCalls";
import autocompleteMixin from "../../../mixins/autocompleteMixin";

export default {
  name: "TaxonDescriptionTable",

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
      { text: "taxon.reference", value: "reference" },
      { text: "taxon.author", value: "agent" },
      { text: "taxon.author", value: "author_free" },
      { text: "common.year", value: "date_free" },
      { text: "taxon.language", value: "language" },
      { text: "common.description", value: "description" },
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
      reference: null,
      agent: null,
      date_free: "",
      language: null,
      description: "",
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      reference: [],
      agent: [],
      language: [],
      loaders: {
        reference: false,
        agent: false,
        language: false
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
      return this.item.description !== null && this.item.description.length > 0;
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
        reference: null,
        agent: null,
        date_free: "",
        language: null,
        description: "",
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_description",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_description",
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

      if (typeof item.language !== "object" && item.language !== null) {
        this.item.language = {
          id: item.language,
          value: item.language__value,
          value_en: item.language__value_en
        };
      } else this.item.language = item.language;

      this.item.author_free = item.author_free;
      this.item.date_free = item.date_free;
      this.item.description = item.description;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_description",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.language.length === 0) {
        this.autocomplete.loaders.language = true;
        fetchListLanguages().then(response => {
          if (response.status === 200) {
            this.autocomplete.language =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.language = false;
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
