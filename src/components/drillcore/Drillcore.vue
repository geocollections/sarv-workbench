<template>
  <div class="drillcore">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('drillcore') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('drillcore') ? 'green--text' : 'red--text'"
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
          <!-- DRILLCORE and DRILLCORE_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="drillcore.drillcore"
                :color="bodyActiveColor"
                :label="$t('common.drillcore')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="drillcore.drillcore_en"
                :color="bodyActiveColor"
                :label="$t('common.drillcore_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- LOCALITY, YEAR, AGENT and DEPTH  -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.locality"
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

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore.year"
                :color="bodyActiveColor"
                :label="$t('common.year')"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('drillcore.agent')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="drillcore.depth"
                :color="bodyActiveColor"
                :label="$t('common.depth')"
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
          <span>{{ $t("drillcore.details") }}</span>
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
          <!-- DEPOSITORY, LOCATION and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.depository"
                :color="bodyActiveColor"
                :items="autocomplete.list_drillcore_storage"
                :loading="autocomplete.loaders.list_drillcore_storage"
                :item-text="commonLabel"
                :label="$t('drillcore.depository')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.location"
                :color="bodyActiveColor"
                :label="$t('common.location')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="drillcore.storage"
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

          <!-- BOXES, BOX_NUMBERS and NUMBER_METERS -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.boxes"
                :color="bodyActiveColor"
                :label="$t('drillcore.boxes')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.box_numbers"
                :color="bodyActiveColor"
                :label="$t('drillcore.box_numbers')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="drillcore.number_meters"
                :color="bodyActiveColor"
                :label="$t('drillcore.number_meters')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="drillcore.remarks"
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
          v-for="tab in relatedTabs"
          :key="tab.name"
          @click.prevent="setTab(tab.name)"
        >
          <span>{{ $t("drillcore.relatedTables." + tab.name) }}</span>
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
          <drillcore-box-table
            v-show="activeTab === 'drillcore_box'"
            :response="relatedData.drillcore_box"
            :search-parameters="relatedData.searchParameters.drillcore_box"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <drillcore-study-table
            v-show="activeTab === 'drillcore_study'"
            :response="relatedData.drillcore_study"
            :search-parameters="relatedData.searchParameters.drillcore_study"
            :body-color="bodyColor"
            :body-active-color="bodyActiveColor"
            v-on:related:add="addRelatedItem"
            v-on:related:edit="editRelatedItem"
            v-on:related:delete="deleteRelatedItem"
          />

          <div v-show="activeTab === 'attachment_link'">
            <file-upload
              show-existing
              :files-from-object="relatedData.attachment_link.results"
              v-on:update:existing-files="addExistingFiles"
              v-on:file-uploaded="addFiles"
              accept-multiple
              :record-options="$route.meta.isEdit"
              :is-draggable="$route.meta.isEdit"
              show-attachment-link
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

    <!-- DIRECTION_LR and IS_PRIVATE -->
    <div class="d-flex flex-wrap mt-2">
      <checkbox-wrapper
        class="mr-1"
        v-model="drillcore.direction_lr"
        :color="bodyActiveColor"
        :label="$t('drillcore.direction_lr')"
        @change="drillcore.direction_lr = !drillcore.direction_lr"
      />
      <checkbox-wrapper
        v-model="drillcore.is_private"
        :color="bodyActiveColor"
        :label="$t('common.is_private')"
        @change="drillcore.is_private = !drillcore.is_private"
      />
    </div>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchDrillcore,
  fetchDrillcoreAttachments,
  fetchDrillcoreStudies,
  fetchListDrillcoreStorage,
  fetchRelatedDrillcoreBoxes
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileUpload from "../partial/inputs/FileInput";
import DrillcoreBoxTable from "./relatedTables/DrillcoreBoxTable";
import DrillcoreStudyTable from "./relatedTables/DrillcoreStudyTable";
import requestsMixin from "../../mixins/requestsMixin";
import { mapActions, mapState } from "vuex";

export default {
  name: "Drillcore",

  components: {
    DrillcoreStudyTable,
    DrillcoreBoxTable,
    FileUpload,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper
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

  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    requestsMixin
  ],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.drillcoreSearchParameters,
        request: "FETCH_DRILLCORES",
        title: "header.drillcores",
        object: "drillcore",
        field: "drillcore"
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
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
    ...mapState("search", ["drillcoreSearchParameters"]),
    ...mapState("search", {
      activeRelatedDataTab: state => state.activeRelatedDataTab.drillcore
    }),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),

    setTab(type) {
      if (type) {
        this.updateActiveTab({
          tab: type,
          object: this.$route.meta.object
        });
        this.activeTab = type;
      }
    },

    setInitialData() {
      return {
        relatedTabs: [
          { name: "drillcore_box", iconClass: "fas fa-box" },
          { name: "drillcore_study", iconClass: "fas fa-school" },
          { name: "attachment_link", iconClass: "far fa-folder-open" }
        ],
        activeTab: "drillcore_box",
        relatedData: this.setDefaultRelatedData(),
        copyFields: [
          "id",
          "drillcore",
          "drillcore_en",
          "locality",
          "year",
          "agent",
          "depository",
          "location",
          "storage",
          "boxes",
          "box_numbers",
          "number_meters",
          "direction_lr",
          "depth",
          "remarks",
          "is_private"
        ],
        autocomplete: {
          loaders: {
            locality: false,
            agent: false,
            list_drillcore_storage: false,
            storage: false,
            attachment: false,
            stratigraphy_base: false,
            stratigraphy_top: false
          },
          locality: [],
          agent: [],
          list_drillcore_storage: [],
          storage: [],
          attachment: [],
          stratigraphy_base: [],
          stratigraphy_top: []
        },
        requiredFields: ["drillcore", "drillcore_en"],
        drillcore: {},
        block: {
          info: true,
          details: true
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
      this.loadAutocompleteFields();

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "drillcore");
        fetchDrillcore(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "drillcore", this.handleResponse(response)[0]);
            // this.drillcore = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.drillcore);

            this.removeUnnecessaryFields(this.drillcore, this.copyFields);
            this.$emit("data-loaded", this.drillcore);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map(tab => tab.name)
        );
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    loadAutocompleteFields() {
      fetchListDrillcoreStorage().then(
        response =>
          (this.autocomplete.list_drillcore_storage = this.handleResponse(
            response
          ))
      );
    },

    setDefaultRelatedData() {
      return {
        drillcore_box: { count: 0, results: [] },
        drillcore_study: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        searchParameters: {
          drillcore_box: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          drillcore_study: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true]
          },
          attachment_link: {
            page: 1,
            paginateBy: 10,
            sortBy: ["original_filename"],
            sortDesc: [true]
          }
        }
      };
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
          if (this.relatedData[tab.name].count > 0)
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment = this.relatedData.attachment_link.results.map(
                item => {
                  return { id: item.id };
                }
              );
            } else {
              uploadableObject.related_data[tab.name] = this.relatedData[
                tab.name
              ].results;

              uploadableObject.related_data[tab.name].forEach(item => {
                Object.keys(item).forEach(key => {
                  if (typeof item[key] === "object" && item[key] !== null) {
                    item[key] = item[key].id ? item[key].id : null;
                  }
                });
              });
            }
        });
      } else {
        if (this.relatedData.attachment_link.results.length > 0) {
          uploadableObject.related_data.attachment = this.relatedData.attachment_link.results.map(
            item => {
              return { id: item.id };
            }
          );
        } else uploadableObject.related_data.attachment = null;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.locality)) {
        this.drillcore.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en
        };
        this.autocomplete.locality.push(this.drillcore.locality);
      }
      if (this.isNotEmpty(obj.agent)) {
        this.drillcore.agent = {
          id: obj.agent,
          agent: obj.agent__agent
        };
        this.autocomplete.agent.push(this.drillcore.agent);
      }
      this.drillcore.depository = {
        id: obj.depository,
        value: obj.depository__value,
        value_en: obj.depository__value_en
      };
      if (this.isNotEmpty(obj.storage)) {
        this.drillcore.storage = {
          id: obj.storage,
          location: obj.storage__location
        };
        this.autocomplete.storage.push(this.drillcore.storage);
      }
    },

    loadRelatedData(object) {
      let query;

      if (object === "drillcore_box") {
        query = fetchRelatedDrillcoreBoxes(
          this.$route.params.id,
          this.relatedData.searchParameters.drillcore_box
        );
      } else if (object === "drillcore_study") {
        query = fetchDrillcoreStudies(
          this.$route.params.id,
          this.relatedData.searchParameters.drillcore_study
        );
      } else if (object === "attachment_link") {
        query = fetchDrillcoreAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      }

      query.then(response => {
        this.relatedData[object].count = response.data.count;
        this.relatedData[object].results = this.handleResponse(response);
      });
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "drillcore", singleFileMetadata);
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    }
  }
};
</script>

<style scoped></style>
