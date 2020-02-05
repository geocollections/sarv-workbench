<template>
  <div class="rock-element-table">
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

      <template v-slot:item.element__element="{ item }">
        <div v-if="isUsedAsRelatedData">
          <div v-if="$route.meta.isEdit">
            {{ item.element__element }}
          </div>
          <div v-else-if="item.element">
            {{ item.element.element }}
          </div>
        </div>
        <div v-else>
          {{ item.element__element }}
        </div>
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
            <span class="headline">{{ $t("header.rock_element") }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.element"
                    :color="bodyActiveColor"
                    :items="autocomplete.element"
                    :loading="autocomplete.loaders.element"
                    item-text="element"
                    :label="$t('rock.element')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content"
                    :color="bodyActiveColor"
                    :label="$t('rock.content')"
                    type="number"
                    step="0.01"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content_max"
                    :color="bodyActiveColor"
                    :label="$t('rock.content_max')"
                    type="number"
                    step="0.01"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.oxide"
                    :color="bodyActiveColor"
                    :label="$t('rock.oxide')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content_oxide"
                    :color="bodyActiveColor"
                    :label="$t('rock.content_oxide')"
                    type="number"
                    step="0.01"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.content_oxide_max"
                    :color="bodyActiveColor"
                    :label="$t('rock.content_oxide_max')"
                    type="number"
                    step="0.01"
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
import { cloneDeep } from "lodash";
import { fetchListElement } from "../../../assets/js/api/apiCalls";

export default {
  name: "RockElementTable",

  components: {
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
      { text: "rock.element", value: "element__element" },
      { text: "rock.content", value: "content" },
      { text: "rock.content_max", value: "content_max" },
      { text: "rock.oxide", value: "oxide" },
      { text: "rock.content_oxide", value: "content_oxide" },
      { text: "rock.content_oxide_max", value: "content_oxide_max" },
      { text: "common.remarks", value: "remarks" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      element: null,
      content: "",
      content_max: "",
      oxide: "",
      content_oxide: "",
      content_oxide_max: "",
      remarks: ""
    },
    isNewItem: true,
    autocomplete: {
      element: [],
      loaders: {
        element: false
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
        typeof this.item.element !== "undefined" && this.item.element !== null
      );
    }
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.isNewItem = true;
      this.item = {
        element: null,
        content: "",
        content_max: "",
        oxide: "",
        content_oxide: "",
        content_oxide_max: "",
        remarks: ""
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "rock_element",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "rock_element",
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

      if (typeof item.element !== "object" && item.element !== null) {
        this.item.element = {
          id: item.element,
          element: item.element__element
        };
        this.autocomplete.element.push(this.item.element);
      } else if (item.element !== null) {
        this.item.element = item.element;
        this.autocomplete.element.push(this.item.element);
      }

      this.item.content = item.content;
      this.item.content_max = item.content_max;
      this.item.oxide = item.oxide;
      this.item.content_oxide = item.content_oxide;
      this.item.content_oxide_max = item.content_oxide_max;
      this.item.remarks = item.remarks;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "rock_element",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.element.length <= 1) {
        this.autocomplete.loaders.element = true;
        fetchListElement().then(response => {
          if (response.status === 200) {
            this.autocomplete.element =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.element = false;
      }
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

<style scoped></style>
