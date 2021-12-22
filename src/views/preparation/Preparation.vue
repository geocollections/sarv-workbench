<template>
  <div class="preparation">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span
            :class="validate('preparation') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('preparation') ? 'green--text' : 'red--text'"
            >fas fa-project-diagram</v-icon
          >
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.info = !block.info" :color="bodyActiveColor">
          <v-icon>{{
            block.info ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.info" class="pa-1">
          <!-- NAME, SAMPLE, SAMPLE_NUMBER and ANALYSIS -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="preparation.preparation_number"
                :color="bodyActiveColor"
                :label="$t('preparation.preparation_number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.sample"
                :color="bodyActiveColor"
                :items="autocomplete.sample"
                :loading="autocomplete.loaders.sample"
                item-text="number"
                :label="$t('preparation.sample')"
                is-link
                route-object="sample"
                is-searchable
                v-on:search:items="autocompleteSampleSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="preparation.sample_number"
                :color="bodyActiveColor"
                :label="$t('preparation.sample_number')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.analysis"
                :color="bodyActiveColor"
                :items="autocomplete.analysis"
                :loading="autocomplete.loaders.analysis"
                item-text="id"
                :label="$t('preparation.analysis')"
                is-link
                route-object="analysis"
                is-searchable
                v-on:search:items="autocompleteAnalysisSearch"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- OTHER INFO -->
    <v-card
      class="mt-2"
      id="block-details"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.details = !block.details"
        >
          <span>{{ $t("preparation.details") }}</span>
          <v-icon right>fas fa-info</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.details = !block.details"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.details ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.details" class="pa-1">
          <!-- TAXON -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.taxon"
                :color="bodyActiveColor"
                :items="autocomplete.taxon"
                :loading="autocomplete.loaders.taxon"
                :item-text="classLabel"
                :label="$t('preparation.taxon')"
                is-link
                route-object="taxon"
                is-searchable
                v-on:search:items="
                  autocompleteClassificationSearch($event, 'taxon')
                "
              />
            </v-col>
          </v-row>

          <!-- AGENT, AGENT_TXT and IDENTIFICATION_AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('preparation.agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="preparation.agent_txt"
                :color="bodyActiveColor"
                :label="$t('preparation.agent_txt')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.identification_agent"
                :color="bodyActiveColor"
                :items="autocomplete.identification_agent"
                :loading="autocomplete.loaders.identification_agent"
                item-text="agent"
                :label="$t('preparation.identification_agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteIdentificationAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- DATE_PREPARED and IDENTIFICATION_DATE -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="preparation.date_prepared"
                :color="bodyActiveColor"
                :label="$t('preparation.date_prepared')"
                v-on:date:clear="preparation.date_prepared = null"
                v-on:date:update="
                  updateUserInputtedDate('date_prepared', $event)
                "
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <date-wrapper
                v-model="preparation.identification_date"
                :color="bodyActiveColor"
                :label="$t('preparation.identification_date')"
                v-on:date:clear="preparation.identification_date = null"
                v-on:date:update="
                  updateUserInputtedDate('identification_date', $event)
                "
              />
            </v-col>
          </v-row>

          <!-- DATE_PREPARED_TXT and IDENTIFICATION_REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="preparation.date_prepared_txt"
                :color="bodyActiveColor"
                :label="$t('preparation.date_prepared_txt')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="preparation.identification_remarks"
                :color="bodyActiveColor"
                :label="$t('preparation.identification_remarks')"
              />
            </v-col>
          </v-row>

          <!-- LOCATION, STORAGE and OWNER -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="preparation.location"
                :color="bodyActiveColor"
                :label="$t('preparation.location')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="preparation.owner"
                :color="bodyActiveColor"
                :items="autocomplete.owner"
                :loading="autocomplete.loaders.owner"
                item-text="agent"
                :label="$t('common.owner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteOwner2Search"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-description"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.description = !block.description"
        >
          <span>{{ $t("common.description") }}</span>
          <v-icon right>fas fa-pen-fancy</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.description = !block.description"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.description ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="preparation.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- TAXA -->
    <v-card
      class="mt-2"
      id="block-taxa"
      v-if="$route.meta.isEdit && preparation.id"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.taxa = !block.taxa">
          <span>{{ $t("preparation.taxa") }}</span>
          <v-icon right>fas fa-pastafarianism</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="block.taxa = !block.taxa" :color="bodyActiveColor">
          <v-icon>{{
            block.taxa ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.taxa" class="pa-1">
          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-start mb-3"
            flat
            tile
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card flat tile class="mx-1">
              <v-btn
                :to="{
                  name: 'Taxon add',
                  query: { preparation: JSON.stringify(preparation) },
                }"
                target="newTaxonWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
            </v-card>

            <v-card flat tile class="mx-1" v-if="relatedData.taxa.count > 0">
              <export-buttons
                filename="preparation"
                :table-data="relatedData.taxa.results"
                clipboard-class="taxon-list-table"
                :body-active-color="bodyActiveColor"
              ></export-buttons>
            </v-card>
          </v-card>

          <!-- PAGINATION -->
          <div
            v-if="relatedData.taxa.count > 10"
            class="
              d-flex
              flex-column
              justify-space-around
              flex-md-row
              justify-md-space-between
              pa-1
              mt-2
            "
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters.taxon.paginateBy"
                color="blue"
                dense
                :items="paginateByOptionsTranslated"
                item-color="blue"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters.taxon.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.taxa.count /
                      relatedData.searchParameters.taxon.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <taxon-list-table
                ref="table"
                :response="relatedData.taxa"
                :search-parameters="relatedData.searchParameters.taxon"
                v-if="relatedData.taxa.count > 0"
                :body-color="bodyColor"
                :body-active-color="bodyActiveColor"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="mt-2">
      <v-col>
        <checkbox-wrapper
          v-model="preparation.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="preparation.is_private = !preparation.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchLinkedTaxa,
  fetchPreparation,
} from "../../assets/js/api/apiCalls";

import ExportButtons from "../../components/partial/export/ExportButtons";
import debounce from "lodash/debounce";
import TaxonListTable from "../../components/taxon/TaxonListTable";
import CheckboxWrapper from "../../components/partial/inputs/CheckboxWrapper";
import InputWrapper from "../../components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "../../components/partial/inputs/AutocompleteWrapper";
import DateWrapper from "../../components/partial/inputs/DateWrapper";
import TextareaWrapper from "../../components/partial/inputs/TextareaWrapper";
import { mapState } from "vuex";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Preparation",
  components: {
    TextareaWrapper,
    DateWrapper,
    AutocompleteWrapper,
    InputWrapper,
    CheckboxWrapper,
    TaxonListTable,
    ExportButtons,
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
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
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],
  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  watch: {
    "relatedData.searchParameters.taxon": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(newVal, this.fetchLinkedTaxaWrapper, "taxa");
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    fetchLinkedTaxaWrapper() {
      return new Promise((resolve) => {
        resolve(
          fetchLinkedTaxa(
            this.relatedData.searchParameters.taxon,
            this.$route.params.id
          )
        );
      });
    },

    setInitialData() {
      return {
        relatedData: this.setDefaultRelatedData(),
        autocomplete: {
          loaders: {
            sample: false,
            analysis: false,
            taxon: false,
            agent: false,
            identification_agent: false,
            storage: false,
            owner: false,
          },
          sample: [],
          analysis: [],
          taxon: [],
          agent: [],
          identification_agent: [],
          storage: [],
          owner: [],
        },
        requiredFields: ["preparation_number"],
        preparation: {
          id: null,
          preparation_number: null,
          sample: null,
          sample_number: null,
          analysis: null,
          taxon: null,
          agent: null,
          agent_txt: null,
          date_prepared: null,
          date_prepared_txt: null,
          identification_agent: null,
          identification_date: null,
          identification_remarks: null,
          location: null,
          is_private: null,
          storage: null,
          owner: null,
          remarks: null,
        },
        block: {
          info: true,
          details: true,
          description: true,
          taxa: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        taxa: {
          count: 0,
          results: [],
        },
        count: {
          sample: 0,
        },
        searchParameters: {
          taxon: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    searchRelatedData: debounce(function (
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then((response) => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.data.count;
          this.relatedData[relatedObject].results = response.data.results;
        }
      });
    },
    50),
  },
};
</script>

<style scoped></style>
