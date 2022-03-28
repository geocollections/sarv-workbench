<template>
  <div class="taxon-page-table">
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

      <template v-slot:item.author="{ item }">
        <router-link
          v-if="item.author"
          :to="{ path: '/agent/' + item.author.id }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.author.agent }}
        </router-link>
      </template>

      <template v-slot:item.language="{ item }">
        <div
          v-if="item.language"
          v-translate="{ et: item.language.value, en: item.language.value_en }"
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
            <span class="headline">{{ $t("header.taxon_page") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.language"
                    :color="bodyActiveColor"
                    :items="autocomplete.language"
                    :loading="autocomplete.loaders.language"
                    item-text="iso1"
                    :label="$t('taxon.language')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.frontpage"
                    :color="bodyActiveColor"
                    :label="$t('taxon.frontpage')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.frontpage_title"
                    :color="bodyActiveColor"
                    :label="$t('taxon.frontpage_title')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.title"
                    :color="bodyActiveColor"
                    :label="$t('taxon.title')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.author"
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
                    v-model="item.author_txt"
                    :color="bodyActiveColor"
                    :label="$t('taxon.author_txt')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.date_txt"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
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
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "TaxonPageTable",

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
      { text: "taxon.language", value: "language" },
      { text: "taxon.frontpage", value: "frontpage" },
      { text: "taxon.frontpage_title", value: "frontpage_title" },
      { text: "taxon.title", value: "title" },
      { text: "taxon.author", value: "author" },
      { text: "taxon.author_txt", value: "author_txt" },
      { text: "common.year", value: "date_txt" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      language: "",
      frontpage: "",
      frontpage_title: "",
      title: "",
      author: null,
      author_txt: "",
      date_txt: "",
    },
    isNewItem: true,
    autocomplete: {
      agent: [],
      language: [],
      loaders: {
        agent: false,
        language: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return this.item.frontpage !== null && this.item.frontpage.length > 0;
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
        language: "",
        frontpage: "",
        frontpage_title: "",
        title: "",
        author: null,
        author_txt: "",
        date_txt: "",
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      if (item.author) {
        this.item.author = item.author;
        this.autocomplete.agent.push(this.item.author);
      }

      this.item.language = item.language;
      this.item.frontpage = item.frontpage;
      this.item.frontpage_title = item.frontpage_title;
      this.item.title = item.title;
      this.item.author = item.author;
      this.item.author_txt = item.author_txt;
      this.item.date_txt = item.date_txt;

      this.dialog = true;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.language.length <= 1) {
        this.autocomplete.loaders.language = true;
        const response = await this.$api.rw.get("list_language");
        this.autocomplete.language = response?.results ?? [];
        this.autocomplete.loaders.language = false;
      }
    },
  },
};
</script>
