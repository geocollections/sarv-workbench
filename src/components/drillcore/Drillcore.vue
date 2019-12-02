<template>
  <div class="drillcore">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

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
            $t("drillcore.generalInfo")
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
        <div v-show="block.info" class="px-1 pt-1 pb-2">
          <!-- DRILLCORE and DRILLCORE_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`drillcore`">{{ $t("drillcore.drillcore") }}:</label>
              <b-form-input
                size="sm"
                id="drillcore"
                v-model="drillcore.drillcore"
                :state="isNotEmpty(drillcore.drillcore)"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`drillcore_en`"
                >{{ $t("drillcore.drillcore_en") }}:</label
              >
              <b-form-input
                size="sm"
                id="drillcore_en"
                v-model="drillcore.drillcore_en"
                :state="isNotEmpty(drillcore.drillcore_en)"
                type="text"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- LOCALITY, YEAR, AGENT and DEPTH  -->
          <v-row no-gutters>
            <v-col cols="12" md="3" class="px-1">
              <label :for="`locality`">{{ $t("drillcore.locality") }}:</label>
              <vue-multiselect
                v-model="drillcore.locality"
                id="locality"
                :label="localityLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.locality"
                :options="autocomplete.locality"
                @search-change="autocompleteLocalitySearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[localityLabel] }}</strong>
                </template>
                <template slot="noResult">
                  <b>{{ $t("messages.inputNoResults") }}</b>
                </template>
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`year`">{{ $t("drillcore.year") }}:</label>
              <b-form-input
                size="sm"
                id="year"
                v-model="drillcore.year"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`agent`">{{ $t("drillcore.agent") }}:</label>
              <vue-multiselect
                id="agent"
                v-model="drillcore.agent"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.agent"
                :options="autocomplete.agent"
                @search-change="autocompleteAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="3" class="px-1">
              <label :for="`depth`">{{ $t("drillcore.depth") }}:</label>
              <b-form-input
                size="sm"
                id="depth"
                v-model="drillcore.depth"
                type="text"
              ></b-form-input>
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
        <div v-show="block.details" class="px-1 pt-1 pb-2">
          <!-- DEPOSITORY, LOCATION and STORAGE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`drillcore`"
                >{{ $t("drillcore.depository") }}:</label
              >
              <vue-multiselect
                v-model="drillcore.depository"
                id="type"
                :options="autocomplete.list_drillcore_storage"
                track-by="id"
                :label="commonLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[commonLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`location`">{{ $t("drillcore.location") }}:</label>
              <b-form-input
                size="sm"
                id="location"
                v-model="drillcore.location"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`storage`">{{ $t("drillcore.storage") }}:</label>
              <vue-multiselect
                v-model="drillcore.storage"
                id="storage"
                label="location"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.storage"
                :options="autocomplete.storage"
                @search-change="autocompleteStorageSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong>{{ option.location }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- BOXES, BOX_NUMBERS and NUMBER_METERS -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`boxes`">{{ $t("drillcore.boxes") }}:</label>
              <b-form-input
                size="sm"
                id="boxes"
                v-model="drillcore.boxes"
                type="number"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`box_numbers`"
                >{{ $t("drillcore.box_numbers") }}:</label
              >
              <b-form-input
                size="sm"
                id="box_numbers"
                v-model="drillcore.box_numbers"
                type="text"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`number_meters`"
                >{{ $t("drillcore.number_meters") }}:</label
              >
              <b-form-input
                size="sm"
                id="number_meters"
                v-model="drillcore.number_meters"
                type="number"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- REMARKS -->
          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <label :for="`remarks`">{{ $t("drillcore.remarks") }}:</label>
              <editor :data.sync="drillcore.remarks" />
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
            v-if="relatedData.count[tab.name] > 0"
            class="font-weight-bold ml-2"
          >
            {{ relatedData.count[tab.name] }}
          </span>
        </v-tab>
      </v-tabs>

      <v-tabs-items>
        <v-card
          class="pt-3 px-1"
          flat
          :color="bodyColor.split('n-')[0] + 'n-5'"
        >
          <drillcore-box
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <drillcore-study
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <drillcore-attachment
            :related-data="relatedData"
            :autocomplete="autocomplete"
            :active-tab="activeTab"
            v-on:add-related-data="addRelatedData"
            v-on:set-default="setDefault"
            v-on:edit-row="editRow"
            v-on:remove-row="removeRow"
          />

          <!-- PAGINATION -->
          <div
            v-if="$route.meta.isEdit && relatedData.count[activeTab] > 0"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between d-print-none px-1"
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
                    relatedData.count[activeTab] /
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
      <v-checkbox
        v-model="drillcore.direction_lr"
        id="direction_lr"
        :label="$t('drillcore.direction_lr')"
        hide-details
        :color="bodyActiveColor"
        class="mt-0 vuetify-checkbox mr-3"
      ></v-checkbox>

      <v-checkbox
        v-model="drillcore.is_private"
        id="is_private"
        :label="$t('drillcore.is_private')"
        hide-details
        :color="bodyActiveColor"
        class="mt-0 vuetify-checkbox"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import Editor from "../partial/editor/Editor";
import Spinner from "vue-simple-spinner";
import formManipulation from "../../mixins/formManipulation";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import {
  fetchDrillcore,
  fetchDrillcoreAttachments,
  fetchDrillcoreBoxes,
  fetchDrillcoreStudies,
  fetchListDrillcoreStorage
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import DrillcoreBox from "./relatedTables/DrillcoreBox";
import DrillcoreStudy from "./relatedTables/DrillcoreStudy";
import DrillcoreAttachment from "./relatedTables/DrillcoreAttachment";

export default {
  name: "Drillcore",

  components: {
    Editor,
    Spinner,
    DrillcoreBox,
    DrillcoreStudy,
    DrillcoreAttachment
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

  mixins: [formManipulation, autocompleteMixin, formSectionsMixin],

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
        this.isNotEmpty(searchHistory) && searchHistory !== "fallbackValue"
          ? searchHistory
          : this.searchParameters;
      this.$store.commit("SET_ACTIVE_SEARCH_PARAMS", {
        searchHistory: "drillcoreSearchHistory",
        defaultSearch: this.setDefaultSearchParameters(),
        search: params,
        request: "FETCH_DRILLCORES",
        title: "header.drillcores",
        object: "drillcore",
        field: "drillcore",
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
        this.loadRelatedData(this.activeTab);
      },
      deep: true
    }
  },

  computed: {
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
          { name: "drillcore_box", iconClass: "fas fa-box" },
          { name: "drillcore_study", iconClass: "fas fa-school" },
          { name: "attachment", iconClass: "far fa-folder-open" }
        ],
        searchHistory: "drillcoreSearchHistory",
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
        searchParameters: this.setDefaultSearchParameters(),
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
      this.loadAutocompleteFields(true, true);

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "drillcore");
        fetchDrillcore(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);

          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.drillcore = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.drillcore);

            this.removeUnnecessaryFields(this.drillcore, this.copyFields);
            this.$emit("data-loaded", this.drillcore);
            this.sendingData = false;
          } else {
            this.sendingData = false;
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
      }
    },

    loadAutocompleteFields(regularAutocompleteFields = true) {
      if (regularAutocompleteFields) {
        fetchListDrillcoreStorage().then(
          response =>
            (this.autocomplete.list_drillcore_storage = this.handleResponse(
              response
            ))
        );
      }
    },

    setDefaultRelatedData() {
      return {
        drillcore_box: [],
        drillcore_study: [],
        attachment: [],
        new: {
          drillcore_box: [],
          drillcore_study: [],
          attachment: []
        },
        copyFields: {
          drillcore_box: [
            "number",
            "depth_start",
            "depth_end",
            "stratigraphy_base",
            "stratigraphy_top",
            "depth_other",
            "number_meters",
            "diameter",
            "remarks"
          ],
          drillcore_study: ["date", "agent", "aim", "remarks"],
          attachment: ["attachment", "remarks"]
        },
        insert: this.setDefaultInsertRelatedData(),
        searchParameters: {
          drillcore_box: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          drillcore_study: {
            page: 1,
            paginateBy: 10,
            orderBy: "id"
          },
          attachment: {
            page: 1,
            paginateBy: 10,
            orderBy: "original_filename"
          }
        },
        count: {
          drillcore_box: 0,
          drillcore_study: 0,
          attachment: 0
        }
      };
    },

    setDefaultInsertRelatedData() {
      return {
        drillcore_box: {},
        drillcore_study: {},
        attachment: {}
      };
    },

    formatDataForUpload(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.locality))
        uploadableObject.locality = objectToUpload.locality.id;
      if (this.isNotEmpty(objectToUpload.agent))
        uploadableObject.agent = objectToUpload.agent.id;
      if (this.isNotEmpty(objectToUpload.depository))
        uploadableObject.depository = objectToUpload.depository.id;
      if (this.isNotEmpty(objectToUpload.storage))
        uploadableObject.storage = objectToUpload.storage.id;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.drillcore.locality = {
        id: obj.locality,
        locality: obj.locality__locality,
        locality_en: obj.locality__locality_en
      };
      this.drillcore.agent = {
        id: obj.agent,
        agent: obj.agent__agent
      };
      this.drillcore.depository = {
        id: obj.depository,
        value: obj.depository__value,
        value_en: obj.depository__value_en
      };
      this.drillcore.storage = {
        id: obj.storage,
        location: obj.storage__location
      };
    },

    fillRelatedDataAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.stratigraphy_base))
        obj.stratigraphy_base = {
          id: obj.stratigraphy_base,
          stratigraphy: obj.stratigraphy_base__stratigraphy,
          stratigraphy_en: obj.stratigraphy_base__stratigraphy_en
        };

      if (this.isNotEmpty(obj.stratigraphy_top))
        obj.stratigraphy_top = {
          id: obj.stratigraphy_top,
          stratigraphy: obj.stratigraphy_top__stratigraphy,
          stratigraphy_en: obj.stratigraphy_top__stratigraphy_en
        };

      if (this.isNotEmpty(obj.agent))
        obj.agent = {
          id: obj.agent,
          agent: obj.agent__agent
        };

      if (this.isNotEmpty(obj.original_filename))
        obj.attachment = {
          id: obj.id,
          original_filename: obj.original_filename
        };

      return obj;
    },

    unformatRelatedDataAutocompleteFields(obj, objectID) {
      let newObject = cloneDeep(obj);

      if (objectID) newObject.id = objectID;

      if (this.isNotEmpty(obj.agent)) {
        newObject.agent = obj.agent.id;
        newObject.agent__agent = obj.agent.agent;
      }
      if (this.isNotEmpty(obj.stratigraphy_base)) {
        newObject.stratigraphy_base = obj.stratigraphy_base.id;
        newObject.stratigraphy_base__stratigraphy = obj.stratigraphy_base.stratigraphy;
        newObject.stratigraphy_base__stratigraphy_en = obj.stratigraphy_base.stratigraphy_en;
      }
      if (this.isNotEmpty(obj.stratigraphy_top)) {
        newObject.stratigraphy_top = obj.stratigraphy_top.id;
        newObject.stratigraphy_top__stratigraphy = obj.stratigraphy_top.stratigraphy;
        newObject.stratigraphy_top__stratigraphy_en = obj.stratigraphy_top.stratigraphy_en;
      }
      if (this.isNotEmpty(obj.original_filename)) {
        newObject.attachment = obj.attachment.id;
        newObject.original_filename = obj.attachment.original_filename;
      }

      return newObject;
    },

    loadRelatedData(object) {
      let query;

      if (object === "drillcore_box") {
        query = fetchDrillcoreBoxes(
          this.$route.params.id,
          this.relatedData.searchParameters.drillcore_box
        );
      } else if (object === "drillcore_study") {
        query = fetchDrillcoreStudies(
          this.$route.params.id,
          this.relatedData.searchParameters.drillcore_study
        );
      } else if (object === "attachment") {
        query = fetchDrillcoreAttachments(
          this.$route.params.id,
          this.relatedData.searchParameters.attachment
        );
      }

      return new Promise(resolve => {
        query.then(response => {
          this.relatedData[object] = this.handleResponse(response);
          this.relatedData.count[object] = response.body.count;
          resolve(true);
        });
      });
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.drillcore = this.drillcore.id;

      // Todo: Use foreach because DRY basically

      if (this.isNotEmpty(uploadableObject.stratigraphy_base)) {
        uploadableObject.stratigraphy_base = uploadableObject.stratigraphy_base
          .id
          ? uploadableObject.stratigraphy_base.id
          : uploadableObject.stratigraphy_base;
      }
      if (this.isNotEmpty(uploadableObject.stratigraphy_top)) {
        uploadableObject.stratigraphy_top = uploadableObject.stratigraphy_top.id
          ? uploadableObject.stratigraphy_top.id
          : uploadableObject.stratigraphy_top;
      }
      if (this.isNotEmpty(uploadableObject.attachment)) {
        uploadableObject.attachment = uploadableObject.attachment.id
          ? uploadableObject.attachment.id
          : uploadableObject.attachment;
      }
      if (this.isNotEmpty(uploadableObject.agent)) {
        uploadableObject.agent = uploadableObject.agent.id
          ? uploadableObject.agent.id
          : uploadableObject.agent;
      }
      if (this.isNotEmpty(uploadableObject.date))
        uploadableObject.date = this.formatDateForUpload(
          uploadableObject.date
        );

      console.log("This object is sent in string format (related_data):");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    setDefaultSearchParameters() {
      return {
        drillcore: null,
        boxes: null,
        locality: null,
        storage: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    }
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}
</style>
