<template>
  <div class="collection">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('collection') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('collection') ? 'green--text' : 'red--text'"
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
          <!-- NUMBER, COLLECTION_ID, TYPE  -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="collection.number"
                :color="bodyActiveColor"
                :label="$t('collection.number_detail')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="collection.collection_id"
                :color="bodyActiveColor"
                :label="$t('collection.collection_id')"
                type="number"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.type"
                :color="bodyActiveColor"
                :items="autocomplete.list_collection_type"
                :loading="autocomplete.loaders.list_collection_type"
                :item-text="commonLabel"
                :label="$t('common.type')"
              />
            </v-col>
          </v-row>

          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
              />
            </v-col>
          </v-row>

          <!-- NAME_LONG and NAME_LONG_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_long"
                :color="bodyActiveColor"
                :label="$t('collection.name_long')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.name_long_en"
                :color="bodyActiveColor"
                :label="$t('collection.name_long_en')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED INFO -->
    <v-card
      class="mt-2"
      id="block-relatedInfo"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.relatedInfo = !block.relatedInfo"
        >
          <span>{{ $t("collection.relatedInfo") }}</span>
          <v-icon right>fas fa-sitemap</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.relatedInfo = !block.relatedInfo"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.relatedInfo ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.relatedInfo" class="pa-1">
          <!-- CLASSIFICATION and AGENT -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.classification"
                :color="bodyActiveColor"
                :items="autocomplete.classification"
                :loading="autocomplete.loaders.classification"
                :item-text="classLabel"
                :label="$t('collection.classification')"
                is-searchable
                v-on:search:items="autocompleteClassificationSearch"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('collection.agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>
          </v-row>

          <!-- LOCALITY, STRATIGRAPHY and REFERENCE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.locality"
                :color="bodyActiveColor"
                :items="autocomplete.locality"
                :loading="autocomplete.loaders.locality"
                :item-text="localityLabel"
                :label="$t('common.locality')"
                is-link
                route-object="locality"
                is-searchable
                v-on:search:items="autocompleteLocalitySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.stratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy"
                :loading="autocomplete.loaders.stratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.stratigraphy')"
                is-searchable
                v-on:search:items="autocompleteStratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="collection.reference"
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
          <!-- REMARKS  -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="collection.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- NUMBER_OBJECTS and NUMBER_TYPES -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.number_objects"
                :color="bodyActiveColor"
                :label="$t('collection.number_objects')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="collection.number_types"
                :color="bodyActiveColor"
                :label="$t('collection.number_types')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- REMARKS -->
    <v-card
      class="mt-2"
      id="block-specimen"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
      v-if="$route.meta.isEdit && relatedData.specimen.count > 0"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.specimen = !block.specimen"
        >
          <span>{{ $t("collection.specimen") }}</span>
          <v-icon right>fas fa-fish</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.specimen = !block.specimen"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.specimen ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.specimen">
          <v-card
            class="table-card my-1"
            flat
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <specimen-table
              :headers="specimenTranslatedHeaders"
              :response="relatedData.specimen"
              :search-parameters="relatedData.searchParameters.specimen"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              @update:options="updateOptions"
            />
          </v-card>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import { cloneDeep } from "lodash";
import SpecimenTable from "@/components/specimen/SpecimenTable";
import { mapActions, mapState } from "vuex";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Collection",

  components: {
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    SpecimenTable,
  },

  props: {
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

  computed: {
    ...mapState("detail", ["collectionDetail"]),

    ...mapState({
      specimenHeaders(state) {
        return state.specimen.headers;
      },
    }),

    specimenTranslatedHeaders() {
      return this.specimenHeaders.map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        };
      });
    },
  },

  created() {
    if (!this.$route.meta.isEdit) {
      // Adding collection default values from local storage
      const collectionHistory = cloneDeep(this.collectionDetail);
      if (collectionHistory) {
        this.collection = collectionHistory;
      }
    }

    this.loadFullInfo();
  },

  methods: {
    ...mapActions("detail", ["saveFields"]),

    setInitialData() {
      return {
        relatedTabs: [{ name: "specimen", iconClass: "fas fa-fish" }],
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["list_collection_type"],
        autocomplete: {
          loaders: {
            type: false,
            classification: false,
            agent: false,
            locality: false,
            stratigraphy: false,
            reference: false,
            list_collection_type: false,
          },
          type: [],
          classification: [],
          agent: [],
          locality: [],
          stratigraphy: [],
          reference: [],
          list_collection_type: [],
        },
        requiredFields: ["collection_id", "number"],
        collection: {
          id: null,
          number: null,
          collection_id: null,
          type: null,
          name: null,
          name_long: null,
          name_en: null,
          name_long_en: null,
          classification: null,
          agent: null,
          locality: null,
          stratigraphy: null,
          reference: null,
          remarks: null,
          number_objects: null,
          number_types: null,
        },
        block: {
          info: true,
          relatedInfo: true,
          description: true,
          specimen: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        specimen: {
          count: 0,
          results: [],
        },
        searchParameters: {
          specimen: {
            page: 1,
            itemsPerPage: 25,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },

    updateOptions(payload) {
      this.relatedData.searchParameters.specimen[payload.key] = payload.value;
      if (
        payload.key !== "page" &&
        this.relatedData.searchParameters.specimen.page !== 1
      )
        this.relatedData.searchParameters.specimen.page = 1;

      this.loadRelatedData(["specimen"], "collection", this.$route.params.id);
    },
  },
};
</script>
