<template>
  <div class="rock">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span>{{ $t("common.generalInfo") }}</span>
          <v-icon right>fas fa-project-diagram</v-icon>
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
          <!-- ROCK, ROCK_EN and ROCK_RU -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.name"
                :color="bodyActiveColor"
                :label="$t('rock.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.name_en"
                :color="bodyActiveColor"
                :label="$t('rock.name_en')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.name_ru"
                :color="bodyActiveColor"
                :label="$t('rock.name_ru')"
              />
            </v-col>
          </v-row>

          <!-- ROCK_TYPE, ROCK_RANK and MINDAT_ID -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="rock.rock_type"
                :color="bodyActiveColor"
                :items="autocomplete.rock_type"
                :loading="autocomplete.loaders.rock_type"
                :item-text="nameLabel"
                :label="$t('rock.rock_type')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="rock.rock_rank"
                :color="bodyActiveColor"
                :items="autocomplete.rock_rank"
                :loading="autocomplete.loaders.rock_rank"
                :item-text="nameLabel"
                :label="$t('rock.rock_rank')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.mindat_id"
                :color="bodyActiveColor"
                :label="$t('rock.mindat') + ' ID'"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- LINK_WIKIPEDIA, LINK_WIKIPEDIA_EN and LINK_WIKIPEDIA_RU -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.link_wikipedia"
                :color="bodyActiveColor"
                :label="$t('rock.link_wikipedia')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.link_wikipedia_en"
                :color="bodyActiveColor"
                :label="$t('rock.link_wikipedia') + ' EN'"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.link_wikipedia_ru"
                :color="bodyActiveColor"
                :label="$t('rock.link_wikipedia') + ' RU'"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION, DESCRIPTION_EN and DESCRIPTION_RU -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description"
                :color="bodyActiveColor"
                :label="$t('rock.description')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_en"
                :color="bodyActiveColor"
                :label="$t('rock.description') + ' EN'"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_ru"
                :color="bodyActiveColor"
                :label="$t('rock.description') + ' RU'"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION_IN_ESTONIA, DESCRIPTION_IN_ESTONIA_EN and DESCRIPTION_IN_ESTONIA_RU -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_in_estonia"
                :color="bodyActiveColor"
                :label="$t('rock.description_in_estonia')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_in_estonia_en"
                :color="bodyActiveColor"
                :label="$t('rock.description_in_estonia') + ' EN'"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_in_estonia_ru"
                :color="bodyActiveColor"
                :label="$t('rock.description_in_estonia') + ' RU'"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION_USAGE, DESCRIPTION_USAGE_EN and DESCRIPTION_USAGE_RU -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_usage"
                :color="bodyActiveColor"
                :label="$t('rock.description_usage')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_usage_en"
                :color="bodyActiveColor"
                :label="$t('rock.description_usage') + ' EN'"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <textarea-wrapper
                v-model="rock.description_usage_ru"
                :color="bodyActiveColor"
                :label="$t('rock.description_usage') + ' RU'"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION_AUTHOR -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="rock.description_author"
                :color="bodyActiveColor"
                :label="$t('rock.description_author')"
              />
            </v-col>
          </v-row>

          <!-- FORMULA, FORMULA_HTML and IMA_STATUS -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.formula"
                :color="bodyActiveColor"
                :label="$t('rock.formula')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.formula_html"
                :color="bodyActiveColor"
                :label="$t('rock.formula_html')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="rock.ima_status"
                :color="bodyActiveColor"
                :label="$t('rock.ima_status')"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY, LITHOSTRATIGRAPHY and SYNONYM_OF -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="rock.stratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy"
                :loading="autocomplete.loaders.stratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.stratigraphy')"
                is-searchable
                is-link
                route-object="stratigraphy"
                v-on:search:items="autocompleteChronostratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="rock.lithostratigraphy"
                :color="bodyActiveColor"
                :items="autocomplete.lithostratigraphy"
                :loading="autocomplete.loaders.lithostratigraphy"
                :item-text="stratigraphyLabel"
                :label="$t('common.lithostratigraphy')"
                is-searchable
                is-link
                route-object="stratigraphy"
                v-on:search:items="autocompleteLithostratigraphySearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="rock.synonym_of"
                :color="bodyActiveColor"
                :items="autocomplete.synonym_of"
                :loading="autocomplete.loaders.synonym_of"
                :item-text="nameLabel"
                :label="$t('rock.synonym_of')"
                is-searchable
                is-link
                route-object="rock"
                v-on:search:items="autocompleteRockSearch($event, 'synonym_of')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="rock.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- IN_ESTONIA, IS_RESOURCE, IS_PRIVATE, IN_PORTAL and SORT -->
          <v-row no-gutters>
            <v-col cols="12" md="2" class="pa-1">
              <checkbox-wrapper
                v-model="rock.in_estonia"
                :color="bodyActiveColor"
                :label="$t('rock.in_estonia')"
                @change="rock.in_estonia = !rock.in_estonia"
              />
            </v-col>

            <v-col cols="12" md="2" class="pa-1">
              <checkbox-wrapper
                v-model="rock.is_resource"
                :color="bodyActiveColor"
                :label="$t('rock.is_resource')"
                @change="rock.is_resource = !rock.is_resource"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <checkbox-wrapper
                v-model="rock.is_private"
                :color="bodyActiveColor"
                :label="$t('common.is_private')"
                @change="rock.is_private = !rock.is_private"
              />
            </v-col>

            <v-col cols="12" md="2" class="pa-1">
              <checkbox-wrapper
                v-model="rock.in_portal"
                :color="bodyActiveColor"
                :label="$t('rock.in_portal')"
                @change="rock.in_portal = !rock.in_portal"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="rock.sort"
                :color="bodyActiveColor"
                :label="$t('rock.sort')"
                type="number"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
    <v-card
      v-if="$route.meta.isEdit"
      class="related-tabs mt-2"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-tabs
        :background-color="bodyColor.split('n-')[0] + 'n-3'"
        show-arrows
        grow
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :active-class="bodyColor.split('n-')[0] + 'n-5 black--text'"
        hide-slider
      >
        <v-tab
          v-for="tab in computedRelatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("rock.relatedTables." + tab.name) }}</span>
          <span class="ml-1">
            <v-icon small>{{ tab.iconClass }}</v-icon>
          </span>
          <span
            v-if="relatedData[tab.name].count > 0"
            class="font-weight-bold ml-2"
            :class="`${bodyActiveColor}--text`"
          >
            {{ relatedData[tab.name].count }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card class="pa-1" flat :color="bodyColor.split('n-')[0] + 'n-5'">
          <rock-tree-table
            v-show="activeTab === 'rock_tree'"
            :response="relatedData.rock_tree"
            :search-parameters="relatedData.searchParameters.rock_tree"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-mineral-table
            v-show="activeTab === 'rock_mineral'"
            :response="relatedData.rock_mineral"
            :search-parameters="relatedData.searchParameters.rock_mineral"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-element-table
            v-show="activeTab === 'rock_element'"
            :response="relatedData.rock_element"
            :search-parameters="relatedData.searchParameters.rock_element"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-property-table
            v-show="activeTab === 'rock_property'"
            :response="relatedData.rock_property"
            :search-parameters="relatedData.searchParameters.rock_property"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-image-table
            v-show="activeTab === 'rock_image'"
            :response="relatedData.rock_image"
            :search-parameters="relatedData.searchParameters.rock_image"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-locality-table
            v-show="activeTab === 'rock_locality'"
            :response="relatedData.rock_locality"
            :search-parameters="relatedData.searchParameters.rock_locality"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-synonym-table
            v-show="activeTab === 'rock_synonym'"
            :response="relatedData.rock_synonym"
            :search-parameters="relatedData.searchParameters.rock_synonym"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-reference-table
            v-show="activeTab === 'rock_reference'"
            :response="relatedData.rock_reference"
            :search-parameters="relatedData.searchParameters.rock_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <rock-classification-table
            v-show="activeTab === 'rock_classification' && $route.meta.isEdit"
            :response="relatedData.rock_classification"
            :search-parameters="
              relatedData.searchParameters.rock_classification
            "
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <!-- PAGINATION -->
          <pagination
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="pa-1"
            :body-active-color="bodyActiveColor"
            :count="relatedData[activeTab].count"
            :paginate-by="relatedData.searchParameters[activeTab].paginateBy"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            v-on:update:page="
              relatedData.searchParameters[activeTab].page = $event
            "
            v-on:update:paginateBy="
              relatedData.searchParameters[activeTab].paginateBy = $event
            "
          />
        </v-card>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import RockMineralTable from "@/components/rock/related_tables/RockMineralTable";
import RockLocalityTable from "@/components/rock/related_tables/RockLocalityTable";
import RockElementTable from "@/components/rock/related_tables/RockElementTable";
import RockPropertyTable from "@/components/rock/related_tables/RockPropertyTable";
import RockSynonymTable from "@/components/rock/related_tables/RockSynonymTable";
import RockReferenceTable from "@/components/rock/related_tables/RockReferenceTable";
import RockTreeTable from "@/components/rock/related_tables/RockTreeTable";
import RockImageTable from "@/components/rock/related_tables/RockImageTable";
import RockClassificationTable from "@/components/rock/related_tables/RockClassificationTable";
import { mapActions } from "vuex";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Rock",

  components: {
    Pagination,
    RockClassificationTable,
    RockImageTable,
    RockTreeTable,
    RockReferenceTable,
    RockSynonymTable,
    RockPropertyTable,
    RockElementTable,
    RockLocalityTable,
    RockMineralTable,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
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

  computed: {
    computedRelatedTabs() {
      return this.relatedTabs.filter((tab) => {
        if (tab.name === "rock_classification") {
          if (this.$route.meta.isEdit) return tab;
        } else return tab;
      });
    },
  },

  created() {
    this.loadFullInfo();
  },

  watch: {
    "relatedData.searchParameters": {
      handler: function () {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "rock_tree", iconClass: "fas fa-project-diagram" },
          { name: "rock_mineral", iconClass: "far fa-gem" },
          { name: "rock_element", iconClass: "fas fa-atom" },
          { name: "rock_property", iconClass: "fas fa-sliders-h" },
          { name: "rock_image", iconClass: "far fa-image" },
          { name: "rock_locality", iconClass: "fas fa-map-marked-alt" },
          { name: "rock_synonym", iconClass: "far fa-copy" },
          { name: "rock_reference", iconClass: "fas fa-book" },
          { name: "rock_classification", iconClass: "fas fa-project-diagram" },
        ],
        activeTab: "rock_tree",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["rock_type", "rock_rank"],
        autocomplete: {
          loaders: {
            rock_type: false,
            rock_rank: false,
            rock: false,
            stratigraphy: false,
            lithostratigraphy: false,
            synonym_of: false,
          },
          rock_type: [],
          rock_rank: [],
          rock: [],
          stratigraphy: [],
          lithostratigraphy: [],
          synonym_of: [],
        },
        requiredFields: ["name"],
        rock: {
          id: null,
          name: null,
          name_en: null,
          name_ru: null,
          rock_type: null,
          rock_rank: null,
          synonym_of: null,
          sort: null,
          description: null,
          description_en: null,
          description_ru: null,
          description_in_estonia: null,
          description_in_estonia_en: null,
          description_in_estonia_ru: null,
          description_usage: null,
          description_usage_en: null,
          description_usage_ru: null,
          description_author: null,
          in_estonia: null,
          is_resource: null,
          stratigraphy: null,
          lithostratigraphy: null,
          mindat_id: null,
          link_wikipedia: null,
          link_wikipedia_en: null,
          link_wikipedia_ru: null,
          ima_status: null,
          formula: null,
          formula_html: null,
          remarks: null,
          is_private: null,
          in_portal: null,
        },
        block: {
          info: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        rock_tree: {
          count: 0,
          results: [],
        },
        rock_mineral: {
          count: 0,
          results: [],
        },
        rock_element: {
          count: 0,
          results: [],
        },
        rock_property: {
          count: 0,
          results: [],
        },
        rock_image: {
          count: 0,
          results: [],
        },
        rock_locality: {
          count: 0,
          results: [],
        },
        rock_synonym: {
          count: 0,
          results: [],
        },
        rock_reference: {
          count: 0,
          results: [],
        },
        rock_classification: {
          count: 0,
          results: [],
        },
        searchParameters: {
          rock_tree: {
            page: 1,
            paginateBy: 10,
            sortBy: ["rock_classification"],
            sortDesc: [true],
          },
          rock_mineral: {
            page: 1,
            paginateBy: 10,
            sortBy: ["sort"],
            sortDesc: [true],
          },
          rock_element: {
            page: 1,
            paginateBy: 10,
            sortBy: ["element__element"],
            sortDesc: [true],
          },
          rock_property: {
            page: 1,
            paginateBy: 10,
            sortBy: ["property_type"],
            sortDesc: [true],
          },
          rock_image: {
            page: 1,
            paginateBy: 10,
            sortBy: ["attachment"],
            sortDesc: [true],
          },
          rock_locality: {
            page: 1,
            paginateBy: 10,
            sortBy: ["locality"],
            sortDesc: [true],
          },
          rock_synonym: {
            page: 1,
            paginateBy: 10,
            sortBy: ["name"],
            sortDesc: [true],
          },
          rock_reference: {
            page: 1,
            paginateBy: 10,
            sortBy: ["reference"],
            sortDesc: [true],
          },
          rock_classification: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },
  },
};
</script>

<style scoped></style>
