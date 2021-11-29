<template>
  <div class="taxon-synonym-table">
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
            <span class="headline">{{ $t("header.taxon_synonym") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.taxon_synonym"
                    :color="bodyActiveColor"
                    :label="$t('taxon.synonym')"
                    use-state
                    name="taxon_synonym"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <input-wrapper
                    v-model="item.author"
                    :color="bodyActiveColor"
                    :label="$t('taxon.author')"
                    name="author"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <input-wrapper
                    v-model="item.year"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
                    type="number"
                    name="year"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.pages"
                    :color="bodyActiveColor"
                    :label="$t('taxon.pages')"
                    name="pages"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.figures"
                    :color="bodyActiveColor"
                    :label="$t('taxon.figures')"
                    name="figures"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
                    name="remarks"
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
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "TaxonSynonymTable",

  components: {
    RelatedDataDeleteDialog,
    TextareaWrapper,
    InputWrapper,
  },

  mixins: [relatedDataMixin],

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
      { text: "common.year", value: "year" },
      { text: "taxon.synonym", value: "taxon_synonym" },
      { text: "taxon.author", value: "author" },
      { text: "taxon.pages", value: "pages" },
      { text: "taxon.figures", value: "figures" },
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
      taxon_synonym: "",
      author: "",
      year: "",
      pages: "",
      figures: "",
      remarks: "",
    },
    isNewItem: true,
  }),

  computed: {
    isItemValid() {
      return (
        this.item.taxon_synonym !== null && this.item.taxon_synonym.length > 0
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        taxon_synonym: "",
        author: "",
        year: "",
        pages: "",
        figures: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      this.item.taxon_synonym = item.taxon_synonym;
      this.item.author = item.author;
      this.item.year = item.year;
      this.item.pages = item.pages;
      this.item.figures = item.figures;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>
