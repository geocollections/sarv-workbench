<template>
  <div class="keyword">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('keyword') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('keyword') ? 'green--text' : 'red--text'"
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
          <!-- KEYWORD, LANGAUGE and KEYWORD CATEGORY -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="keyword.keyword"
                :color="bodyActiveColor"
                :label="$t('keyword.keyword')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="keyword.language"
                :color="bodyActiveColor"
                :items="autocomplete.list_language"
                :loading="autocomplete.loaders.list_language"
                :item-text="commonLabel"
                :label="$t('keyword.language')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="keyword.keyword_category"
                :color="bodyActiveColor"
                :items="autocomplete.keyword_category"
                :loading="autocomplete.loaders.keyword_category"
                :item-text="nameLabel"
                :label="$t('keyword.keyword_category')"
                is-searchable
                v-on:search:items="autocompleteKeywordCategorySearch"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- DESCRIPTION -->
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
          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="keyword.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-model="keyword.description"
                :label="$t('common.description')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
    <v-card
      v-if="$route.meta.isEdit && relatedTabs.length > 0"
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
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("keyword.relatedTables." + tab.name) }}</span>
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
          <keyword-relation-table
            v-show="activeTab === 'keyword_relation'"
            :response="relatedData.keyword_relation"
            :search-parameters="relatedData.searchParameters.keyword_relation"
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
            :items-per-page="relatedData.searchParameters[activeTab].itemsPerPage"
            :options="paginateByOptionsTranslated"
            :page="relatedData.searchParameters[activeTab].page"
            @update:options="handleUpdateOptions({ ...$event, activeTab })"
          />
        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- IS_PRIMARY and IS_PRIVATE -->
    <div class="d-flex flex-wrap mt-2">
      <checkbox-wrapper
        v-model="keyword.is_primary"
        :color="bodyActiveColor"
        :label="$t('keyword.is_primary')"
        @change="updateIsPrimary"
      />
      <checkbox-wrapper
        v-model="keyword.is_preferred"
        :color="bodyActiveColor"
        :label="$t('keyword.is_preferred')"
        @change="keyword.is_preferred = !keyword.is_preferred"
      />
      <checkbox-wrapper
        v-model="keyword.is_private"
        :color="bodyActiveColor"
        :label="$t('common.is_private')"
        @change="keyword.is_private = !keyword.is_private"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import Editor from "@/components/partial/inputs/Editor";
import KeywordRelationTable from "@/components/keyword/relatedTables/KeywordRelationTable";
import KeywordRelationReverseTable from "@/components/keyword/relatedTables/KeywordRelationReverseTable";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Keyword",
  components: {
    Pagination,
    KeywordRelationTable,
    Editor,
    InputWrapper,
    AutocompleteWrapper,
    CheckboxWrapper,
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
    detailViewUtilsMixin,
    globalUtilsMixin,
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    this.loadFullInfo();
  },

  methods: {
    updateIsPrimary() {
      this.keyword.is_primary = !this.keyword.is_primary;
      if (this.keyword.is_primary)
        this.keyword.is_preferred = this.keyword.is_primary;
    },

    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object,
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "keyword_relation", iconClass: "fas fa-book-open" },
        ],
        activeTab: "keyword_relation",
        relatedData: this.setDefaultRelatedData(),
        listOfAutocompleteTables: ["list_language"],
        autocomplete: {
          loaders: {
            list_language: false,
            keyword_category: false,
          },
          list_language: [],
          keyword_category: [],
        },
        requiredFields: ["keyword", "language"],
        keyword: {
          id: null,
          keyword: null,
          language: null,
          keyword_category: null,
          remarks: null,
          description: null,
          is_primary: null,
          is_preferred: null,
          is_private: false,
        },
        block: {
          info: true,
          description: false,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        keyword_relation: {
          count: 0,
          results: [],
        },
        searchParameters: {
          keyword_relation: {
            page: 1,
            itemsPerPage: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
      };
    },
  },
};
</script>
