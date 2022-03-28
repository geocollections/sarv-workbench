<template>
  <div class="keyword-relation-table">
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

      <template #item.keyword_relation_type="{ item }">
        <div
          v-if="item.keyword_relation_type"
          v-translate="{
            et: item.keyword_relation_type.name,
            en: item.keyword_relation_type.name_en,
          }"
        />
      </template>

      <template #item.related_keyword="{ item }">
        <router-link
          v-if="item.related_keyword"
          :to="{ path: '/keyword/' + item.related_keyword.id }"
          :title="$t('editKeyword.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.related_keyword.keyword }}
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
            <span class="headline">{{ $t("header.keyword_relation") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.keyword_relation_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.keyword_relation_type"
                    :loading="autocomplete.loaders.keyword_relation_type"
                    :item-text="nameLabel"
                    :label="$t('keyword.keyword_relation_type')"
                    use-state
                    is-searchable
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.related_keyword"
                    :color="bodyActiveColor"
                    :items="autocomplete.keyword"
                    :loading="autocomplete.loaders.keyword"
                    item-text="keyword"
                    :label="$t('keyword.related_keyword')"
                    use-state
                    is-link
                    route-object="keyword"
                    is-searchable
                    v-on:search:items="
                      autocompleteKeywordSearch($event, 'keyword')
                    "
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
import autocompleteMixin from "@/mixins/autocompleteMixin";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import relatedDataMixin from "@/mixins/relatedDataMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";

export default {
  name: "KeywordRelationTable",

  components: { RelatedDataDeleteDialog, AutocompleteWrapper },

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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
    baseTerm: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data: () => ({
    headers: [
      { text: "keyword.keyword_relation_type", value: "keyword_relation_type" },
      { text: "keyword.related_keyword", value: "related_keyword" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      keyword_relation_type: null,
      related_keyword: null,
    },
    isNewItem: true,
    autocomplete: {
      keyword_relation_type: [],
      keyword: [],
      loaders: {
        keyword_relation_type: false,
        keyword: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        typeof this.item.keyword_relation_type === "object" &&
        this.item.keyword_relation_type !== null &&
        typeof this.item.related_keyword === "object" &&
        this.item.related_keyword !== null
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
        keyword_relation_type: null,
        related_keyword: null,
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (item.keyword_relation_type) {
        this.item.keyword_relation_type = item.keyword_relation_type;
        this.autocomplete.keyword_relation_type.push(
          this.item.keyword_relation_type
        );
      }

      if (item.related_keyword) {
        this.item.related_keyword = item.related_keyword;
        this.autocomplete.keyword.push(this.item.related_keyword);
      }

      this.dialog = true;
    },

    async fillListAutocompletes() {
      if (this.autocomplete.keyword_relation_type.length <= 1) {
        this.autocomplete.loaders.keyword_relation_type = true;
        const response = await this.$api.rw.get("keyword_relation_type");
        this.autocomplete.keyword_relation_type = response?.results ?? [];
        this.autocomplete.loaders.keyword_relation_type = false;
      }
    },
  },
};
</script>
