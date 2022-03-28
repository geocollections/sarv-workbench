<template>
  <div class="specimen-location-table">
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

      <template v-slot:item.type="{ item }">
        <span
          v-if="item.type"
          v-translate="{
            et: item.type.value,
            en: item.type.value_en,
          }"
        />
      </template>

      <template v-slot:item.storage="{ item }">
        <router-link
          v-if="item.storage"
          :to="{ path: '/location/' + item.storage.id }"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.storage.location }}
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
            <span class="headline">{{
              `${$t("common.new")} ${$t("header.specimen_location")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.number"
                    :color="bodyActiveColor"
                    :label="$t('specimen_location.number')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type"
                    :loading="autocomplete.loaders.type"
                    :item-text="commonLabel"
                    :label="$t('common.type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.part"
                    :color="bodyActiveColor"
                    :label="$t('specimen_location.part')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.storage"
                    :color="bodyActiveColor"
                    :items="autocomplete.storage"
                    :loading="autocomplete.loaders.storage"
                    item-text="location"
                    :label="$t('specimen_location.storage')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteStorageSearch"
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
  name: "SpecimenLocationTable",

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
      { text: "specimen_location.number", value: "number" },
      { text: "common.type", value: "type" },
      { text: "specimen_location.part", value: "part" },
      { text: "specimen_location.storage", value: "storage" },
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
      number: "",
      type: null,
      part: "",
      storage: null,
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      type: [],
      storage: [],
      loaders: {
        type: false,
        storage: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.storage === "object" && this.item.storage !== null
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
        number: "",
        type: null,
        part: "",
        storage: null,
        remarks: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.storage) {
        this.item.storage = item.storage;
        this.autocomplete.storage.push(this.item.storage);
      }

      this.item.type = item.type;

      this.item.number = item.number;
      this.item.part = item.part;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.type.length <= 1) {
        this.autocomplete.loaders.type = true;
        const response = await this.$api.rw.get("list_specimen_type");
        this.autocomplete.type = response?.results ?? [];
        this.autocomplete.loaders.type = false;
      }
    },
  },
};
</script>
