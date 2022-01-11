<template>
  <div class="drillcoreBox">
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
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
            >{{ $t("common.generalInfo") }}</span
          >
          <v-icon
            right
            :class="validate('drillcore_box') ? 'green--text' : 'red--text'"
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
          <!-- DRILLCORE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.drillcore"
                :color="bodyActiveColor"
                :items="autocomplete.drillcore"
                :loading="autocomplete.loaders.drillcore"
                :item-text="drillcoreLabel"
                :label="$t('drillcore.drillcore')"
                is-link
                route-object="drillcore"
                is-searchable
                v-on:search:items="autocompleteDrillcoreSearch"
                use-state
              />
            </v-col>
          </v-row>

          <!-- NUMBER, NUMBER_METERS, DIAMETER and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.number_meters"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.number_meters')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.diameter"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.diameter')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.storage"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('common.storage')"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_START, STRATIGRAPHY_TOP and STRATIGRAPHY_TOP_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_start"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_start')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_top"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_top"
                :loading="autocomplete.loaders.stratigraphy_top"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_top')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyTopSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_top_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_top_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_END, STRATIGRAPHY_BASE and STRATIGRAPHY_BASE_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.depth_end"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_end')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore_box.stratigraphy_base"
                :color="bodyActiveColor"
                :items="autocomplete.stratigraphy_base"
                :loading="autocomplete.loaders.stratigraphy_base"
                :item-text="stratigraphyLabel"
                :label="$t('drillcore_box.stratigraphy_base')"
                is-link
                route-object="stratigraphy"
                is-searchable
                v-on:search:items="autocompleteStratigraphyBaseSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore_box.stratigraphy_base_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_base_free')"
              />
            </v-col>
          </v-row>

          <!-- DEPTH_OTHER -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.depth_other"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.depth_other')"
              />
            </v-col>
          </v-row>

          <!-- STRATIGRAPHY_FREE -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.stratigraphy_free')"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- RELATED DATA TABS -->
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
          <span>{{ $t("drillcore_box.relatedTables." + tab.name) }}</span>
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
          <div v-show="activeTab === 'attachment'">
            <file-input
              show-existing
              :show-existing-previews="!$route.meta.isEdit"
              :files-from-object="relatedData.attachment.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
            />

            <drillcore-box-attachment-table
              class="mt-2"
              v-if="$route.meta.isEdit"
              :response="relatedData.attachment"
              :search-parameters="relatedData.searchParameters.attachment"
              :body-color="bodyColor"
              :body-active-color="bodyActiveColor"
              v-on:related:edit="editRelatedItem"
              v-on:toggle-preferred-state="handleChangeObjectsState"
              v-on:toggle-privacy-state="handleChangeObjectsState"
            />
          </div>

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
import formManipulation from "@/mixins/formManipulation";
import autocompleteMixin from "@/mixins/autocompleteMixin";
import AutocompleteWrapper from "@/components/partial/inputs/AutocompleteWrapper";
import InputWrapper from "@/components/partial/inputs/InputWrapper";
import TextareaWrapper from "@/components/partial/inputs/TextareaWrapper";
import requestsMixin from "@/mixins/requestsMixin";
import FileInput from "@/components/partial/inputs/FileInput";
import DrillcoreBoxAttachmentTable from "@/components/drillcore_box/related_tables/DrillcoreBoxAttachmentTable";
import { mapActions } from "vuex";
import Pagination from "@/components/partial/Pagination";
import detailViewUtilsMixin from "@/mixins/detailViewUtilsMixin";
import globalUtilsMixin from "@/mixins/globalUtilsMixin";

export default {
  name: "DrillcoreBox",

  components: {
    Pagination,
    DrillcoreBoxAttachmentTable,
    FileInput,
    TextareaWrapper,
    InputWrapper,
    AutocompleteWrapper,
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
    requestsMixin,
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
        relatedTabs: [{ name: "attachment", iconClass: "fas fa-image" }],
        activeTab: "attachment",
        relatedData: this.setDefaultRelatedData(),
        autocomplete: {
          loaders: {
            drillcore: false,
            storage: false,
            stratigraphy_base: false,
            stratigraphy_top: false,
          },
          drillcore: [],
          storage: [],
          stratigraphy_base: [],
          stratigraphy_top: [],
        },
        requiredFields: ["drillcore", "number"],
        drillcore_box: {
          id: null,
          drillcore: null,
          number: null,
          number_meters: null,
          diameter: null,
          storage: null,
          depth_start: null,
          stratigraphy_base: null,
          stratigraphy_base_free: null,
          depth_end: null,
          stratigraphy_top: null,
          stratigraphy_top_free: null,
          depth_other: null,
          stratigraphy_free: null,
          remarks: null,
        },
        block: {
          info: true,
        },
      };
    },

    setDefaultRelatedData() {
      return {
        attachment: { count: 0, results: [] },
        searchParameters: {
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["is_preferred"],
            sortDesc: [true],
          },
        },
      };
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(
        files,
        "drillcore_box",
        singleFileMetadata,
        this.relatedData.attachment.count
      );
    },

    addExistingFiles(files) {
      // this.relatedData.attachment.count = files.length;
      this.relatedData.attachment.results = files;
    },

    handleChangeObjectsState(data) {
      this.changeObjectsState({ table: "attachment", ...data });
      // this.loadRelatedData("attachment");
    },
  },
};
</script>

<style scoped />
