<template>
  <div class="library">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('library') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('library') ? 'green--text' : 'red--text'"
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
          <!-- AUTHOR AND YEAR -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="library.author_txt"
                :color="bodyActiveColor"
                :label="$t('library.author_txt')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="library.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- TITLE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title"
                :color="bodyActiveColor"
                :label="$t('library.title')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_short"
                :color="bodyActiveColor"
                :label="$t('library.title_short')"
              />
            </v-col>
          </v-row>

          <!-- TITLE_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_en"
                :color="bodyActiveColor"
                :label="$t('library.title_en')"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.title_short_en"
                :color="bodyActiveColor"
                :label="$t('library.title_short_en')"
              />
            </v-col>
          </v-row>

          <!-- KEYWORDS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <input-wrapper
                v-model="library.keywords"
                :color="bodyActiveColor"
                :label="$t('library.keywords')"
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
          <span>{{ $t("common.remarks") }}</span>
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
          <!-- ABSTRACT -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof library.abstract !== 'undefined'"
                v-model="library.abstract"
                :label="$t('library.abstract')"
              />

              <textarea-wrapper
                v-if="false"
                v-model="library.abstract"
                :color="bodyActiveColor"
                :label="$t('library.abstract')"
              />
            </v-col>
          </v-row>

          <!-- ABSTRACT_EN -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <editor
                v-if="typeof library.abstract_en !== 'undefined'"
                v-model="library.abstract_en"
                :label="$t('library.abstract_en')"
              />

              <textarea-wrapper
                v-if="false"
                v-model="library.abstract_en"
                :color="bodyActiveColor"
                :label="$t('library.abstract_en')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- LIBRARY MEMBERS -->
    <v-card
      class="mt-2"
      id="block-members"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div
          class="card-title--clickable"
          @click="block.members = !block.members"
        >
          <span>{{ $t("library.libraryAgent") }}</span>
          <v-icon right>fas fa-user-friends</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.members = !block.members"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.members ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.members" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="library.agents"
                :color="bodyActiveColor"
                :items="autocomplete.agents"
                :loading="autocomplete.loaders.agents"
                item-text="agent"
                :label="$t('library.libraryAgent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch($event, 'agents')"
                :multiple="true"
                v-on:chip:close="
                  library.agents.splice(library.agents.indexOf($event), 1)
                "
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
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("library.relatedTables." + tab.name) }}</span>
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
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <library-reference-table
            v-show="activeTab === 'library_reference'"
            :response="relatedData.library_reference"
            :search-parameters="relatedData.searchParameters.library_reference"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <library-reference-list-view
            v-if="$route.meta.isEdit"
            :data="relatedData.library_reference_list.results"
            :active-tab="activeTab"
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

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-2">
      <v-col>
        <checkbox-wrapper
          v-model="library.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="library.is_private = !library.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import LibraryReferenceListView from "@/components/library/relatedTables/LibraryReferenceListView";
import formSectionsMixin from "@/mixins/formSectionsMixin";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "@/components/partial/inputs/CheckboxWrapper";
import LibraryReferenceTable from "@/components/library/relatedTables/LibraryReferenceTable";
import Editor from "@/components/partial/inputs/Editor";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "Library",
  components: {
    Pagination,
    Editor,
    LibraryReferenceTable,
    CheckboxWrapper,
    AutocompleteWrapper,
    TextareaWrapper,
    InputWrapper,
    LibraryReferenceListView,
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

  methods: {
    setTab(type) {
      this.activeTab = type;
    },

    setInitialData() {
      return {
        relatedTabs: [
          {
            name: "library_reference",
            iconClass: "fas fa-book-open",
          },
          {
            name: "library_reference_list",
            iconClass: "fas fa-list-ol",
          },
        ],
        activeTab: "library_reference",
        relatedData: this.setDefaultRelatedData(),
        autocomplete: {
          loaders: {
            reference: false,
            agents: false,
          },
          reference: [],
          agents: [],
        },
        requiredFields: ["author_txt"],
        library: {
          id: null,
          author_txt: null,
          year: null,
          title: null,
          title_short: null,
          title_en: null,
          title_short_en: null,
          keywords: null,
          abstract: null,
          abstract_en: null,
          is_private: false,
        },
        block: { info: true, description: true, members: true },
      };
    },

    setDefaultRelatedData() {
      return {
        library_reference: {
          count: 0,
          results: [],
        },
        library_reference_list: {
          count: 0,
          results: [],
        },
        searchParameters: {
          library_reference: {
            page: 1,
            paginateBy: 25,
            sortBy: ["sort"],
            sortDesc: [true],
          },
          library_reference_list: {
            page: 1,
            paginateBy: 1000,
            sortBy: ["sort", "reference__author", "reference__year"],
            sortDesc: [true, false, true],
          },
        },
      };
    },
  },
};
</script>

<style scoped></style>
