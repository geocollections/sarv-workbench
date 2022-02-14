<template>
  <div class="dataset-author-table">
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
          icon
          @click="deleteItem(item)"
          color="red"
          :title="$t('buttons.delete')"
          small
        >
          <v-icon small>far fa-trash-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.agent_type="{ item }">
        <span v-if="item.agent_type">{{ item.agent_type.value }}</span>
      </template>

      <template v-slot:item.agent="{ item }">
        <router-link
          v-if="item.agent"
          :to="{ path: '/agent/' + item.agent.id }"
          :title="$t('editAgent.editMessage')"
          class="sarv-link"
          :class="`${bodyActiveColor}--text`"
        >
          {{ item.agent.agent }}
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
              `${$t("common.new")} ${$t("header.dataset_author")}`
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.name"
                    :color="bodyActiveColor"
                    :label="$t('common.name')"
                    use-state
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.affiliation"
                    :color="bodyActiveColor"
                    :label="$t('doi.affiliation')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent_type"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent_type"
                    :loading="autocomplete.loaders.agent_type"
                    item-text="value"
                    :label="$t('doi.agent_type')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.orcid"
                    :color="bodyActiveColor"
                    :label="$t('doi.orcid')"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <autocomplete-wrapper
                    v-model="item.agent"
                    :color="bodyActiveColor"
                    :items="autocomplete.agent"
                    :loading="autocomplete.loaders.agent"
                    item-text="agent"
                    :label="$t('doi.agent')"
                    is-link
                    route-object="agent"
                    is-searchable
                    v-on:search:items="autocompleteAgentSearch"
                    @change="updateFieldsAccordingToAgent"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <input-wrapper
                    v-model="item.sort"
                    :color="bodyActiveColor"
                    :label="$t('doi.sort')"
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
import InputWrapper from "../../partial/inputs/InputWrapper";
import { cloneDeep } from "lodash";
import { fetchDoiAgentType } from "@/assets/js/api/apiCalls";
import RelatedDataDeleteDialog from "@/components/partial/RelatedDataDeleteDialog";
import relatedDataMixin from "@/mixins/relatedDataMixin";

export default {
  name: "DatasetAuthorTable",

  components: {
    RelatedDataDeleteDialog,
    AutocompleteWrapper,
    InputWrapper,
  },

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
      { text: "common.id", value: "id" },
      { text: "common.name", value: "name" },
      { text: "doi.affiliation", value: "affiliation" },
      { text: "doi.agent_type", value: "agent_type" },
      { text: "doi.orcid", value: "orcid" },
      { text: "doi.agent", value: "agent" },
      { text: "doi.sort", value: "sort" },
      {
        text: "common.actions",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],
    dialog: false,
    item: {
      name: "",
      affiliation: "",
      agent_type: {
        id: 1,
        value: "Creator",
      },
      orcid: "",
      agent: null,
      sort: "",
    },
    isNewItem: true,
    autocomplete: {
      agent_type: [],
      agent: [],
      loaders: {
        agent_type: false,
        agent: false,
      },
    },
  }),

  computed: {
    isItemValid() {
      return this.item.name !== null && this.item.name.length > 0;
    },
  },

  watch: {
    dialog() {
      this.fillListAutocompletes();
    },
  },

  methods: {
    updateFieldsAccordingToAgent(agent) {
      if (typeof agent !== "undefined" && agent !== null) {
        this.item.name = agent.agent;
        this.item.affiliation = agent.institution__institution_name_en;
        this.item.orcid = agent.orcid;
      }
    },

    resetItem() {
      this.item = {
        name: "",
        affiliation: "",
        agent_type: {
          id: 1,
          value: "Creator",
        },
        orcid: "",
        agent: null,
        sort: null,
      };
    },

    setItemFields(item) {
      this.item.id = item.id;

      this.item.agent_type = item.agent_type;

      if (item.agent) {
        this.item.agent = item.agent;
        this.autocomplete.agent.push(this.item.agent);
      }

      this.item.name = item.name;
      this.item.affiliation = item.affiliation;
      this.item.orcid = item.orcid;
      this.item.sort = item.sort;

      this.dialog = true;
    },

    fillListAutocompletes() {
      if (this.autocomplete.agent_type.length <= 1) {
        this.autocomplete.loaders.agent_type = true;
        fetchDoiAgentType().then((response) => {
          if (response.status === 200) {
            this.autocomplete.agent_type =
              response.data.count > 0 ? response.data.results : [];
          }
        });
        this.autocomplete.loaders.agent_type = false;
      }
    },
  },
};
</script>
