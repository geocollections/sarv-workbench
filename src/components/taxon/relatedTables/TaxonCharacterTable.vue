<template>
  <div class="taxon-image-table">
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
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.sample_taxon="{ item }">
        <router-link
          v-if="item.sample_taxon"
          :title="$t('edit.editMessage')"
          :to="{ path: '/taxon/' + item.sample_taxon }"
          class="image-link my-1"
          style="max-width: 150px; max-height: 150px; display: block"
        >
          {{ item.sample_taxon__taxon }}
        </router-link>
      </template>
      <template v-slot:item.character="{ item }">
        <span
          v-if="$route.meta.isEdit"
          v-translate="{
            et: item.character__character,
            en: item.character__character_en,
          }"
        />
        <span
          v-else-if="item.character"
          v-translate="{
            et: item.character.value,
            en: item.character.value_en,
          }"
        />
      </template>
      <template v-slot:item.character_state="{ item }">
        <span
          v-if="$route.meta.isEdit"
          v-translate="{
            et: item.character_state__character_state,
            en: item.character_state__character_state_en,
          }"
        />
        <span
          v-else-if="item.character_state"
          v-translate="{
            et: item.character_state.value,
            en: item.character_state.value_en,
          }"
        />
      </template>
      <template v-slot:item.attachment="{ item }">
        <router-link
          v-if="item.attachment && item.attachment__uuid_filename"
          :title="$t('edit.editMessage')"
          :to="{ path: '/attachment/' + item.attachment }"
          class="my-1"
          style="max-width: 150px; max-height: 150px; display: block"
        >
          <file-preview
            class="file-preview"
            :attachment="item"
            prefix="attachment__"
            max="150"
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
            <span class="headline">{{ $t("header.taxon_character") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.character"
                    :color="bodyActiveColor"
                    :items="autocomplete.character"
                    :loading="autocomplete.loaders.character"
                    :item-text="taxonCharacterLabel"
                    :label="$t('taxon.character')"
                    is-searchable
                    v-on:search:items="autocompleteTaxonCharacterSearch"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.character_state"
                    :color="bodyActiveColor"
                    :items="autocomplete.character_state"
                    :loading="autocomplete.loaders.character_state"
                    :item-text="taxonCharacterStateLabel"
                    :label="$t('taxon.character_state')"
                    is-searchable
                    v-on:search:items="autocompleteTaxonCharacterStateSearch"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.sample_taxon"
                    :color="bodyActiveColor"
                    :items="autocomplete.sample_taxon"
                    :loading="autocomplete.loaders.sample_taxon"
                    item-text="taxon"
                    :label="$t('taxon.sample_taxon')"
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteSampleTaxonSearch"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.attachment"
                    :color="bodyActiveColor"
                    :items="autocomplete.attachment"
                    :loading="autocomplete.loaders.attachment"
                    :item-text="customLabelForAttachment"
                    :label="$t('rock.attachment')"
                    is-searchable
                    v-on:search:items="autocompletePublicAttachmentImageSearch"
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
              color="green"
              text
              :disabled="!isItemValid"
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
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import FilePreview from "@/components/FilePreview.vue";

export default {
  name: "TaxonCharacterTable",

  components: {
    FilePreview,
    AutocompleteWrapper,
  },

  mixins: [autocompleteMixin],

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
    // isUsedAsRelatedData: {
    //   type: Boolean,
    //   required: false,
    //   default: true,
    // },
  },

  data: () => ({
    headers: [
      { text: "taxon.character", value: "character" },
      { text: "taxon.character_state", value: "character_state" },
      { text: "taxon.sample_taxon", value: "sample_taxon" },
      { text: "taxon.attachment", value: "attachment" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      sample_taxon: null,
      character: null,
    },
    isNewItem: true,
    autocomplete: {
      sample_taxon: [],
      character: [],
      character_state: [],
      attachment: [],
      loaders: {
        sample_taxon: false,
        character: false,
        character_state: false,
        attachment: false,
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
        typeof this.item.character !== "undefined" &&
        this.item.character !== null
      );
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        sample_taxon: null,
        character: null,
        character_state: null,
        attachment: null,
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "taxon_character_key",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "taxon_character_key",
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

      if (typeof item.sample_taxon !== "object" && item.sample_taxon !== null) {
        this.item.sample_taxon = {
          id: item.sample_taxon,
          taxon: item.sample_taxon__taxon,
        };
        this.autocomplete.sample_taxon.push(this.item.sample_taxon);
      } else if (item.sample_taxon !== null) {
        this.item.sample_taxon = item.sample_taxon;
        this.autocomplete.sample_taxon.push(this.item.sample_taxon);
      }

      if (typeof item.character !== "object" && item.character !== null) {
        this.item.character = {
          id: item.character,
          character: item.character__character,
          character_en: item.character__character_en,
        };
        this.autocomplete.character.push(this.item.character);
      } else {
        this.item.character = item.character;
        this.autocomplete.character.push(this.item.character);
      }

      if (
        typeof item.character_state !== "object" &&
        item.character_state !== null
      ) {
        this.item.character_state = {
          id: item.character_state,
          character_state: item.character_state__character_state,
          character_state_en: item.character_state__character_state_en,
        };
        this.autocomplete.character_state.push(this.item.character_state);
      } else {
        this.item.character = item.character;
        this.autocomplete.character_state.push(this.item.character_state);
      }

      if (typeof item.attachment !== "object" && item.attachment !== null) {
        this.item.attachment = {
          id: item.attachment,
          original_filename: item.attachment__original_filename,
        };
        this.autocomplete.attachment.push(this.item.attachment);
      } else if (item.attachment !== null) {
        this.item.attachment = item.attachment;
        this.autocomplete.attachment.push(this.item.attachment);
      }

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "taxon_character_key",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
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
    customLabelForAttachment(option) {
      if (!option.id && !option.original_filename) return "";
      return `${option.id} - (${option.original_filename})`;
    },
  },
};
</script>

<style scoped>
.attachment-table-image-preview {
  max-height: 200px;
  max-width: 200px;
  border-radius: 0.25rem;
}
.image-link {
  transition: opacity 200ms ease-in;
}
.image-link:hover {
  opacity: 0.8;
}
</style>
