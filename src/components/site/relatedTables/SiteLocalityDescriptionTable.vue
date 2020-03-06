<template>
  <div class="site-locality-description-table">
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

      <template v-slot:item.rock="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.rock__name,
              en: item.rock__name_en
            }"
          />
          <span
            v-else-if="item.rock"
            v-translate="{
              et: item.rock.name,
              en: item.rock.name_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.rock__name,
            en: item.rock__name_en
          }"
        ></div>
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
            ></span>
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
            ></span>
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
        <v-card>
          <v-card-title>
            <span class="headline">{{
              $t("header.locality_description")
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top"
                    :color="bodyActiveColor"
                    :label="$t('site.depth_top')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top_interval"
                    :color="bodyActiveColor"
                    :label="$t('site.depth_top_interval')"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base"
                    :color="bodyActiveColor"
                    :label="$t('site.depth_base')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base_interval"
                    :color="bodyActiveColor"
                    :label="$t('site.depth_base_interval')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('site.rock')"
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.rock_name"
                    :color="bodyActiveColor"
                    :label="$t('site.rock_name')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.stratigraphy"
                    :color="bodyActiveColor"
                    :items="autocomplete.stratigraphy"
                    :loading="autocomplete.loaders.stratigraphy"
                    :item-text="stratigraphyLabel"
                    :label="$t('common.stratigraphy')"
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.stratigraphy_free"
                    :color="bodyActiveColor"
                    :label="$t('site.stratigraphy_free')"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.thickness"
                    :color="bodyActiveColor"
                    :label="$t('site.thickness')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.zero_level"
                    :color="bodyActiveColor"
                    :label="$t('site.zero_level')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('common.author')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('common.reference')"
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.author_free"
                    :color="bodyActiveColor"
                    :label="$t('site.author_free')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.year"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
                  />
                </v-col>

                <v-col cols="12" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('common.remarks')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_preferred"
                    :color="bodyActiveColor"
                    :label="$t('common.is_preferred')"
                    @change="item.is_preferred = !item.is_preferred"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.is_private"
                    :color="bodyActiveColor"
                    :label="$t('common.is_private')"
                    @change="item.is_private = !item.is_private"
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
            <v-btn color="green" text @click="addItem">{{
              isNewItem ? $t("buttons.add") : $t("buttons.edit")
            }}</v-btn>
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
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import { cloneDeep } from "lodash";
import TextareaWrapper from "../../partial/inputs/TextareaWrapper";

export default {
  name: "SiteLocalityDescriptionTable",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    CheckboxWrapper
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
      // { text: "common.id", value: "id" },
      // { text: "site.locality", value: "locality" },
      { text: "site.depth_base", value: "depth_base" },
      { text: "site.depth_top", value: "depth_top" },
      { text: "site.rock", value: "rock" },
      // { text: "site.rock_name", value: "rock_name" },
      { text: "common.stratigraphy", value: "stratigraphy" },
      // { text: "common.reference", value: "reference" },
      // { text: "common.author", value: "agent" },
      { text: "common.description", value: "description" },
      // { text: "common.year", value: "year" },
      // { text: "common.remarks", value: "remarks" },
      // { text: "common.is_preferred", value: "is_preferred" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      depth_top: "",
      depth_top_interval: "",
      depth_base: "",
      depth_base_interval: "",
      rock: null,
      rock_name: "",
      stratigraphy: null,
      stratigraphy_free: "",
      description: "",
      thickness: "",
      zero_level: "",
      agent: {},
      reference: null,
      author_free: "",
      year: new Date().getFullYear(),
      remarks: "",
      is_preferred: false,
      is_private: false
    },
    isNewItem: true,
    autocomplete: {
      rock: [],
      stratigraphy: [],
      reference: [],
      agent: [],
      loaders: {
        rock: false,
        stratigraphy: false,
        reference: false,
        agent: false
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
    }
  },

  watch: {
    currentUser: {
      handler(newVal) {
        if (newVal) {
          this.item.agent = {
            id: newVal.id,
            agent: newVal.agent,
            forename: newVal.forename,
            surename: newVal.surename
          };
          this.autocomplete.agent.push(this.item.agent);
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        depth_top: "",
        depth_top_interval: "",
        depth_base: "",
        depth_base_interval: "",
        rock: null,
        rock_name: "",
        stratigraphy: null,
        stratigraphy_free: "",
        description: "",
        thickness: "",
        zero_level: "",
        agent: null,
        reference: null,
        author_free: "",
        year: new Date().getFullYear(),
        remarks: "",
        is_preferred: false,
        is_private: false
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "locality_description",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "locality_description",
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

      if (typeof item.rock !== "object" && item.rock !== null) {
        this.item.rock = {
          id: item.rock,
          name: item.rock__name,
          name_ne: item.rock__name_en
        };
        this.autocomplete.rock.push(this.item.rock);
      } else if (item.rock !== null) {
        this.item.rock = item.rock;
        this.autocomplete.rock.push(this.item.rock);
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

      if (typeof item.reference !== "object" && item.reference !== null) {
        this.item.reference = {
          id: item.reference,
          reference: item.reference__reference
        };
        this.autocomplete.reference.push(this.item.reference);
      } else {
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

      this.item.depth_top = item.depth_top;
      this.item.depth_top_interval = item.depth_top_interval;
      this.item.depth_base = item.depth_base;
      this.item.depth_base_interval = item.depth_base_interval;
      this.item.rock_name = item.rock_name;
      this.item.stratigraphy_free = item.stratigraphy_free;
      this.item.description = item.description;
      this.item.thickness = item.thickness;
      this.item.zero_level = item.zero_level;
      this.item.author_free = item.author_free;
      this.item.year = item.year;
      this.item.remarks = item.remarks;
      this.item.is_preferred = item.is_preferred;
      this.item.is_private = item.is_private;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "locality_description",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
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

<style scoped />
