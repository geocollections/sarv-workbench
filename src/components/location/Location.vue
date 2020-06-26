<template>
  <div class="location">
    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('location') ? 'green--text' : 'red--text'">{{
            $t("common.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('location') ? 'green--text' : 'red--text'"
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
          <!-- LOCATION, PARENT_LOCATION, NUMBER_ITEMS and NUMBER_ITEMS_REGISTERED -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.location"
                :color="bodyActiveColor"
                :label="$t('location.location')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <autocomplete-wrapper
                v-model="location.parent_location"
                :color="bodyActiveColor"
                :items="autocomplete.storage"
                :loading="autocomplete.loaders.storage"
                item-text="location"
                :label="$t('location.location_location')"
                is-link
                route-object="location"
                is-searchable
                v-on:search:items="autocompleteStorageSearch"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.number_items"
                :color="bodyActiveColor"
                :label="$t('location.number_items')"
                type="number"
              />
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <input-wrapper
                v-model="location.number_items_registered"
                :color="bodyActiveColor"
                :label="$t('location.number_items_registered')"
                type="number"
              />
            </v-col>
          </v-row>

          <!-- AUTHOR, STRATIGRAPHY_FREE and DATE_COLLECTED_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="location.agent"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.agent"
                item-text="agent"
                :label="$t('common.author')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteAgentSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="location.stratigraphy_free"
                :color="bodyActiveColor"
                :label="$t('common.stratigraphy')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="location.date_collected_free"
                :color="bodyActiveColor"
                :label="$t('location.date_collected_free')"
              />
            </v-col>
          </v-row>

          <!-- CONTENTS and REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="location.contents"
                :color="bodyActiveColor"
                :label="$t('location.contents')"
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <textarea-wrapper
                v-model="location.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- SHOWING RELATED_DATA -->
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
          <span>{{ $t("location.relatedTables." + tab.name) }}</span>
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

          <div v-show="activeTab === 'specimen'" class="pa-1">
            <!-- ADD NEW and EXPORT -->
            <v-card
              class="d-flex flex-row justify-content-start mb-3"
              flat
              tile
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-card flat tile class="mx-1">
                <v-btn
                  :to="{
                    name: 'Specimen add',
                    query: { storage: JSON.stringify(location) }
                  }"
                  target="newSpecimenWindow"
                  :color="bodyActiveColor"
                  :dark="isBodyActiveColorDark"
                  >{{ $t("add.new") }}</v-btn
                >
              </v-card>

              <v-card
                flat
                tile
                class="mx-1"
                v-if="relatedData.specimen.count > 0"
              >
                <export-buttons
                  filename="specimen"
                  :table-data="relatedData.specimen.results"
                  clipboard-class="specimen-table"
                  :body-active-color="bodyActiveColor"
                />
              </v-card>
            </v-card>

            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <specimen-table
                  ref="table"
                  :response="relatedData.specimen"
                  :search-parameters="relatedData.searchParameters.specimen"
                  v-if="relatedData.specimen.count > 0"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                  v-on:update:sorting="
                    relatedData.searchParameters[activeTab][$event.key] =
                      $event.value
                  "
                />
              </v-col>
            </v-row>
          </div>

          <div v-show="activeTab === 'sample'" class="pa-1">
            <!-- ADD NEW and EXPORT -->
            <v-card
              class="d-flex flex-row justify-content-start mb-3"
              flat
              tile
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-card flat tile class="mx-1">
                <v-btn
                  :to="{
                    name: 'Sample add',
                    query: { storage: JSON.stringify(location) }
                  }"
                  target="newSampleWindow"
                  :color="bodyActiveColor"
                  :dark="isBodyActiveColorDark"
                  >{{ $t("add.new") }}</v-btn
                >
              </v-card>

              <v-card
                flat
                tile
                class="mx-1"
                v-if="relatedData.sample.count > 0"
              >
                <export-buttons
                  filename="sample"
                  :table-data="relatedData.sample.results"
                  clipboard-class="sample-table"
                  :body-active-color="bodyActiveColor"
                />
              </v-card>
            </v-card>

            <v-row no-gutters>
              <v-col cols="12" class="px-1">
                <sample-table
                  ref="table"
                  :response="relatedData.sample"
                  :search-parameters="relatedData.searchParameters.sample"
                  v-if="relatedData.sample.count > 0"
                  :body-active-color="bodyActiveColor"
                  :body-color="bodyColor"
                  v-on:update:sorting="
                    relatedData.searchParameters[activeTab][$event.key] =
                      $event.value
                  "
                />
              </v-col>
            </v-row>
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
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import {
  fetchLocation,
  fetchLocationAttachment,
  fetchLocationSamples,
  fetchLocationSpecimens
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import { mapActions, mapState } from "vuex";
import FileUpload from "../partial/inputs/FileInput";
import requestsMixin from "../../mixins/requestsMixin";
import SpecimenTable from "../specimen/SpecimenTable";
import SampleTable from "../sample/SampleTable";
import ExportButtons from "../partial/export/ExportButtons";

export default {
  name: "Location",

  components: {
    ExportButtons,
    SampleTable,
    SpecimenTable,
    FileUpload,
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

  mixins: [formManipulation, autocompleteMixin, requestsMixin],

  data() {
    return this.setInitialData();
  },

  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.locationSearchParameters,
        request: "FETCH_LOCATIONS",
        title: "header.locations",
        object: "location",
        field: "location"
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function() {
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
    ...mapState("search", ["locationSearchParameters"]),

    activeRelatedDataTab() {
      let tabObject = this.$store.state.activeRelatedDataTab;
      if (tabObject && tabObject[this.$route.meta.object]) {
        return tabObject[this.$route.meta.object];
      } else return null;
    },

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
          { name: "attachment_link", iconClass: "fas fa-folder-open" },
          { name: "specimen", iconClass: "fas fa-fish" },
          { name: "sample", iconClass: "fas fa-vial" }
        ],
        relatedData: this.setDefaultRelatedData(),
        activeTab: "attachment_link",
        copyFields: [
          "id",
          "location",
          "parent_location",
          "number_items",
          "number_items_registered",
          "agent",
          "stratigraphy_free",
          "date_collected_free",
          "contents",
          "remarks"
        ],
        autocomplete: {
          loaders: {
            agent: false,
            storage: false
          },
          agent: [],
          storage: []
        },
        location: {},
        requiredFields: ["location"],
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
        fetchLocation(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "location", this.handleResponse(response)[0]);
            // this.location = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.location);
            this.removeUnnecessaryFields(this.location, this.copyFields);

            this.$emit("data-loaded", this.location);
            this.setLoadingState(false);
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach(tab => {
          this.loadRelatedData(tab.name);
        });
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
      }
    },

    setDefaultRelatedData() {
      return {
        attachment_link: { count: 0, results: [] },
        specimen: { count: 0, results: [] },
        sample: { count: 0, results: [] },
        searchParameters: {
          attachment_link: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          specimen: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
            sortDesc: [true]
          },
          sample: {
            page: 1,
            paginateBy: 25,
            sortBy: ["id"],
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
      if (this.isNotEmpty(obj.agent)) {
        this.location.agent = {
          id: obj.agent,
          agent: obj.agent__agent
        };
        this.autocomplete.agent.push(this.location.agent);
      }
      if (this.isNotEmpty(obj.parent_location)) {
        this.location.parent_location = {
          id: obj.parent_location,
          location: obj.parent_location__location
        };
        this.autocomplete.storage.push(this.location.parent_location);
      }
    },

    loadRelatedData(type) {
      let query;

      if (type === "attachment_link") {
        query = fetchLocationAttachment(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment_link
        );
      } else if (type === "specimen") {
        query = fetchLocationSpecimens(
          this.$route.params.id,
          this.relatedData.searchParameters.specimen
        );
      } else if (type === "sample") {
        query = fetchLocationSamples(
          this.$route.params.id,
          this.relatedData.searchParameters.sample
        );
      }

      query.then(response => {
        this.relatedData[type].count = response.data.count;
        this.relatedData[type].results = this.handleResponse(response);
      });
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "location");
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    }
  }
};
</script>

<style scoped></style>
