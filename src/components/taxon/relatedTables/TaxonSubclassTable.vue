<template>
  <div class="taxon-subclass-table">
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

      <template v-slot:item.taxon="{ item }">
        <div v-if="isUsedAsRelatedData">
          <router-link
            v-if="$route.meta.isEdit"
            :to="{ path: '/taxon/' + item.taxon }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.taxon__taxon }}
          </router-link>
          <router-link
            v-else-if="item.taxon"
            :to="{ path: '/taxon/' + item.taxon.id }"
            :title="$t('editTaxon.editMessage')"
            class="sarv-link"
            :class="`${bodyActiveColor}--text`"
          >
            {{ item.taxon.taxon }}
          </router-link>
        </div>
        <router-link
          v-else
          :to="{ path: '/taxon/' + item.taxon }"
          :title="$t('editTaxon.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.taxon__taxon }}
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
              `${$t("common.new")} ${$t("header.dataset_reference")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.taxon"
                    :color="bodyActiveColor"
                    :items="autocomplete.taxon"
                    :loading="autocomplete.loaders.taxon"
                    item-text="taxon"
                    :label="$t('taxon.taxon')"
                    use-state
                    is-link
                    route-object="taxon"
                    is-searchable
                    v-on:search:items="autocompleteTaxonSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.author_year"
                    :color="bodyActiveColor"
                    :label="$t('taxon.author_year')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.remarks"
                    :color="bodyActiveColor"
                    :label="$t('taxon.remarks')"
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

  export default {
    name: "TaxonSubclassTable",

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
        { text: "taxon.date", value: "date" },
        { text: "taxon.author_year", value: "agent" },
        { text: "taxon.remarks", value: "remarks" },
        {
          text: "common.actions",
          value: "action",
          sortable: false,
          align: "center"
        }
      ],
      dialog: false,
      item: {
        date: null,
        agent: null,
        aim: "",
        remarks: ""
      },
      isNewItem: true,
      autocomplete: {
        agent: [],
        loaders: {
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
        return this.item.aim !== null && this.item.aim.length > 0;
      }
    },

    methods: {
      cancel() {
        this.dialog = false;
        this.isNewItem = true;
        this.item = {
          date: null,
          agent: null,
          aim: "",
          remarks: ""
        };
      },

      addItem() {
        let clonedItem = cloneDeep(this.item);
        let formattedItem = this.formatItem(clonedItem);

        if (this.isNewItem) {
          this.$emit("related:add", {
            table: "drillcore_study",
            item: formattedItem,
            rawItem: this.item
          });
        } else {
          this.$emit("related:edit", {
            table: "drillcore_study",
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

        this.item.date = item.date;
        this.item.aim = item.aim;
        this.item.remarks = item.remarks;

        this.dialog = true;
      },

      deleteItem(item) {
        this.$emit("related:delete", {
          table: "drillcore_study",
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

<style scoped></style>
