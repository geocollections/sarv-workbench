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
                en: item.locality.locality_en
              }"
            ></span>
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
          ></span>
        </router-link>
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

      <template v-slot:item.is_preferred="{ item }">
        <v-icon v-if="item.is_preferred" color="green" small
          >fas fa-check</v-icon
        >
        <v-icon v-else color="red" small>fas fa-times</v-icon>
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
                  <autocomplete-wrapper
                    v-model="item.locality"
                    :color="bodyActiveColor"
                    :items="autocomplete.locality"
                    :loading="autocomplete.loaders.locality"
                    :item-text="localityLabel"
                    :label="$t('site.locality')"
                    use-state
                    is-link
                    route-object="locality"
                    is-searchable
                    v-on:search:items="autocompleteLocalitySearch"
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
                    v-model="item.depth_top"
                    :color="bodyActiveColor"
                    :label="$t('site.depth_top')"
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

                <v-col cols="12" class="pa-1">
                  <textarea-wrapper
                    v-model="item.description"
                    :color="bodyActiveColor"
                    :label="$t('common.description')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.year"
                    :color="bodyActiveColor"
                    :label="$t('common.year')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
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
      { text: "common.id", value: "id" },
      { text: "site.locality", value: "locality" },
      { text: "site.depth_base", value: "depth_base" },
      { text: "site.depth_top", value: "depth_top" },
      { text: "site.rock", value: "rock" },
      { text: "site.rock_name", value: "rock_name" },
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "common.reference", value: "reference" },
      { text: "common.author", value: "agent" },
      { text: "common.description", value: "description" },
      { text: "common.year", value: "year" },
      { text: "common.remarks", value: "remarks" },
      { text: "common.is_preferred", value: "is_preferred" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      locality: null,
      depth_base: "",
      depth_top: "",
      rock: null,
      rock_name: "",
      stratigraphy: null,
      reference: null,
      agent: null,
      description: "",
      year: "",
      remarks: "",
      is_preferred: false
    },
    isNewItem: true,
    autocomplete: {
      locality: [],
      rock: [],
      stratigraphy: [],
      reference: [],
      agent: [],
      loaders: {
        locality: false,
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
    },

    isItemValid() {
      return (
        typeof this.item.locality !== "undefined" && this.item.locality !== null
      );
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        locality: null,
        depth_base: "",
        depth_top: "",
        rock: null,
        rock_name: "",
        stratigraphy: null,
        reference: null,
        agent: null,
        description: "",
        year: "",
        remarks: "",
        is_preferred: false
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

      this.item.depth_base = item.depth_base;
      this.item.depth_top = item.depth_top;
      this.item.rock_name = item.rock_name;
      this.item.description = item.description;
      this.item.year = item.year;
      this.item.remarks = item.remarks;
      this.item.is_preferred = item.is_preferred;

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
