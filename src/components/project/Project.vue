<template>
  <div class="project">
    <spinner
      v-show="sendingData"
      class="loading-overlay"
      size="massive"
      :message="
        $route.meta.isEdit ? $t('edit.overlayLoading') : $t('add.overlay')
      "
    ></spinner>

    <!-- ACTIVE PROJECT and NEW SITE -->
    <v-row v-if="$route.meta.isEdit">
      <v-col>
        <add-new-site
          :sendingData="sendingData"
          :site="watchedSite"
        ></add-new-site>

        <v-switch
          class="vuetify-switch mt-0"
          inset
          @change="setActiveProject"
          :input-value="!!activeProject"
          hide-details
          color="blue"
        >
          <template v-slot:label>
            <div :class="{ 'green--text': !!activeProject }">
              <v-icon x-small :class="{ 'green--text': !!activeProject }"
                >fas fa-tag</v-icon
              >
              {{ $t("frontPage.active") }}
            </div>
          </template>
        </v-switch>
      </v-col>

      <v-col class="text-right">
        <v-btn
          dark
          color="blue"
          :to="{ name: 'Site add', params: { project: project } }"
        >
          <v-icon left small>fas fa-globe-americas</v-icon>
          {{ $t("project.newSite") }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- GENERAL INFO -->
    <v-card
      class="mt-2"
      id="block-info"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.info = !block.info">
          <span :class="validate('project') ? 'green--text' : 'red--text'">{{
            $t("project.generalInfo")
          }}</span>
          <v-icon
            right
            :class="validate('project') ? 'green--text' : 'red--text'"
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
          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <label :for="`name`">{{ $t("project.name") }}:</label>
              <b-form-input
                size="sm"
                id="name"
                v-model="project.name"
                :state="isNotEmpty(project.name)"
                type="text"
                maxlength="100"
              ></b-form-input>
            </v-col>

            <v-col cols="12" md="6" class="px-1">
              <label :for="`name_en`">{{ $t("project.name_en") }}:</label>
              <b-form-input
                size="sm"
                id="name_en"
                v-model="project.name_en"
                type="text"
                maxlength="100"
              ></b-form-input>
            </v-col>
          </v-row>

          <!-- PROJECT_TYPE, OWNER and PARENT_PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`type`">{{ $t("project.project_type") }}:</label>
              <vue-multiselect
                v-model="project.project_type"
                id="type"
                :options="autocomplete.project_type"
                v-bind:class="{
                  valid: isNotEmpty(project.project_type),
                  invalid: !isNotEmpty(project.project_type)
                }"
                track-by="id"
                :label="nameLabel"
                :placeholder="$t('add.inputs.autocomplete')"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`owner`">{{ $t("project.owner") }}:</label>
              <vue-multiselect
                v-model="project.owner"
                id="owner"
                label="agent"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.owner"
                :options="autocomplete.agent"
                @search-change="autocompleteOwnerSearch"
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

            <v-col cols="12" md="4" class="px-1">
              <label :for="`parent_project`"
                >{{ $t("project.parent_project") }}:</label
              >
              <vue-multiselect
                v-model="project.parent_project"
                id="parent_project"
                :label="nameLabel"
                track-by="id"
                :placeholder="$t('add.inputs.autocomplete')"
                :loading="autocomplete.loaders.parent_project"
                :options="autocomplete.parent_project"
                @search-change="autocompleteParentProjectSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :show-labels="false"
              >
                <template slot="singleLabel" slot-scope="{ option }"
                  ><strong> {{ option[nameLabel] }}</strong></template
                >
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-col>
          </v-row>

          <!-- DATE_START, DATE_END and DATE_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_start`" class="p-0"
                >{{ $t("project.date_start") }}:</label
              >
              <datepicker
                id="date_start"
                v-model="project.date_start"
                use-utc="true "
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_end`" class="p-0"
                >{{ $t("project.date_end") }}:</label
              >
              <datepicker
                id="date_end"
                v-model="project.date_end"
                use-utc="true "
                lang="en"
                :first-day-of-week="1"
                format="DD MMM YYYY"
                input-class="form-control form-control-sm"
              ></datepicker>
            </v-col>

            <v-col cols="12" md="4" class="px-1">
              <label :for="`date_free`" class="p-0"
                >{{ $t("project.date_free") }}:</label
              >
              <b-form-input
                size="sm"
                id="date_free"
                v-model="project.date_free"
                type="text"
                maxlength="10"
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
          <span
            >{{ $t("project.description") }} | {{ $t("project.remarks") }}</span
          >
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
        <div v-show="block.description" class="px-1 pt-1 pb-2">
          <v-row no-gutters class="mb-2">
            <v-col cols="12" class="px-1">
              <editor :data.sync="project.description" />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <editor :data.sync="project.remarks" />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- PROJECT MEMBERS -->
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
          <span>{{ $t("project.members") }}</span>
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
        <div v-show="block.members" class="px-1 pt-1 pb-2">
          <v-card
            flat
            tile
            class="d-flex flex-row justify-space-between"
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card
              flat
              tile
              class="px-1 flex-grow-1"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <vue-multiselect
                v-model="relatedData.projectagent"
                id="projectagent"
                label="agent"
                track-by="id"
                :multiple="true"
                :placeholder="$t('add.inputs.autocomplete')"
                :options="autocomplete.agent"
                :loading="autocomplete.loaders.projectagent"
                @search-change="autocompleteProjectAgentSearch"
                :internal-search="false"
                :preserve-search="true"
                :clear-on-select="false"
                :close-on-select="false"
                :show-labels="false"
              >
                <template slot="noResult"
                  ><b>{{ $t("messages.inputNoResults") }}</b></template
                >
              </vue-multiselect>
            </v-card>

            <v-card
              flat
              tile
              class="px-1"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-btn
                icon
                :disabled="!isNotEmpty(relatedData.projectagent)"
                @click="relatedData.projectagent = []"
                color="red"
              >
                <v-icon>far fa-trash-alt</v-icon>
              </v-btn>
            </v-card>
          </v-card>
        </div>
      </transition>
    </v-card>

    <!-- FILES -->
    <v-card
      class="mt-2"
      id="block-files"
      v-if="$route.meta.isEdit"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.files = !block.files">
          <span>{{ $t("project.files") }}</span>
          <v-icon right>fas fa-folder-open</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.files = !block.files"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.files ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.files" class="px-1 pt-1 pb-2">
          <multimedia-component
            v-on:file-uploaded="addFiles"
            :recordOptions="false"
            style="margin-right: -10px; margin-left: -10px"
            class="multimedia-component"
          />
          <file-table
            :attachments="relatedData.attachment_link"
            :object="'project'"
            v-if="relatedData.attachment_link.length > 0"
          />
        </div>
      </transition>
    </v-card>

    <!-- SITES -->
    <v-card
      class="mt-2"
      id="block-sites"
      v-if="$route.meta.isEdit"
      :color="bodyColor.split('n-')[0] + 'n-5'"
      elevation="4"
    >
      <v-card-title class="pt-2 pb-1">
        <div class="card-title--clickable" @click="block.sites = !block.sites">
          <span>{{ $t("project.sites") }}</span>
          <v-icon right>fas fa-globe-americas</v-icon>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="block.sites = !block.sites"
          :color="bodyActiveColor"
        >
          <v-icon>{{
            block.sites ? "fas fa-angle-up" : "fas fa-angle-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <transition>
        <div v-show="block.sites" class="px-1 pt-1 pb-2">
          <!-- MAP SWITCH -->
          <v-card
            class="d-flex flex-row justify-content-start mt-1 mx-3"
            flat
            tile
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card
              flat
              tile
              class="align-self-center mr-2"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-switch
                v-model="showCollapseMap"
                hide-details
                id="map-switch"
                class="vuetify-switch my-1"
              ></v-switch>
            </v-card>

            <v-card
              flat
              tile
              class="align-self-center"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <label class="m-0" :for="`map-switch`">
                <i class="far fa-map"></i>
                {{
                  showCollapseMap
                    ? $t("site.mapEnabled")
                    : $t("site.mapDisabled")
                }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <transition enter-active-class="animated fadeIn faster">
            <v-row no-gutters v-show="showCollapseMap" class="mt-2">
              <v-col cols="12" class="px-1">
                <map-component
                  :gps-coords="true"
                  mode="multiple"
                  v-if="showCollapseMap"
                  module="project"
                  v-bind:location="{ lat: null, lng: null }"
                  :locations="relatedData.sites.results"
                />
              </v-col>
            </v-row>
          </transition>

          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-content-start mt-2 mb-3"
            flat
            tile
            :color="bodyColor.split('n-')[0] + 'n-5'"
          >
            <v-card
              flat
              tile
              class="px-1"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <v-btn
                :to="{
                  name: 'Site add',
                  query: { project: JSON.stringify(project) }
                }"
                target="newProjectWindow"
                :color="bodyActiveColor"
                :dark="isBodyActiveColorDark"
                >{{ $t("add.new") }}</v-btn
              >
            </v-card>

            <v-card
              flat
              tile
              class="px-1"
              :color="bodyColor.split('n-')[0] + 'n-5'"
            >
              <export-buttons
                filename="site"
                :table-data="relatedData.sites.results"
              ></export-buttons>
            </v-card>
          </v-card>

          <!-- PAGINATION -->
          <div
            v-if="relatedData.sites.count > 10"
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between px-1"
          >
            <div class="mr-3 mb-3">
              <v-select
                v-model="relatedData.searchParameters.site.paginateBy"
                color="blue"
                dense
                :items="paginateByOptionsTranslated"
                item-color="blue"
                label="Paginate by"
                hide-details
              />
            </div>

            <div>
              <v-pagination
                v-model="relatedData.searchParameters.site.page"
                color="blue"
                circle
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
                :length="
                  Math.ceil(
                    relatedData.sites.count /
                      relatedData.searchParameters.site.paginateBy
                  )
                "
                :total-visible="5"
              />
            </div>
          </div>

          <v-row no-gutters>
            <v-col cols="12" class="px-1">
              <site-table
                ref="table"
                :response="relatedData.sites"
                :search-parameters="relatedData.searchParameters.site"
                v-if="relatedData.sites.count > 0"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-3">
      <v-col>
        <v-checkbox
          v-model="project.is_private"
          id="is_private"
          :label="$t('project.is_private')"
          hide-details
          :color="bodyActiveColor"
          class="mt-0 vuetify-checkbox"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Datepicker from "vue2-datepicker";
import formManipulation from "../../mixins/formManipulation";
import sidebarMixin from "../../mixins/sidebarMixin";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchProjects,
  fetchProject,
  fetchProjectType,
  fetchProjectAgent,
  fetchProjectAttachment,
  fetchLinkedSite
} from "../../assets/js/api/apiCalls";

import MapComponent from "../partial/MapComponent";

import FileTable from "../partial/FileTable";
import MultimediaComponent from "../partial/MultimediaComponent";
import AddNewSite from "./addOrEditSiteModal";
import Editor from "../partial/editor/Editor";
import { mapState } from "vuex";
import ExportButtons from "../partial/export/ExportButtons";
import SiteTable from "../site/SiteTable";
import debounce from "lodash/debounce";

export default {
  name: "Project",
  components: {
    Editor,
    AddNewSite,
    MultimediaComponent,
    FileTable,
    MapComponent,
    Datepicker,
    Spinner,
    ExportButtons,
    SiteTable
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4"
    }
  },
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    sidebarMixin
  ],

  data() {
    return this.setInitialData();
  },
  computed: {
    ...mapState(["currentUser", "databaseId", "activeProject"]),

    sidebarUserAction() {
      return this.$store.state["sidebarUserAction"];
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
        searchHistory: "projectSearchHistory",
        defaultSearch: this.searchParameters,
        search: params,
        request: "FETCH_PROJECTS",
        title: "header.projects",
        object: "project",
        field: "name",
        block: this.block
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
    sidebarUserAction(newVal) {
      this.$_handleUserAction(newVal, "project", this.project);
    },
    "relatedData.searchParameters.site": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(newVal, this.fetchLinkedSiteWrapper, "sites");
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    fetchLinkedSiteWrapper() {
      return new Promise(resolve => {
        resolve(
          fetchLinkedSite(
            this.relatedData.searchParameters.site,
            this.$route.params.id
          )
        );
      });
    },

    setActiveProject(switchValue) {
      console.log(switchValue);
      if (switchValue) this.$store.dispatch("setActiveProject", this.project);
      else this.$store.dispatch("setActiveProject", null);
    },

    setInitialData() {
      return {
        searchHistory: "projectSearchHistory",
        window: {
          width: 0,
          height: 0
        },
        relatedData: this.setDefaultRalatedData(),
        copyFields: [
          "id",
          "name",
          "name_en",
          "project_type",
          "parent_project",
          "date_start",
          "date_end",
          "date_free",
          "description",
          "owner",
          "remarks",
          "is_private",
          "projectagent"
        ],
        autocomplete: {
          loaders: {
            project_type: false,
            parent_project: false,
            owner: false,
            projectagent: false,
            attachment: false
          },
          project_type: [],
          parent_project: [],
          agent: [],
          projectagent: [],
          attachment: []
        },
        requiredFields: ["name"],
        project: {},
        previousRecord: {},
        nextRecord: {},
        searchParameters: this.setDefaultSearchParameters(),
        columns: [
          { id: "id", title: "site.id", type: "number" },
          { id: "name", title: "site.name", type: "text" },
          { id: "project", title: "site.project", type: "text" },
          {
            id: "date_start",
            title: "site.date_start",
            type: "text",
            isDate: true
          },
          {
            id: "date_end",
            title: "site.date_end",
            type: "text",
            isDate: true
          },
          {
            id: "date_free",
            title: "site.date_free",
            type: "text",
            isDate: true
          }
        ],
        isActive: false,
        attachmentLinkSaved: -1,
        watchedSite: null,
        block: {
          info: true,
          description: true,
          members: true,
          files: true,
          sites: true
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
      fetchProjectType().then(response => {
        this.autocomplete.project_type = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.sendingData = true;
        this.$emit("set-object", "project");
        fetchProject(this.$route.params.id).then(response => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.project = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.project);
            this.removeUnnecessaryFields(this.project, this.copyFields);
            this.project.related_data = {};
            // this.$set(this,'activeProject', this.checkIfProjectIsActive());
            this.$emit("data-loaded", this.project);
            this.sendingData = false;
            // this.getListRecords('project')
          } else {
            this.sendingData = false;
            this.$emit("object-exists", false);
          }
        });
        this.loadRelatedData("projectagent");
        this.loadRelatedData("attachment_link");
      } else {
        //set default user
        this.project.owner = {
          agent: this.currentUser.user,
          id: this.currentUser.id
        };
      }
    },

    setDefaultRalatedData() {
      return {
        projectagent: [],
        attachment_link: [],
        sites: {
          count: 0,
          results: []
        },
        searchParameters: {
          site: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true]
          }
        },
        page: { projectagent: 1, attachment_link: 1 },
        paginateBy: { projectagent: 25, attachment_link: 25 },
        count: { projectagent: 0, attachment_link: 0 }
      };
    },

    formatDataForUpload(objectToUpload, saveRelatedData = false) {
      let uploadableObject = cloneDeep(objectToUpload);

      if (this.isNotEmpty(objectToUpload.date_start))
        uploadableObject.date_start = this.formatDateForUpload(
          objectToUpload.date_start
        );
      if (this.isNotEmpty(objectToUpload.date_end))
        uploadableObject.date_end = this.formatDateForUpload(
          objectToUpload.date_end
        );

      //autocomplete fields
      if (this.isNotEmpty(objectToUpload.project_type))
        uploadableObject.project_type = objectToUpload.project_type.id;
      if (this.isNotEmpty(objectToUpload.parent_project))
        uploadableObject.parent_project = objectToUpload.parent_project.id;
      if (this.isNotEmpty(objectToUpload.owner))
        uploadableObject.owner = objectToUpload.owner.id;

      //add related data
      uploadableObject.related_data = {};
      uploadableObject.related_data.agent = this.relatedData.projectagent;
      if (saveRelatedData) {
        uploadableObject.related_data.attachment = this.relatedData.attachment_link;
      }
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },
    fillAutocompleteFields(obj) {
      this.project.project_type = {
        name: obj.project_type__name,
        name_en: obj.project_type__name_en,
        id: obj.project_type
      };

      //set current user as default owner

      // this.project.owner = this.isNotEmpty(this.project.owner) ? {agent:obj.owner__agent,id:obj.owner} : {agent:this.currentUser.user,id:this.currentUser.id}
      this.project.owner = { agent: obj.owner__agent, id: obj.owner };

      this.project.parent_project = {
        name: obj.parent_project__name,
        name_en: obj.parent_project__name_en,
        id: obj.parent_project
      };
    },

    fillRelatedDataAutocompleteFields(obj, type) {
      let relatedData = cloneDeep(obj);
      obj = [];
      relatedData.forEach(entity => {
        if (type === "projectagent")
          obj.push({
            agent: entity.projectagent__agent__agent,
            id: entity.projectagent__agent
          });
        else obj.push(entity);
      });
      return obj;
    },

    loadRelatedData(object) {
      let query;
      if (object === "projectagent") {
        query = fetchProjectAgent(
          this.$route.params.id,
          this.relatedData.page.projectagent
        );
      } else if (object === "attachment_link") {
        query = fetchProjectAttachment(
          this.$route.params.id,
          this.relatedData.page.attachment_link
        );
      }
      return new Promise(() => {
        //resolve it for my sites table
        // if(object === 'site') resolve(query);

        query.then(response => {
          //projectagent do not have count value
          if (response.status === 200)
            this.relatedData[object] = response.body.results
              ? response.body.results
              : [];

          this.relatedData.count[object] = response.body.count;
          this.relatedData[object] = this.fillRelatedDataAutocompleteFields(
            this.relatedData[object],
            object
          );
          // if(object === 'site')  this.forceMapRerender()
          this.setBlockVisibility(object, this.relatedData[object].length);
        });
      });
    },
    setBlockVisibility(object, count) {
      if (object === "projectagent") this.block.members = count > 0;
      if (object === "attachment_link") this.block.files = count > 0;
      if (object === "site") this.block.sites = count > 0;
    },

    formatRelatedData(objectToUpload) {
      let uploadableObject = cloneDeep(objectToUpload);
      uploadableObject.project = this.project.id;

      // console.log(JSON.stringify(uploadableObject));
      return JSON.stringify(uploadableObject);
    },

    fetchList(localStorageData) {
      let params =
        this.isNotEmpty(localStorageData) &&
        localStorageData !== "fallbackValue" &&
        localStorageData !== "[object Object]"
          ? localStorageData
          : this.searchParameters;
      return new Promise(resolve => {
        resolve(fetchProjects(params, this.currentUser.id));
      });
    },

    setDefaultSearchParameters() {
      return {
        owner: null,
        id: null,
        page: 1,
        paginateBy: 50,
        sortBy: ["id"],
        sortDesc: [true]
      };
    },

    customLabelForAttachment(option) {
      return this.$i18n.locale === "ee"
        ? `${option.id} - (${option.description}) (${option.author__agent})`
        : `${option.id} - (${option.description_en}) (${option.author__agent})`;
    },

    addFiles(files) {
      this.addFileAsRelatedDataNew(files, "project");
    },

    searchRelatedData: debounce(function(
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then(response => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.body.count;
          this.relatedData[relatedObject].results = response.body.results;
        }
      });
    },
    500)
  }
};
</script>

<style scoped>
label {
  margin: 0;
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8rem;
}

.card-title--clickable:hover {
  cursor: pointer;
  opacity: 0.8;
}

/* Multiselect component size override */
.project >>> .multiselect {
  min-height: 31px;
  /*height: 31px;*/
}

.project >>> .multiselect__tags {
  min-height: 31px;
  /*height: 31px;*/
  padding: 4px 40px 4px 8px;
}

.project >>> .multiselect--active > .multiselect__tags {
  min-height: 40px;
  height: unset;
  padding: 8px 40px 0px 8px;
}

.project >>> .multiselect__select {
  min-height: 29px;
  height: 29px;
}

.project >>> .multiselect__single {
  padding: 0;
  margin-bottom: 0;
  font-size: 0.875rem;
}

.project >>> .multiselect__placeholder {
  padding: 0;
  margin-bottom: 0;
}

.project >>> .multiselect__tag {
  margin-bottom: 0;
}
</style>
