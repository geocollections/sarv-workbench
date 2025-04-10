<template>
  <div class="specimen-identification-table">
    <v-data-table
      mobile-breakpoint="0"
      :headers="translatedHeaders"
      hide-default-footer
      dense
      :items="response.results"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
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

      <template v-slot:item.taxon="{ item }">
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
      </template>
      <template v-slot:item.is_valid="{ item }">
        <v-icon v-if="item.taxon__is_valid" small>fas fa-plus</v-icon>
        <v-icon v-else small>fas fa-minus</v-icon>
      </template>

      <template v-slot:item.agent="{ item }">
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
      </template>

      <template v-slot:item.reference="{ item }">
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
      </template>

      <template v-slot:item.identification_type="{ item }">
        <span
          v-if="$route.meta.isEdit"
          v-translate="{
            et: item.identification_type__value,
            en: item.identification_type__value_en,
          }"
        />
        <span
          v-else-if="item.identification_type"
          v-translate="{
            et: item.identification_type.value,
            en: item.identification_type.value_en,
          }"
        />
      </template>

      <template v-slot:item.current="{ item }">
        <v-icon v-if="item.current" small>fas fa-plus</v-icon>
        <v-icon v-else small>fas fa-minus</v-icon>
      </template>
    </v-data-table>

    <v-toolbar flat :color="bodyColor.split('n-')[0] + 'n-5'">
      <v-dialog v-model="dialog" max-width="500px" style="z-index: 50000">
        <template v-slot:activator="{ on }">
          <v-btn
            :color="bodyActiveColor"
            small
            class="white--text"
            :disabled="!isAddNewAvailable"
            v-on="on"
            >{{ $t("buttons.add_new") }}</v-btn
          >
        </template>

        <v-card :color="bodyColor.split('n-')[0] + 'n-5'">
          <v-card-title>
            <span class="headline">{{
              `${$t("common.new")} ${$t("header.specimen_identification")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper-new
                    v-model="item.taxon"
                    :route="taxonRoute"
                    :label="$t('specimen_identification.taxon')"
                    item-text="taxon"
                    item-value="id"
                    :rules="[taxonIsValidRule]"
                    :suggestions="autocomplete.taxon"
                    v-on:search:items="autocompleteTaxonSearch"
                  >
                    <template #item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title>{{ item.taxon }}</v-list-item-title>
                      </v-list-item-content>
                      <v-tooltip right color="red" open-delay="500">
                        <template v-slot:activator="{ on, attrs }">
                          <v-list-item-icon
                            v-if="!item.is_valid"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon right color="red"
                              >fas fa-exclamation</v-icon
                            >
                          </v-list-item-icon>
                        </template>
                        {{ $t("taxon.is_invalid") }}
                      </v-tooltip>
                    </template>
                  </autocomplete-wrapper-new>
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('common.name')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('specimen_identification.agent')"
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
                    :label="$t('specimen_identification.reference')"
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
                    v-model="item.identification_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.identification_type"
                    :loading="autocomplete.loaders.identification_type"
                    :item-text="commonLabel"
                    :label="$t('common.type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <checkbox-wrapper
                    v-model="item.current"
                    :color="bodyActiveColor"
                    :label="$t('specimen_identification.current')"
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
    </v-toolbar>

    <div class="mx-3" v-if="!isAddNewAvailable">
      <v-alert
        border="right"
        type="info"
        colored-border
        prominent
        dense
        elevation="3"
        icon="fas fa-info"
        >{{ $t("buttons.is_non_fossil") }}</v-alert
      >
    </div>

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
import AutocompleteWrapperNew from "../../partial/inputs/AutocompleteWrapperNew";
import InputWrapper from "../../partial/inputs/InputWrapper";
import CheckboxWrapper from "../../partial/inputs/CheckboxWrapper";
import DateWrapper from "../../partial/inputs/DateWrapper";
import { fetchListIdentificationType } from "../../../assets/js/api/apiCalls";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "SpecimenIdentificationTable",

  components: {
    RelatedDataDeleteDialog,
    DateWrapper,
    CheckboxWrapper,
    AutocompleteWrapper,
    AutocompleteWrapperNew,
    InputWrapper,
  },

  mixins: [autocompleteMixin, relatedDataMixin],

  props: {
    response: {
      type: Object,
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
    isAddNewAvailable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data: () => ({
    headers: [
      { text: "specimen_identification.taxon", value: "taxon" },
      { text: "taxon.is_valid", value: "is_valid" },
      { text: "common.name", value: "name" },
      { text: "specimen_identification.agent", value: "agent" },
      { text: "common.reference", value: "reference" },
      {
        text: "common.date",
        value: "date_identified",
      },
      { text: "common.type", value: "identification_type" },
      {
        text: "specimen_identification.current",
        value: "current",
      },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    item: {
      taxon: null,
      name: "",
      agent: null,
      reference: null,
      date_identified: null,
      identification_type: null,
      current: true,
    },
    autocomplete: {
      taxon: [],
      agent: [],
      reference: [],
      identification_type: [],
      loaders: {
        taxon: false,
        agent: false,
        reference: false,
        identification_type: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return typeof this.item.taxon === "object" && this.item.taxon !== null;
    },
    taxonRoute() {
      if (this.item.taxon) return `/taxon/${this.item.taxon.id}`;
      return null;
    },
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    },
  },

  methods: {
    taxonIsValidRule(item) {
      if (item === null) return true;
      if (!item.is_valid)
        return this.$t("specimen_identification.taxon_is_invalid");
      return true;
    },
    resetItem() {
      this.item = {
        taxon: null,
        name: "",
        agent: null,
        reference: null,
        date_identified: null,
        identification_type: null,
        current: true,
      };
    },

    setItemFields(item) {
      if (this.$route.meta.isEdit) this.item.id = item.id;

      if (typeof item.taxon !== "object" && item.taxon !== null) {
        this.item.taxon = {
          id: item.taxon,
          taxon: item.taxon__taxon,
          is_valid: item.taxon__is_valid,
        };
        this.autocomplete.taxon = [this.item.taxon];
      } else if (item.taxon !== null) {
        this.item.taxon = item.taxon;
        this.autocomplete.taxon = [this.item.taxon];
      }

      if (typeof item.agent !== "object" && item.agent !== null) {
        this.item.agent = {
          id: item.agent,
          agent: item.agent__agent,
        };
        this.autocomplete.agent.push(this.item.agent);
      } else if (item.agent !== null) {
        this.item.agent = item.agent;
        this.autocomplete.agent.push(this.item.agent);
      }

      if (
        typeof item.identification_type !== "object" &&
        item.identification_type !== null
      ) {
        this.item.identification_type = {
          id: item.identification_type,
          value: item.identification_type__value,
          value_en: item.identification_type__value_en,
        };
      }

      if (typeof item.reference !== "object" && item.reference !== null) {
        this.item.reference = {
          id: item.reference,
          reference: item.reference__reference,
        };
        this.autocomplete.reference.push(this.item.reference);
      } else if (item.reference !== null) {
        this.item.reference = item.reference;
        this.autocomplete.reference.push(this.item.reference);
      }

      this.item.name = item.name;
      this.item.date_identified = item.date_identified;
      this.item.current = item.current === true;
    },

    fillListAutocompletes() {
      if (this.autocomplete.identification_type.length <= 1) {
        this.autocomplete.loaders.identification_type = true;
        fetchListIdentificationType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.identification_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.identification_type = false;
      }
    },
  },
};
</script>

<style scoped></style>
