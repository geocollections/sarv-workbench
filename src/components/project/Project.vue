<template>
  <div class="project">
    <!-- ACTIVE PROJECT and NEW SITE -->
    <v-row v-if="$route.meta.isEdit">
      <v-col>
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
          :to="{
            name: 'Site add',
            query: { project: JSON.stringify(project) },
          }"
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
            $t("common.generalInfo")
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
        <div v-show="block.info" class="pa-1">
          <!-- NAME and NAME_EN -->
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="project.name"
                :color="bodyActiveColor"
                :label="$t('common.name')"
                use-state
              />
            </v-col>

            <v-col cols="12" md="6" class="pa-1">
              <input-wrapper
                v-model="project.name_en"
                :color="bodyActiveColor"
                :label="$t('common.name_en')"
                use-state
              />
            </v-col>
          </v-row>

          <!-- PROJECT_TYPE, OWNER and PARENT_PROJECT -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="project.project_type"
                :color="bodyActiveColor"
                :items="autocomplete.project_type"
                :loading="autocomplete.loaders.project_type"
                :item-text="nameLabel"
                :label="$t('common.type')"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="project.owner"
                :color="bodyActiveColor"
                :items="autocomplete.agent"
                :loading="autocomplete.loaders.owner"
                item-text="agent"
                :label="$t('common.owner')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteOwnerSearch"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <autocomplete-wrapper
                v-model="project.parent_project"
                :color="bodyActiveColor"
                :items="autocomplete.parent_project"
                :loading="autocomplete.loaders.parent_project"
                :item-text="nameLabel"
                :label="$t('project.parent_project')"
                is-link
                route-object="project"
                is-searchable
                v-on:search:items="autocompleteParentProjectSearch"
              />
            </v-col>
          </v-row>

          <!-- DATE_START, DATE_END and DATE_FREE -->
          <v-row no-gutters>
            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="project.date_start"
                :color="bodyActiveColor"
                :label="$t('common.date_start')"
                v-on:date:clear="project.date_start = null"
                v-on:date:update="updateUserInputtedDate('date_start', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <date-wrapper
                v-model="project.date_end"
                :color="bodyActiveColor"
                :label="$t('common.date_end')"
                v-on:date:clear="project.date_end = null"
                v-on:date:update="updateUserInputtedDate('date_end', $event)"
              />
            </v-col>

            <v-col cols="12" md="4" class="pa-1">
              <input-wrapper
                v-model="project.date_free"
                :color="bodyActiveColor"
                :label="$t('common.date_txt')"
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
            >{{ $t("common.description") }} | {{ $t("common.remarks") }}</span
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
        <div v-show="block.description" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="project.description"
                :color="bodyActiveColor"
                :label="$t('common.description')"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <textarea-wrapper
                v-model="project.remarks"
                :color="bodyActiveColor"
                :label="$t('common.remarks')"
              />
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
        <div v-show="block.members" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" class="pa-1">
              <autocomplete-wrapper
                v-model="relatedData.projectagent"
                :color="bodyActiveColor"
                :items="autocomplete.projectagent"
                :loading="autocomplete.loaders.projectagent"
                item-text="agent"
                :label="$t('site.project')"
                is-link
                route-object="agent"
                is-searchable
                v-on:search:items="autocompleteProjectAgentSearch"
                :multiple="true"
                v-on:chip:close="
                  relatedData.projectagent.splice(
                    relatedData.projectagent.indexOf($event),
                    1
                  )
                "
              />
            </v-col>
          </v-row>
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
          <file-input
            show-existing
            :files-from-object="relatedData.attachment_link"
            v-on:update:existing-files="addExistingFiles"
            v-on:file-uploaded="addFiles"
            :record-options="$route.meta.isEdit"
            accept-multiple
            show-attachment-link
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
            class="d-flex flex-row justify-start mt-1 mx-3"
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
                v-model="myShowMap"
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
                {{ myShowMap ? $t("site.mapEnabled") : $t("site.mapDisabled") }}
              </label>
            </v-card>
          </v-card>

          <!-- MAP -->
          <v-row no-gutters v-show="myShowMap" class="mt-2">
            <v-col cols="12" class="px-1">
              <map-component
                :show-map="myShowMap && block.sites"
                :gps-coords="true"
                mode="multiple"
                module="project"
                v-bind:location="{ lat: null, lng: null }"
                :locations="relatedData.sites.results"
              />
            </v-col>
          </v-row>

          <!-- ADD NEW and EXPORT -->
          <v-card
            class="d-flex flex-row justify-start mt-2 mb-3"
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
                  query: { project: JSON.stringify(project) },
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
            class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between pa-1 mt-2"
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
                :body-active-color="bodyActiveColor"
                :body-color="bodyColor"
              />
            </v-col>
          </v-row>
        </div>
      </transition>
    </v-card>

    <!-- IS_PRIVATE -->
    <v-row no-gutters class="my-3">
      <v-col>
        <checkbox-wrapper
          v-model="project.is_private"
          :color="bodyActiveColor"
          :label="$t('common.is_private')"
          @change="project.is_private = !project.is_private"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import formManipulation from "../../mixins/formManipulation";
import sidebarMixin from "../../mixins/sidebarMixin";
import autocompleteMixin from "../../mixins/autocompleteMixin";
import formSectionsMixin from "../../mixins/formSectionsMixin";
import cloneDeep from "lodash/cloneDeep";
import {
  fetchProject,
  fetchProjectType,
  fetchProjectAgent,
  fetchProjectAttachment,
  fetchLinkedSite,
} from "../../assets/js/api/apiCalls";

import MapComponent from "../partial/MapComponent";

import { mapActions, mapState } from "vuex";
import ExportButtons from "../partial/export/ExportButtons";
import SiteTable from "../site/SiteTable";
import debounce from "lodash/debounce";
import InputWrapper from "../partial/inputs/InputWrapper";
import TextareaWrapper from "../partial/inputs/TextareaWrapper";
import DateWrapper from "../partial/inputs/DateWrapper";
import AutocompleteWrapper from "../partial/inputs/AutocompleteWrapper";
import CheckboxWrapper from "../partial/inputs/CheckboxWrapper";
import FileInput from "../partial/inputs/FileInput";

export default {
  name: "Project",
  components: {
    FileInput,
    CheckboxWrapper,
    AutocompleteWrapper,
    DateWrapper,
    TextareaWrapper,
    InputWrapper,
    MapComponent,
    ExportButtons,
    SiteTable,
  },
  props: {
    isBodyActiveColorDark: {
      type: Boolean,
      required: false,
      default: true,
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange",
    },
    bodyColor: {
      type: String,
      required: false,
      default: "grey lighten-4",
    },
  },
  mixins: [
    formManipulation,
    autocompleteMixin,
    formSectionsMixin,
    sidebarMixin,
  ],

  data() {
    return this.setInitialData();
  },

  computed: {
    ...mapState("search", [
      "projectSearchParameters",
      "activeProject",
      "sidebarUserAction",
    ]),
    ...mapState("map", ["showMap"]),

    myShowMap: {
      get() {
        return this.showMap;
      },
      set(value) {
        this.updateShowMap(value);
      },
    },

    paginateByOptionsTranslated() {
      return this.paginateByOptions.map((item) => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value }),
        };
      });
    },
  },
  created() {
    // USED BY SIDEBAR
    if (this.$route.meta.isEdit) {
      this.setActiveSearchParameters({
        search: this.projectSearchParameters,
        request: "FETCH_PROJECTS",
        title: "header.projects",
        object: "project",
        field: "name",
      });
    }

    this.loadFullInfo();
  },

  watch: {
    "$route.params.id": {
      handler: function () {
        this.reloadData();
      },
      deep: true,
    },
    sidebarUserAction(newVal) {
      this.handleUserAction(newVal, "project", this.project);
    },
    "relatedData.searchParameters.site": {
      handler(newVal) {
        if (this.$route.meta.isEdit) {
          this.searchRelatedData(newVal, this.fetchLinkedSiteWrapper, "sites");
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    ...mapActions("search", ["setActiveProject"]),
    ...mapActions("map", ["updateShowMap"]),

    fetchLinkedSiteWrapper() {
      return new Promise((resolve) => {
        resolve(
          fetchLinkedSite(
            this.relatedData.searchParameters.site,
            this.$route.params.id
          )
        );
      });
    },

    setActiveProject(switchValue) {
      if (switchValue) this.setActiveProject(this.project);
      else this.setActiveProject(null);
    },

    setInitialData() {
      return {
        window: {
          width: 0,
          height: 0,
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
          "projectagent",
        ],
        autocomplete: {
          loaders: {
            project_type: false,
            parent_project: false,
            owner: false,
            projectagent: false,
            attachment: false,
          },
          project_type: [],
          parent_project: [],
          agent: [],
          projectagent: [],
          attachment: [],
        },
        requiredFields: ["name"],
        project: {},
        previousRecord: {},
        nextRecord: {},
        columns: [
          { id: "id", title: "common.id", type: "number" },
          { id: "name", title: "common.name", type: "text" },
          { id: "project", title: "site.project", type: "text" },
          {
            id: "date_start",
            title: "common.date_start",
            type: "text",
            isDate: true,
          },
          {
            id: "date_end",
            title: "common.date_end",
            type: "text",
            isDate: true,
          },
          {
            id: "date_free",
            title: "site.date_free",
            type: "text",
            isDate: true,
          },
        ],
        isActive: false,
        watchedSite: null,
        block: {
          info: true,
          description: true,
          members: true,
          files: true,
          sites: true,
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
      fetchProjectType().then((response) => {
        this.autocomplete.project_type = this.handleResponse(response);
      });

      if (this.$route.meta.isEdit) {
        this.setLoadingState(true);
        this.setLoadingType("fetch");
        this.$emit("set-object", "project");
        fetchProject(this.$route.params.id).then((response) => {
          let handledResponse = this.handleResponse(response);
          if (handledResponse.length > 0) {
            this.$emit("object-exists", true);
            this.$set(this, "project", this.handleResponse(response)[0]);
            // this.project = this.handleResponse(response)[0];
            this.fillAutocompleteFields(this.project);
            this.removeUnnecessaryFields(this.project, this.copyFields);
            this.project.related_data = {};
            // this.$set(this,'activeProject', this.checkIfProjectIsActive());
            this.$emit("data-loaded", this.project);
            this.setLoadingState(false);
            // this.getListRecords('project')
          } else {
            this.setLoadingState(false);
            this.$emit("object-exists", false);
          }
        });
        this.loadRelatedData("projectagent");
        this.loadRelatedData("attachment_link");
      } else {
        this.makeObjectReactive(this.$route.meta.object, this.copyFields);

        //set default user
        this.project.owner = {
          agent: this.getCurrentUser.user,
          id: this.getCurrentUser.id,
        };
        this.autocomplete.agent.push(this.project.owner);
      }
    },

    setDefaultRalatedData() {
      return {
        projectagent: [],
        attachment_link: [],
        sites: {
          count: 0,
          results: [],
        },
        searchParameters: {
          site: {
            page: 1,
            paginateBy: 100,
            sortBy: ["id"],
            sortDesc: [true],
          },
        },
        page: { projectagent: 1, attachment_link: 1 },
        paginateBy: { projectagent: 25, attachment_link: 25 },
        count: { projectagent: 0, attachment_link: 0 },
      };
    },

    formatDataForUpload(objectToUpload) {
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

      //add related data
      uploadableObject.related_data = {};
      if (this.relatedData.projectagent.length > 0) {
        uploadableObject.related_data.agent = this.relatedData.projectagent;
      } else uploadableObject.related_data.agent = null;
      if (this.relatedData.attachment_link.length > 0) {
        uploadableObject.related_data.attachment =
          this.relatedData.attachment_link.map((item) => {
            return { id: item.id };
          });
      } else uploadableObject.related_data.attachment = null;

      if (!this.isNotEmpty(uploadableObject.related_data))
        delete uploadableObject.related_data;

      console.log("This object is sent in string format:");
      console.log(uploadableObject);
      return JSON.stringify(uploadableObject);
    },

    fillAutocompleteFields(obj) {
      this.project.project_type = {
        name: obj.project_type__name,
        name_en: obj.project_type__name_en,
        id: obj.project_type,
      };

      //set current user as default owner

      // this.project.owner = this.isNotEmpty(this.project.owner) ? {agent:obj.owner__agent,id:obj.owner} : {agent:this.currentUser.user,id:this.currentUser.id}
      if (this.isNotEmpty(obj.owner)) {
        this.project.owner = { agent: obj.owner__agent, id: obj.owner };
        this.autocomplete.agent.push(this.project.owner);
      }
      if (this.isNotEmpty(obj.parent_project)) {
        this.project.parent_project = {
          name: obj.parent_project__name,
          name_en: obj.parent_project__name_en,
          id: obj.parent_project,
        };
        this.autocomplete.parent_project.push(this.project.parent_project);
      }
    },

    fillRelatedDataAutocompleteFields(obj, type) {
      let relatedData = cloneDeep(obj);
      obj = [];
      relatedData.forEach((entity) => {
        if (type === "projectagent") {
          let item = {
            agent: entity.projectagent__agent__agent,
            id: entity.projectagent__agent,
          };
          obj.push(item);
        } else obj.push(entity);
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
      if (query) {
        return new Promise(() => {
          //resolve it for my sites table
          // if(object === 'site') resolve(query);

          query.then((response) => {
            //projectagent do not have count value
            if (response.status === 200)
              this.relatedData[object] = response.data.results
                ? response.data.results
                : [];

            this.relatedData.count[object] = response.data.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(
              this.relatedData[object],
              object
            );

            if (object === "projectagent") {
              this.autocomplete.projectagent = this.relatedData[object];
            }
            if (object === "attachment_link") {
              this.autocomplete.attachment = this.relatedData[object];
            }
            // if(object === 'site')  this.forceMapRerender()
            this.setBlockVisibility(object, this.relatedData[object].length);
          });
        });
      }
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

    customLabelForAttachment(option) {
      return this.$i18n.locale === "ee"
        ? `${option.id} - (${option.description}) (${option.author__agent})`
        : `${option.id} - (${option.description_en}) (${option.author__agent})`;
    },

    addFiles(files, singleFileMetadata) {
      this.addFileAsRelatedDataNew(files, "project", singleFileMetadata);
    },

    addExistingFiles(files) {
      this.relatedData.attachment_link = files;
    },

    searchRelatedData: debounce(function (
      searchParameters,
      apiCall,
      relatedObject
    ) {
      apiCall().then((response) => {
        if (response.status === 200) {
          this.relatedData[relatedObject].count = response.data.count;
          this.relatedData[relatedObject].results = response.data.results;
        }
      });
    },
    50),
  },
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
