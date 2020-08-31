<template>
  <div class="specimen-identification-geology-table">
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

      <template v-slot:item.type="{ item }">
        <div v-if="isUsedAsRelatedData">
          <span
            v-if="$route.meta.isEdit"
            v-translate="{
              et: item.type__value,
              en: item.type__value_en
            }"
          />
          <span
            v-else-if="item.type"
            v-translate="{
              et: item.type.value,
              en: item.type.value_en
            }"
          />
        </div>
        <div
          v-else
          v-translate="{
            et: item.type__value,
            en: item.type__value_en
          }"
        ></div>
      </template>

      <template v-slot:item.current="{ item }">
        <v-icon v-if="item.current">fas fa-plus</v-icon>
        <v-icon v-else>fas fa-minus</v-icon>
      </template>
    </v-data-table>

    <v-toolbar
      :dense="isAddNewAvailable"
      flat
      :color="bodyColor.split('n-')[0] + 'n-5'"
    >
      <v-dialog
        v-if="isAddNewAvailable"
        v-model="dialog"
        max-width="500px"
        style="z-index: 50000"
      >
        <template v-slot:activator="{ on }">
          <v-btn :color="bodyActiveColor" small dark v-on="on">{{
            $t("buttons.add_new")
          }}</v-btn>
        </template>
        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{
              `${$t("common.new")} ${$t(
                "header.specimen_identification_geology"
              )}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.rock"
                    :color="bodyActiveColor"
                    :items="autocomplete.rock"
                    :loading="autocomplete.loaders.rock"
                    :item-text="nameLabel"
                    :label="$t('specimen_identification_geology.rock')"
                    use-state
                    is-searchable
                    v-on:search:items="autocompleteRockSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('common.name')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name_en"
                    :color="bodyActiveColor"
                    :label="$t('common.name_en')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('specimen_identification_geology.agent')"
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
                    :label="$t('specimen_identification_geology.reference')"
                    is-link
                    route-object="reference"
                    is-searchable
                    v-on:search:items="autocompleteReferenceSearch"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <date-wrapper
                    v-model="item.date_identified"
                    :color="bodyActiveColor"
                    :label="$t('common.date')"
                    v-on:date:clear="item.date_identified = null"
                    v-on:date:update="
                      updateUserInputtedDate('date_identified', $event)
                    "
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.type"
                    :color="bodyActiveColor"
                    :items="autocomplete.type"
                    :loading="autocomplete.loaders.type"
                    :item-text="commonLabel"
                    :label="$t('common.type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.current"
                    :color="bodyActiveColor"
                    :label="$t('specimen_identification_geology.current')"
                    @change="item.current = !item.current"
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

      <v-alert
        v-else
        class="mb-0"
        border="left"
        color="red lighten-5"
        dense
        elevation="3"
        icon="fas fa-info"
        >{{ $t("buttons.add_new_unavailable_specimen") }}</v-alert
      >
    </v-toolbar>
  </div>
</template>

<script>
import autocompleteMixin from "../../../mixins/autocompleteMixin";
import AutocompleteWrapper from "../../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import DateWrapper from "../../partial/inputs/DateWrapper";
import { fetchListIdentificationType } from "../../../assets/js/api/apiCalls";

export default {
  name: "SpecimenIdentificationGeologyTable",

  components: {
    DateWrapper,
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
    },
    isAddNewAvailable: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    headers: [
      { text: "specimen_identification_geology.rock", value: "rock" },
      { text: "common.name", value: "name" },
      { text: "common.name_en", value: "name_en" },
      { text: "specimen_identification_geology.agent", value: "agent" },
      { text: "common.reference", value: "reference" },
      {
        text: "common.date",
        value: "date_identified"
      },
      { text: "common.type", value: "type" },
      {
        text: "specimen_identification_geology.current",
        value: "current"
      },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    dialog: false,
    item: {
      rock: null,
      name: "",
      name_en: "",
      agent: null,
      reference: null,
      date_identified: null,
      type: null,
      current: false
    },
    isNewItem: true,
    autocomplete: {
      rock: [],
      agent: [],
      reference: [],
      type: [],
      loaders: {
        rock: false,
        agent: false,
        reference: false,
        type: false
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
      return typeof this.item.rock === "object" && this.item.rock !== null;
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
        rock: null,
        name: "",
        name_en: "",
        agent: null,
        reference: null,
        date_identified: null,
        type: null,
        current: false
      };
    },

    addItem() {
      let clonedItem = cloneDeep(this.item);
      let formattedItem = this.formatItem(clonedItem);

      if (this.isNewItem) {
        this.$emit("related:add", {
          table: "specimen_identification_geology",
          item: formattedItem,
          rawItem: this.item
        });
      } else {
        this.$emit("related:edit", {
          table: "specimen_identification_geology",
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
          name_en: item.rock__name_en
        };
        this.autocomplete.rock.push(this.item.rock);
      } else if (item.rock !== null) {
        this.item.rock = item.rock;
        this.autocomplete.rock.push(this.item.rock);
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

      if (typeof item.type !== "object" && item.type !== null) {
        this.item.type = {
          id: item.type,
          value: item.type__value,
          value_en: item.type__value_en
        };
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

      this.item.name = item.name;
      this.item.name_en = item.name_en;
      this.item.date_identified = item.date_identified;
      this.item.current = item.current === true;

      this.dialog = true;
    },

    deleteItem(item) {
      this.$emit("related:delete", {
        table: "specimen_identification_geology",
        item: item,
        onDeleteIndex: this.response.results.indexOf(item)
      });
    },

    fillListAutocompletes() {
      if (this.autocomplete.type.length <= 1) {
        this.autocomplete.loaders.type = true;
        fetchListIdentificationType().then(response => {
          if (response.status === 200) {
            this.autocomplete.type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.type = false;
      }
    },

    formatItem(item) {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === "undefined") item[key] = null;
        if (typeof item[key] === "object" && item[key] !== null) {
          item[key] = item[key].id ? item[key].id : null;
        }
      });
      return item;
    },

    updateUserInputtedDate(fieldToBeUpdated, date) {
      if (typeof date !== "undefined" && date !== null && date.length > 0) {
        if (this.$moment(date, "YYYY-MM-DD", true).isValid()) {
          this.item[fieldToBeUpdated] = date;
        }
      }
    }
  }
};
</script>

<style scoped></style>
