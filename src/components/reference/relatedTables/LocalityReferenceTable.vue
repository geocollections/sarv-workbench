<template>
  <div class="locality-reference-table">
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

      <template v-slot:item.locality="{ item }">
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
              en: item.locality__locality_en,
            }"
          ></span>
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
              en: item.locality.locality_en,
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.area__name="{ item }">
        <router-link
          v-if="$route.meta.isEdit"
          :to="{ path: '/area/' + item.area }"
          :title="$t('editArea.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.area__name,
              en: item.area__name_en,
            }"
          ></span>
        </router-link>
        <router-link
          v-else-if="item.area"
          :to="{ path: '/area/' + item.area.id }"
          :title="$t('editArea.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.area.name,
              en: item.area.name_en,
            }"
          ></span>
        </router-link>
      </template>

      <template v-slot:item.site__name="{ item }">
        <router-link
          v-if="$route.meta.isEdit"
          :to="{ path: '/site/' + item.site }"
          :title="$t('editSite.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.site__name,
              en: item.site__name_en,
            }"
          ></span>
        </router-link>
        <router-link
          v-else-if="item.site"
          :to="{ path: '/site/' + item.site.id }"
          :title="$t('editSite.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          <span
            v-translate="{
              et: item.site.name,
              en: item.site.name_en,
            }"
          ></span>
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
              `${$t("common.new")} ${$t("header.locality_reference")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('locality.locality')"
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.area"
                    :color="bodyActiveColor"
                    :items="autocomplete.area"
                    :loading="autocomplete.loaders.area"
                    :item-text="nameLabel"
                    :label="$t('site.area')"
                    is-link
                    route-object="area"
                    is-searchable
                    v-on:search:items="autocompleteAreaSearch"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.site"
                    :color="bodyActiveColor"
                    :items="autocomplete.site"
                    :loading="autocomplete.loaders.site"
                    :item-text="nameLabel"
                    :label="$t('sample.site')"
                    is-link
                    route-object="site"
                    is-searchable
                    v-on:search:items="autocompleteSiteSearch"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.pages"
                    :color="bodyActiveColor"
                    :label="$t('reference.pages')"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.figures"
                    :color="bodyActiveColor"
                    :label="$t('reference.figures')"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
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
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import relatedDataMixin from "@/mixins/relatedDataMixin";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";

export default {
  name: "LocalityReferenceTable",

  components: { RelatedDataDeleteDialog, TextareaWrapper, AutocompleteWrapper },

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
  },

  data: () => ({
    headers: [
      { text: "locality.locality", value: "locality" },
      { text: "site.area", value: "area__name" },
      { text: "sample.site", value: "site__name" },
      { text: "reference.pages", value: "pages" },
      { text: "reference.figures", value: "figures" },
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
      locality: null,
      area: null,
      site: null,
      pages: "",
      figures: "",
      remarks: "",
    },
    isNewItem: true,
    autocomplete: {
      locality: [],
      area: [],
      site: [],
      loaders: {
        locality: false,
        area: false,
        site: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return (
        (typeof this.item.locality === "object" &&
          this.item.locality !== null) ||
        (typeof this.item.area === "object" && this.item.area !== null) ||
        (typeof this.item.site === "object" && this.item.site !== null)
      );
    },
  },

  methods: {
    resetItem() {
      this.item = {
        locality: null,
        area: null,
        site: null,
        pages: "",
        figures: "",
        remarks: "",
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (typeof item.locality !== "object" && item.locality !== null) {
        this.item.locality = {
          id: item.locality,
          locality: item.locality__locality,
          locality_en: item.locality__locality_en,
        };
        this.autocomplete.locality.push(this.item.locality);
      } else {
        this.item.locality = item.locality;
        this.autocomplete.locality.push(this.item.locality);
      }
      if (typeof item.area !== "object" && item.area !== null) {
        this.item.area = {
          id: item.area,
          name: item.area__name,
          name_en: item.area__name_en,
        };
        this.autocomplete.area.push(this.item.area);
      } else {
        this.item.area = item.area;
        this.autocomplete.area.push(this.item.area);
      }
      if (typeof item.site !== "object" && item.site !== null) {
        this.item.site = {
          id: item.site,
          name: item.site__name,
          name_en: item.site__name_en,
        };
        this.autocomplete.site.push(this.item.site);
      } else {
        this.item.site = item.site;
        this.autocomplete.site.push(this.item.site);
      }

      this.item.pages = item.pages;
      this.item.figures = item.figures;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>
