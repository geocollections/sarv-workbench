<template>
  <div class="reference-stratigraphy-table">
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

      <template v-slot:item.stratigraphy="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/stratigraphy/' + item.stratigraphy }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            <span
              v-translate="{
                et: item.stratigraphy__stratigraphy,
                en: item.stratigraphy__stratigraphy_en,
              }"
            />
          </router-link>
          <router-link
            v-else-if="item.stratigraphy"
            :to="{ path: '/stratigraphy/' + item.stratigraphy.id }"
            :title="$t('editReference.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.stratigraphy.stratigraphy }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/stratigraphy/' + item.stratigraphy }"
          :title="$t('editReference.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.stratigraphy__stratigraphy,
              en: item.stratigraphy__stratigraphy_en,
            }"
          />
        </router-link>
      </template>

      <template v-slot:is_preferred_age="{ item }">
        <v-icon v-if="item.is_preferred_age">fas fa-plus</v-icon>
        <v-icon v-else>fas fa-minus</v-icon>
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
              `${$t("common.new")} ${$t("header.stratigraphy_reference")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy"
                    :loading="autocomplete.loaders.stratigraphy"
                    :item-text="
                      $i18n.locale === 'ee' ? 'stratigraphy' : 'stratigraphy_en'
                    "
                    :label="$t('stratigraphy_reference.stratigraphy')"
                    use-state
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.content')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content_en"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.content_en')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.age_base"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.age_base')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.age_base_error"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.age_base_error')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.age_top"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.age_top')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred_age"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.is_preferred_age')"
                    @change="item.is_preferred_age = !item.is_preferred_age"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.pages"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.pages')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.figures"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy_reference.figures')"
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
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import  cloneDeep  from "lodash/cloneDeep";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "StratigraphyReferenceTable",

  components: { CheckboxWrapper, AutocompleteWrapper, InputWrapper },

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
    isUsedAsRelatedData: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "stratigraphy_reference.content", value: "content" },
      { text: "stratigraphy_reference.content_en", value: "content_en" },
      { text: "stratigraphy_reference.age_base", value: "age_base" },
      {
        text: "stratigraphy_reference.age_base_error",
        value: "age_base_error",
      },
      { text: "stratigraphy_reference.age_top", value: "age_top" },
      {
        text: "stratigraphy_reference.is_preferred_age",
        value: "is_preferred_age",
      },
      { text: "stratigraphy_reference.pages", value: "pages" },
      { text: "stratigraphy_reference.figures", value: "figures" },
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
      stratigraphy: null,
      content: "",
      content_en: "",
      age_base: null,
      age_base_error: null,
      age_top: null,
      is_preferred_age: false,
      pages: "",
      figures: "",
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      stratigraphy: [],
      loaders: {
        stratigraphy: false,
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
        typeof this.item.stratigraphy === "object" &&
        this.item.stratigraphy !== null
      );
    },
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        stratigraphy: null,
        content: "",
        content_en: "",
        age_base: null,
        age_base_error: null,
        age_top: null,
        is_preferred_age: false,
        pages: "",
        figures: "",
        remarks: "",
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "stratigraphy_reference",
          item: formattedItem,
          rawItem: this.item,
        });
      } else {
        this.$emit("related:edit", {
          table: "stratigraphy_reference",
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

      if (typeof item.stratigraphy !== "object" && item.stratigraphy !== null) {
        this.item.stratigraphy = {
          id: item.stratigraphy,
          stratigraphy: item.stratigraphy__stratigraphy,
        };
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      } else {
        this.item.stratigraphy = item.stratigraphy;
        this.autocomplete.stratigraphy.push(this.item.stratigraphy);
      }

      this.item.content = item.content;
      this.item.content_en = item.content_en;
      this.item.age_base = item.age_base;
      this.item.age_base_error = item.age_base_error;
      this.item.age_top = item.age_top;
      this.item.is_preferred_age = item.is_preferred_age;
      this.item.pages = item.pages;
      this.item.figures = item.figures;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "stratigraphy_reference",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item),
      });
    },

    formatItem(item) {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
    },
  },
};
</script>

<style scoped></style>
