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
            <file-input
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
          <div v-show="activeTab === 'drillcore_box_images'">
            <v-btn
              class="my-3 mx-2"
              v-if="relatedData.drillcore_box_images.count > 0"
              :color="bodyActiveColor"
              dark
              @click="openDrillcorePrintView($route.params.id)"
            >
              <v-icon small class="pr-1">fas fa-print</v-icon>
              {{ $t("common.print") }}
            </v-btn>
            <v-divider class="mt-0" />
            <drillcore-box-list-view
              :data="relatedData.drillcore_box_images.results"
            >
              <template v-slot:itemTitle="{ item }">
                <router-link
                  :to="{ path: '/drillcore_box/' + item.drillcore_box }"
                  :title="$t('editDrillcoreBox.editMessage')"
                  class="sarv-link pt-3 ma-0"
                  :class="`${bodyActiveColor}--text`"
                >
                  <h5
                    v-translate="{
                      et: `Kast nr. ${item.drillcore_box__number} ${boxRange(
                        item
                      )}`,
                      en: `Box nr. ${item.drillcore_box__number} ${boxRange(
                        item
                      )}`,
                    }"
                  ></h5>
                </router-link>
              </template>
            </drillcore-box-list-view>
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
      <autocomplete-wrapper
        class="ml-auto"
        v-model="drillcore.database"
        :color="bodyActiveColor"
        :items="autocomplete.database"
        :loading="autocomplete.loaders.database"
        :item-text="nameLabel"
        :label="$t('common.institution')"
      />
    </div>
    <v-row no-gutters class="mt-2">
      <v-col>
        <object-permissions-create
          v-if="!$route.meta.isEdit"
          @change="handlePermissionsChange"
        />
      </v-col>
    </v-row>
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
  fetchRelatedDrillcoreBoxes,
  fetchObjectPermissions,
} from "../../assets/js/api/apiCalls";
import cloneDeep from "lodash/cloneDeep";
import InputWrapper from "../partial/inputs/InputWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileInput from "../partial/inputs/FileInput";
import DrillcoreBoxTable from "./relatedTables/DrillcoreBoxTable";
import DrillcoreStudyTable from "./relatedTables/DrillcoreStudyTable";
import requestsMixin from "../../mixins/requestsMixin";
import { mapActions, mapState, mapGetters } from "vuex";
import {
  fetchRelatedDrillcoreBoxImages,
  fetchDatabase,
} from "@/assets/js/api/apiCalls";
import DrillcoreBoxListView from "@/components/drillcore_box/DrillcoreBoxListView";
import Pagination from "@/components/partial/Pagination";
import ObjectPermissionsCreate from "../partial/ObjectPermissionsCreate.vue";

export default {
  name: "Drillcore",

  components: {
    Pagination,
    DrillcoreBoxListView,
    DrillcoreStudyTable,
    DrillcoreBoxTable,
    FileInput,
    CheckboxWrapper,
    TextareaWrapper,
    AutocompleteWrapper,
    InputWrapper,
    ObjectPermissionsCreate,
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
    requestsMixin,
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
        field: "drillcore",
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        this.setInitialData();
        this.reloadData();
      },
      deep: true,
    },
    "relatedData.searchParameters": {
      handler: function () {
        this.loadRelatedData(this.activeTab);
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters("user", ["getDatabaseId"]),
    ...mapState("search", ["drillcoreSearchParameters"]),

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },

  methods: {
    ...mapActions("search", ["updateActiveTab"]),
    handlePermissionsChange(perms) {
      this.initialPermissions = perms;
    },
    boxRange(item) {
      if (!item.drillcore_box__depth_start && !item.drillcore_box__depth_end) {
        return "";
      }

      return `(${item.drillcore_box__depth_start ?? ""} - ${
        item.drillcore_box__depth_end ?? ""
      } m)`;
    },
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
          { name: "drillcore_box", iconClass: "fas fa-box" },
          { name: "drillcore_box_images", iconClass: "fas fa-camera-retro" },
          { name: "drillcore_study", iconClass: "fas fa-school" },
          { name: "attachment_link", iconClass: "far fa-folder-open" },
        ],
        activeTab: "drillcore_box",
        relatedData: this.setDefaultRelatedData(),
        initialPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
        currentPermissions: {
          groups_view: [],
          groups_change: [],
          users_view: [],
          users_change: [],
        },
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
          "is_private",
          "database",
        ],
        autocomplete: {
          loaders: {
            locality: false,
            agent: false,
            list_drillcore_storage: false,
            storage: false,
            attachment: false,
            stratigraphy_base: false,
            stratigraphy_top: false,
            database: false,
          },
          locality: [],
          agent: [],
          list_drillcore_storage: [],
          storage: [],
          attachment: [],
          stratigraphy_base: [],
          stratigraphy_top: [],
          database: [],
        },
        requiredFields: ["drillcore", "drillcore_en"],
        drillcore: {},
        block: {
          info: true,
          details: true,
        },
        paginateByOptions: [
          { text: "main.pagination", value: 10 },
          { text: "main.pagination", value: 25 },
          { text: "main.pagination", value: 50 },
          { text: "main.pagination", value: 100 },
          { text: "main.pagination", value: 250 },
          { text: "main.pagination", value: 500 },
          { text: "main.pagination", value: 1000 },
        ],
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
        fetchDrillcore(this.$route.params.id).then((response) => {
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
          fetchObjectPermissions(this.drillcore.id, "drillcore").then((res) => {
            this.currentPermissions.groups_change =
              res.data.group
                ?.filter(
                  (perm) => perm.permission__codename === "change_drillcore"
                )
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.groups_view =
              res.data.group
                ?.filter(
                  (perm) => perm.permission__codename === "view_drillcore"
                )
                .map((perm) => perm.group_id) ?? [];
            this.currentPermissions.users_change =
              res.data.user
                ?.filter(
                  (perm) => perm.permission__codename === "change_drillcore"
                )
                .map((perm) => perm.user_id) ?? [];
            this.currentPermissions.users_view =
              res.data.user
                ?.filter(
                  (perm) => perm.permission__codename === "view_drillcore"
                )
                .map((perm) => perm.user_id) ?? [];
          });
        });

        // Load Related Data which is in tabs
        this.relatedTabs.forEach((tab) => this.loadRelatedData(tab.name));

        this.$on("tab-changed", this.setTab);

        this.$emit(
          "related-data-info",
          this.relatedTabs.map((tab) => tab.name)
        );
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);
        if (this.getDatabaseId !== null) {
          this.drillcore.database = {
            id: this.getDatabaseId,
          };
        }
      }
    },

    loadAutocompleteFields() {
      fetchListDrillcoreStorage().then(
        (response) =>
          (this.autocomplete.list_drillcore_storage =
            this.handleResponse(response))
      );
      fetchDatabase().then(
        (response) =>
          (this.autocomplete.database = this.handleResponse(response))
      );
    },

    setDefaultRelatedData() {
      return {
        drillcore_box: { count: 0, results: [] },
        drillcore_box_images: { count: 0, results: [] },
        drillcore_study: { count: 0, results: [] },
        attachment_link: { count: 0, results: [] },
        searchParameters: {
          drillcore_box: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          drillcore_box_images: {
            page: 1,
            paginateBy: 10,
            sortBy: ["drillcore_box__depth_start"],
            sortDesc: [false],
          },
          drillcore_study: {
            page: 1,
            paginateBy: 10,
            sortBy: ["id"],
            sortDesc: [true],
          },
          attachment_link: {
            page: 1,
            paginateBy: 100,
            sortBy: ["original_filename"],
            sortDesc: [true],
          },
        },
      };
    },

    formatDataForUpload(objectToUpload, saveAsNew = false) {
      let uploadableObject = cloneDeep(objectToUpload);

      Object.keys(uploadableObject).forEach((key) => {
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
        this.relatedTabs.forEach((tab) => {
          if (this.relatedData[tab.name].count > 0)
            if (tab.name === "attachment_link") {
              uploadableObject.related_data.attachment =
                this.relatedData.attachment_link.results.map((item) => {
                  return { id: item.id };
                });
            } else {
              uploadableObject.related_data[tab.name] =
                this.relatedData[tab.name].results;

              uploadableObject.related_data[tab.name].forEach((item) => {
                Object.keys(item).forEach((key) => {
                  if (typeof item[key] === "object" && item[key] !== null) {
                    item[key] = item[key].id ? item[key].id : null;
                  }
                });
              });
            }
        });
        uploadableObject.initial_permissions = this.initialPermissions;
      } else {
        if (this.relatedData.attachment_link.results.length > 0) {
          uploadableObject.related_data.attachment =
            this.relatedData.attachment_link.results.map((item) => {
              return { id: item.id };
            });
        } else uploadableObject.related_data.attachment = null;
      }

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;
      if (saveAsNew) delete uploadableObject.related_data;
      if (saveAsNew) {
        uploadableObject.initial_permissions = this.currentPermissions;
      }

      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      if (this.isNotEmpty(obj.locality)) {
        this.drillcore.locality = {
          id: obj.locality,
          locality: obj.locality__locality,
          locality_en: obj.locality__locality_en,
        };
        this.autocomplete.locality.push(this.drillcore.locality);
      }
      if (this.isNotEmpty(obj.agent)) {
        this.drillcore.agent = {
          id: obj.agent,
          agent: obj.agent__agent,
        };
        this.autocomplete.agent.push(this.drillcore.agent);
      }
      this.drillcore.depository = {
        id: obj.depository,
        value: obj.depository__value,
        value_en: obj.depository__value_en,
      };
      this.drillcore.database = {
        id: obj.database,
        value: obj.database__name,
        value_en: obj.database__name_en,
      };
      if (this.isNotEmpty(obj.storage)) {
        this.drillcore.storage = {
          id: obj.storage,
          location: obj.storage__location,
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
      } else if (object === "drillcore_box_images") {
        query = fetchRelatedDrillcoreBoxImages(
          this.$route.params.id,
          this.relatedData.searchParameters.drillcore_box_images
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

      if (query) {
        query.then((response) => {
          this.relatedData[object].count = response.data.count;
          this.relatedData[object].results = this.handleResponse(response);
        });
      }
    },

    openDrillcorePrintView(id) {
      let routeData = this.$router.resolve({
        path: "/drillcore_print/" + id,
      });
      window.open(routeData.href, "_blank", "width=1000,height=750");
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "drillcore", singleFileMetadata);
    },
    addExistingFiles(files) {
      // this.relatedData.attachment_link.count = files.length;
      this.relatedData.attachment_link.results = files;
    },
  },
};
</script>

<style scoped></style>
