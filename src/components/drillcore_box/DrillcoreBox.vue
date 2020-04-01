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

          <!-- DEPTH_START, STRATIGRAPHY_BASE and STRATIGRAPHY_BASE_FREE -->
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

          <!-- DEPTH_END, STRATIGRAPHY_TOP and STRATIGRAPHY_TOP_FREE -->
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

          <!-- LOCATION -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore_box.location"
                :color="bodyActiveColor"
                :label="$t('drillcore_box.location')"
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
          <drillcore-box-attachment-table
            v-show="activeTab === 'attachment'"
            :response="relatedData.attachment"
            :search-parameters="relatedData.searchParameters.attachment"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:edit="editRelatedItem"
          />

          <div v-show="activeTab === 'add_attachment'">
            <file-upload
              show-existing
              :files-from-object="relatedData.add_attachment.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
            />
          </div>

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData[activeTab].count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none pa-1 mt-2"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters[activeTab].paginateBy"
                :color="bodyActiveColor"
                dense
                :items="paginateByOptionsTranslated"
                :item-color="bodyActiveColor"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters[activeTab].page"
                :color="bodyActiveColor"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData[activeTab].count /
                      relatedData.searchParameters[activeTab].paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>
        </v-card>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import cloneDeep from "lodash/cloneDeep";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import InputWrapper from "../partial/inputs/InputWrapper";
import {
  fetchDrillcoreBox,
  fetchDrillcoreBoxAttachments
} from "../../assets/js/api/apiCalls";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import requestsMixin from "../../mixins/requestsMixin";
import FileUpload from "../partial/inputs/FileInput";
import DrillcoreBoxAttachmentTable from "./related_tables/DrillcoreBoxAttachmentTable";

export default {
  name: "DrillcoreBox",

  components: {
    DrillcoreBoxAttachmentTable,
    FileUpload,
    TextareaWrapper,
    InputWrapper,
    AutocompleteWrapper
  },

  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
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
    }
  },

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      const searchHistory = this.$localStorage.get(
        this.searchHistory,
        "fallbackValue"
      );
      let params =
        searchHistory && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "drillcoreBoxSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DRILLCORE_BOXES",
        title: "header.drillcoreBoxes",
        object: "drillcore_box",
        field: "number",
        databaseId: this.databaseId,
        block: this.block
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
        this.setInitialData();
        this.reloadData();
      },
      deep: true
    },
    "relatedData.searchParameters": {
      handler: function() {
        if (this.$route.meta.isEdit) {
          this.loadRelatedData(this.activeTab);
        }
      },
      deep: true
    }
  },

  computed: {
    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    },

    computedRelatedTabs() {
      return this.relatedTabs.filter(tab => {
        if (this.$route.meta.isEdit) return tab;
        else if (tab.name !== "attachment") return tab;
      });
    }
  },

  methods: {
    setTab(type) {
      if (type) {
        this.$store.dispatch("updateActiveTab", {
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "attachment", iconClass: "fas fa-image" },
          { name: "add_attachment", iconClass: "fas fa-file" }
        ],
        activeTab: "attachment",
        relatedData: this.setDefaultRelatedData(),
        searchHistory: "drillcoreBoxSearchHistory",
        copyFields: [
          "id",
          "drillcore",
          "number",
          "number_meters",
          "diameter",
          "storage",
          "depth_start",
          "stratigraphy_base",
          "stratigraphy_base_free",
          "depth_end",
          "stratigraphy_top",
          "stratigraphy_top_free",
          "depth_other",
          "stratigraphy_free",
          "location",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            drillcore: false,
            storage: false,
            stratigraphy_base: false,
            stratigraphy_top: false
          },
          drillcore: [],
          storage: [],
          stratigraphy_base: [],
          stratigraphy_top: []
        },
        requiredFields: ["drillcore", "number"],
        drillcore_box: {},
        searchParameters: this.setDefaultSearchParameters(),
        block: {
          info: true
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 }
        ]
      };
    },

    reloadData() {
      Object.assign(this.$data, this.setInitialData());
      this.loadFullInfo();
    },

    loadFullInfo() {
      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        fetchDrillcoreBox(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "drillcore_box", this.handleResponse(response)[0]);
            // this.drillcore_box = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.drillcore_box);
            this.removeUnnecessaryFields(this.drillcore_box, this.copyFields);

            this.$emit("data-loaded", this.drillcore_box);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
        this.setTab("add_attachment");
      }
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach(key => {
        if (
          typeof uploadableObject[key] === "object" &&
          uploadableObject[key] !== null
        ) {
          uploadableObject[key] = uploadableObject[key].id
            ? uploadableObject[key].id
            : null;
        } else if (typeof uploadableObject[key] === "undefined") {
          uploadableObject[key] = null;
        }
      });

      // Adding related data only on add view
      uploadableObject.related_data = {};
      if (!this.$route.meta.isEdit) {
        this.relatedTabs.forEach(tab => {
          if (this.isNotEmpty(this.relatedData[tab.name]))
            if (tab.name !== "attachment") {
              if (tab.name === "add_attachment") {
                uploadableObject.related_data.attachment = this.relatedData.add_attachment.results;
              } else {
                uploadableObject.related_data[tab.name] = this.relatedData[
                  tab.name
                ].results;
              }
            }
        });
      } else {
        if (this.relatedData.add_attachment.results.length > 0) {
          uploadableObject.related_data.attachment = this.relatedData.add_attachment.results;
        } else uploadableObject.related_data.attachment = null;
      }

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.drillcore)) {
        this.drillcore_box.drillcore = {
          drillcore: obj.drillcore__drillcore,
          drillcore_en: obj.drillcore__drillcore_en,
          id: obj.drillcore
        };
        this.autocomplete.drillcore.push(this.drillcore_box.drillcore);
      }
      if (this.isNotEmpty(obj.storage)) {
        this.drillcore_box.storage = {
          id: obj.storage,
          location: obj.storage__location
        };
        this.autocomplete.storage.push(this.drillcore_box.storage);
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        this.drillcore_box.stratigraphy_top = {
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en,
          id: obj.stratigraphy_top
        };
        this.autocomplete.stratigraphy_top.push(
          this.drillcore_box.stratigraphy_top
        );
      }
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        this.drillcore_box.stratigraphy_base = {
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en,
          id: obj.stratigraphy_base
        };
        this.autocomplete.stratigraphy_base.push(
          this.drillcore_box.stratigraphy_base
        );
      }
    },

    setDefaultRelatedData() {
      return {
        attachment: { count: 0, results: [] },
        add_attachment: { count: 0, results: [] },
        searchParameters: {
          attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["is_preferred"],
            sortDesc: [true]
          },
          add_attachment: {
            page: 1,
            paginateBy: 10,
            sortBy: ["is_preferred"],
            sortDesc: [true]
          }
        }
      };
    },

    loadRelatedData(object) {
      let query;

      if (object === "attachment") {
        query = fetchDrillcoreBoxAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment
        );
      } else if (object === "add_attachment") {
        query = fetchDrillcoreBoxAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.add_attachment
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "drillcore_box");
    },

    addExistingFiles(files) {
      this.relatedData.add_attachment.count = files.length;
      this.relatedData.add_attachment.results = files;
    },

    setDefaultSearchParameters() {
      return {
        storage: null,
        drillcore: null,
        page: 1,
        paginateBy: 10,
        sortBy: ["drillcore"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped />
