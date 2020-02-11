<template>
  <div class="locality-stratigraphy-table">
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

      <template v-slot:item.current="{ item }">
        <v-icon v-if="item.current" small>fas fa-check</v-icon>
        <v-icon v-else small>fas fa-minus</v-icon>
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
              $t("header.locality_stratigraphy")
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
                    :item-text="stratigraphyLabel"
                    :label="$t('common.stratigraphy')"
                    use-state
                    is-link
                    route-object="stratigraphy"
                    is-searchable
                    v-on:search:items="autocompleteStratigraphySearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.base')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.top')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base_min"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.depth_base_min')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_base_max"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.depth_base_max')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top_min"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.depth_top_min')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.depth_top_max"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.depth_top_max')"
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.thickness"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.thickness')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.reference"
                    :color="bodyActiveColor"
                    :items="autocomplete.reference"
                    :loading="autocomplete.loaders.reference"
                    item-text="reference"
                    :label="$t('stratigraphy.reference')"
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
                    :label="$t('stratigraphy.author')"
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
                    :label="$t('stratigraphy.author_free')"
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
                  <checkbox-wrapper
                    v-model="item.current"
                    :color="bodyActiveColor"
                    :label="$t('stratigraphy.is_preferred')"
                    @change="item.current = !item.current"
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
import { cloneDeep } from "lodash";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";

export default {
  name: "LocalityStratigraphyTable",

  components: {
    CheckboxWrapper,
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
      { text: "common.stratigraphy", value: "stratigraphy" },
      { text: "stratigraphy.base", value: "depth_base" },
      { text: "stratigraphy.top", value: "depth_top" },
      { text: "common.reference", value: "reference" },
      { text: "stratigraphy.author", value: "agent" },
      { text: "common.year", value: "year" },
      { text: "stratigraphy.is_preferred", value: "current" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      stratigraphy: null,
      depth_base: "",
      depth_top: "",
      depth_base_min: "",
      depth_base_max: "",
      depth_top_min: "",
      depth_top_max: "",
      thickness: "",
      reference: null,
      agent: null,
      author_free: "",
      year: "",
      current: false,
      remarks: "",
      is_private: false
    },
    isNewItem: true,
    autocomplete: {
      stratigraphy: [],
      reference: [],
      agent: [],
      loaders: {
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
        typeof this.item.stratigraphy === "object" &&
        this.item.stratigraphy !== null
      );
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        stratigraphy: null,
        depth_base: "",
        depth_top: "",
        depth_base_min: "",
        depth_base_max: "",
        depth_top_min: "",
        depth_top_max: "",
        thickness: "",
        reference: null,
        agent: null,
        author_free: "",
        year: "",
        current: false,
        remarks: "",
        is_private: false
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "locality_stratigraphy",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "locality_stratigraphy",
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

      if (typeof item.stratigraphy !== "object" && item.stratigraphy !== null) {
        this.item.stratigraphy = {
          id: item.stratigraphy_id,
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

      this.item.depth_base = item.depth_base;
      this.item.depth_top = item.depth_top;
      this.item.depth_base_min = item.depth_base_min;
      this.item.depth_base_max = item.depth_base_max;
      this.item.depth_top_min = item.depth_top_min;
      this.item.depth_top_max = item.depth_top_max;
      this.item.thickness = item.thickness;
      this.item.author_free = item.author_free;
      this.item.year = item.year;
      this.item.current = item.current === true;
      this.item.remarks = item.remarks;
      this.item.is_private = item.is_private === true;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "locality_stratigraphy",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        } else if (typeof item[key] === "string" && item[key].length === 0) {
          item[key] = null;
        }
      });
      return item;
    }
  }
};
</script>

<style scoped></style>
