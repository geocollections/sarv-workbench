<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive"
             :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>

    <!-- ACTIVE PROJECT and NEW SITE -->
    <v-row v-if="$route.meta.isEdit">
      <v-col>
        <add-new-site :sendingData="sendingData" :site="watchedSite"></add-new-site>

        <v-switch
          class="vuetify-switch mt-0"
          inset
          v-model="isActiveProject"
          hide-details
          color="blue"
        >
          <template v-slot:label>
            <div :class="{ 'green--text': isActiveProject }">
              <v-icon x-small :class="{ 'green--text': isActiveProject }">fas fa-tag</v-icon>
              {{ isActiveProject ? $t('frontPage.active') : $t('frontPage.non_active') }}
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
          {{ $t('project.newSite') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- GENERAL INFO -->
    <fieldset class="border-top px-2 mb-2" ref="info" id="block-info">
      <legend class="w-auto my-0" :class="{'text-primary': !block.info}" @click="block.info = !block.info">
        {{ $t('project.generalInfo') }}
        <i class="fas fa-project-diagram"></i>
      </legend>

      <transition name="fade">
        <div v-show="block.info">
          <div class="row">
            <div class="col-md-6">
              <label :for="`name`">{{ $t('project.name') }}:</label>
              <b-form-input id="name" v-model="project.name" :state="isNotEmpty(project.name)" type="text"
                            maxlength="100"></b-form-input>
            </div>

            <div class="col-md-6">
              <label :for="`name_en`">{{ $t('project.name_en') }}:</label>
              <b-form-input id="name_en" v-model="project.name_en" type="text" maxlength="100"></b-form-input>
            </div>
          </div>
          <div class="row">

            <div class="col-md-4">
              <label :for="`type`">{{ $t('project.project_type') }}:</label>
              <vue-multiselect v-model="project.project_type"
                               id="type"
                               :options="autocomplete.project_type"
                               v-bind:class="{ valid: isNotEmpty(project.project_type), invalid: !isNotEmpty(project.project_type) }"
                               track-by="id"
                               :label="nameLabel"
                               :placeholder="$t('add.inputs.autocomplete')"
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option[nameLabel] }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-md-4">
              <label :for="`owner`">{{ $t('project.owner') }}:</label>
              <vue-multiselect v-model="project.owner"
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
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.agent }}</strong>
                </template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>

            <div class="col-sm-4">
              <label :for="`parent_project`">{{ $t('project.parent_project') }}:</label>
              <vue-multiselect v-model="project.parent_project"
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
                               :show-labels="false">
                <template slot="singleLabel" slot-scope="{ option }"><strong>
                  {{option[nameLabel] }}</strong></template>
                <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
              </vue-multiselect>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <label :for="`date_start`" class="p-0">{{ $t('project.date_start') }}:</label>
              <datepicker id="date_start"
                          v-model="project.date_start"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_end`" class="p-0">{{ $t('project.date_end') }}:</label>
              <datepicker id="date_end"
                          v-model="project.date_end"
                          use-utc="true "
                          lang="en"
                          :first-day-of-week="1"
                          format="DD MMM YYYY"
                          input-class="form-control"></datepicker>
            </div>

            <div class="col-sm-4">
              <label :for="`date_free`" class="p-0">{{ $t('project.date_free') }}:</label>
              <b-form-input id="date_free" v-model="project.date_free" type="text" maxlength="10"/>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- DESCRIPTION -->
    <fieldset class="border-top px-2 mb-2" id="block-description">
      <legend class="w-auto my-0" :class="{'text-primary': !block.description}" @click="block.description = !block.description">
        {{ $t('project.description') }} | {{ $t('project.remarks') }}
        <i class="fas fa-pen-fancy"></i>
      </legend>
      <transition name="fade">
        <div  v-show="block.description">
          <div class="row">
            <div class="col-sm-12 mb-2">
              <editor :data.sync="project.description"/>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12 mb-2">
              <editor :data.sync="project.remarks"/>
            </div>
          </div>
        </div>

      </transition>
    </fieldset>

    <!-- PROJECT MEMBERS -->
    <fieldset class="border-top px-2 mb-2" id="block-members">
      <legend class="w-auto my-0" :class="{'text-primary': !block.members}" @click="block.members = !block.members">
        {{ $t('project.members') }}
        <i class="fas fa-user-friends"></i>
      </legend>
      <transition name="fade">
        <div class="row" v-show="block.members">

          <div class="col-11 mb-2 mr-0">
            <vue-multiselect v-model="relatedData.projectagent"
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
                             :show-labels="false">
              <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
            </vue-multiselect>
          </div>

          <div class="col-1 mb-2 ml-0 pl-0">
            <button class="btn btn-outline-danger"
                    :disabled="!isNotEmpty(relatedData.projectagent)"
                    @click="relatedData.projectagent = []">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </transition>
    </fieldset>

    <!-- FILES -->
    <fieldset class="border-top px-2 mb-2" id="block-files" ref="files" v-if="$route.meta.isEdit">
      <legend class="w-auto my-0" :class="{'text-primary': !block.files}" @click="block.files = !block.files">
        {{ $t('project.files') }}
        <i class="fas fa-folder-open"></i>
      </legend>
      <transition name="fade">
        <div class="row p-3" v-show="block.files">
          <div class="col-sm-12">
            <multimedia-component v-on:file-uploaded="addFiles" :recordOptions="false"/>
          </div>

          <div class="col-sm-12">
            <file-table :attachments="relatedData.attachment_link" :object="'project'" v-if="relatedData.attachment_link.length > 0"/>
          </div>
        </div>

      </transition>
    </fieldset>

    <!-- SITES -->
    <fieldset class="border-top px-2 mb-2" id="block-sites" ref="sites" v-if="$route.meta.isEdit">
      <legend class="w-auto my-0" :class="{'text-primary': !block.sites}" @click="block.sites = !block.sites">
        {{ $t('project.sites') }}
        <i class="fas fa-globe-americas"></i>
      </legend>
      <transition name="fade">
        <div v-show="block.sites">
          <div v-if="relatedData.site.length > 0">
            <!---->
            <div class="col p-0">
              <div class="d-flex justify-content-start mt-1 mb-3">
                <div class="align-self-center">
                  <v-switch
                    v-model="showCollapseMap"
                    hide-details
                    id="map-switch"
                    class="vuetify-switch mt-0"
                  ></v-switch>
                </div>
                <div class="align-self-center">
                  <label class="m-0" :for="`map-switch`">
                    <i class="far fa-map"></i>
                    {{showCollapseMap ? $t('site.mapEnabled') : $t('site.mapDisabled')}}
                  </label>
                </div>
              </div>

              <b-collapse v-model="showCollapseMap" id="collapseMap">
                <map-component :gps-coords="true"
                               mode="multiple"
                               v-if="showCollapseMap"
                               module="project"
                               v-bind:location="{ lat: null, lng: null }"
                               v-bind:locations="relatedData.site"/>
              </b-collapse>
            </div>
            <div class="table-responsive-sm col-12 p-0">

              <table class="table table-hover table-bordered">
                <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>{{ $t('site.name') }}</th>
                  <th>{{ $t('site.date_start') }}</th>
                  <th>{{ $t('site.date_end') }}</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="site in relatedData.site">
                  <td>
                    <router-link :to="{ path: '/site/' + site.id }" target="_blank">
                      <i class="fas fa-eye"></i>
                      {{site.id}}
                    </router-link>
                  </td>
                  <td v-translate="{et:site.name,en:site.name_en}"></td>
                  <td>{{parseDate(site.date_start)}}</td>
                  <td>{{parseDate(site.date_end)}}</td>
                  <!--<td style="min-width: 60px;text-align:right" @click="relatedData.site.splice(index, 1)"><font-awesome-icon icon="times"/></td>-->
                </tr>
                </tbody>
              </table>

            </div>
            <div class="col-sm-12 col-md-6 p-0" v-if="relatedData.count.site > searchParameters.paginateBy">
              <b-pagination
                size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="relatedData.count.site"
                v-model="relatedData.page.site" :per-page="relatedData.paginateBy.site">
              </b-pagination>
            </div>
          </div>
          <div v-else>No linked sites</div>
        </div>
      </transition>
    </fieldset>

    <!-- IS PRIVATE-->
    <div class="row my-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="project.is_private">
          {{ $t('project.is_private') }}
        </b-form-checkbox>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import Datepicker from 'vue2-datepicker'
  import formManipulation from '../../mixins/formManipulation'
  import sidebarMixin from '../../mixins/sidebarMixin'
  import autocompleteMixin from '../../mixins/autocompleteMixin'
  import formSectionsMixin from '../../mixins/formSectionsMixin'
  import cloneDeep from 'lodash/cloneDeep'
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
  import SaveButtons from "../partial/SaveButtons";
  import MultimediaComponent from "../partial/MultimediaComponent";
  import AddNewSite from "./addOrEditSiteModal";
  import FilePreviewModal from "../partial/filePreviewModal";
  import Editor from "../partial/editor/Editor";
  import {mapState} from "vuex";

  export default {
    name: "Project",
    components: {
      Editor,
      FilePreviewModal,
      AddNewSite,
      MultimediaComponent,
      SaveButtons,
      FileTable,
      MapComponent,
      Datepicker,
      Spinner,
    },
    mixins: [formManipulation, autocompleteMixin, formSectionsMixin, sidebarMixin],

    data() {
      return this.setInitialData()
    },
    computed:{
      sidebarUserAction() { return this.$store.state['sidebarUserAction'] },

      isActiveProject: {
        get() {
          if (this.$store.state['activeProject'] !== null) return this.$store.state['activeProject'].id == this.$route.params.id
          else return ''
        },

        set(newVal) {
          if (newVal) this.$store.dispatch('ACTIVE_PROJECT', this.project)
          else this.$store.dispatch('ACTIVE_PROJECT', null)
        }
      },

      ...mapState(["currentUser", "databaseId"])
    },
    created() {
      // USED BY SIDEBAR
      if (this.$route.meta.isEdit) {
        const searchHistory = this.$localStorage.get(this.searchHistory, 'fallbackValue');
        let params = this.isNotEmpty(searchHistory) && searchHistory.hasOwnProperty('id') && searchHistory !== 'fallbackValue' ? searchHistory : this.searchParameters;
        this.$store.commit('SET_ACTIVE_SEARCH_PARAMS', {
          searchHistory: 'projectSearchHistory',
          defaultSearch: this.searchParameters,
          search: params,
          request: 'FETCH_PROJECTS',
          title: 'header.projects',
          object: 'project',
          field: 'name',
          block: this.block
        });
      }

      this.loadFullInfo()
    },

    methods: {
      setInitialData() {
        return {
          searchHistory: 'projectSearchHistory',
          window: {
            width: 0,
            height: 0
          },
          relatedData: this.setDefaultRalatedData(),
          copyFields: ['id', 'name', 'name_en', 'project_type', 'parent_project', 'date_start', 'date_end', 'date_free',
            'description', 'owner', 'remarks', 'is_private', 'projectagent'
          ],
          autocomplete: {
            loaders: {
              project_type: false, parent_project: false, owner: false, projectagent: false, attachment: false
            },
            project_type: [], parent_project: [], agent: [], projectagent: [], attachment: []
          },
          requiredFields: ['name'],
          project: {},
          previousRecord: {},
          nextRecord: {},
          searchParameters: this.setDefaultSearchParameters(),
          columns: [
            {id: "id", title: "site.id", type: "number"},
            {id: "name", title: "site.name", type: "text"},
            {id: "project", title: "site.project", type: "text"},
            {id: "date_start", title: "site.date_start", type: "text", isDate: true},
            {id: "date_end", title: "site.date_end", type: "text", isDate: true},
            {id: "date_free", title: "site.date_free", type: "text", isDate: true},
          ],
          isActive: false,
          attachmentLinkSaved : -1,
          watchedSite: null,
          block: {info: true, description: true, members: true, files: true, sites: true },
        }
      },

      reloadData() {
        Object.assign(this.$data, this.setInitialData());
        this.loadFullInfo()
      },

      loadFullInfo() {

        fetchProjectType().then(response => {
          this.autocomplete.project_type = this.handleResponse(response);
        });

        if (this.$route.meta.isEdit) {
          this.sendingData = true;
          this.$emit('set-object', 'project');
          fetchProject(this.$route.params.id).then(response => {

            let handledResponse = this.handleResponse(response);
            if (handledResponse.length > 0) {
              this.$emit('object-exists', true);
              this.project = this.handleResponse(response)[0];
              this.fillAutocompleteFields(this.project)
              this.removeUnnecessaryFields(this.project, this.copyFields);
              this.project.related_data = {};
              // this.$set(this,'activeProject', this.checkIfProjectIsActive());
              this.$emit('data-loaded', this.project)
              this.sendingData = false;
              // this.getListRecords('project')
            } else {
              this.sendingData = false;
              this.$emit('object-exists', false);
            }
          });
          this.loadRelatedData('projectagent');
          this.loadRelatedData('attachment_link');
          this.loadRelatedData('site');
        } else {
          //set default user
          this.project.owner = {agent: this.currentUser.user, id: this.currentUser.id}
        }

      },

      setDefaultRalatedData() {
        return {
          projectagent: [], attachment_link: [], site: [],
          page: {projectagent: 1, attachment_link: 1, site: 1},
          paginateBy: {projectagent: 25, attachment_link: 25, site: 100},
          count: {projectagent: 0, attachment_link: 0, site: 0}
        }
      },

      formatDataForUpload(objectToUpload, saveRelatedData = false) {
        let uploadableObject = cloneDeep(objectToUpload)

        if (this.isNotEmpty(objectToUpload.date_start)) uploadableObject.date_start = this.formatDateForUpload(objectToUpload.date_start);
        if (this.isNotEmpty(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end);

        //autocomplete fields
        if (this.isNotEmpty(objectToUpload.project_type)) uploadableObject.project_type = objectToUpload.project_type.id
        if (this.isNotEmpty(objectToUpload.parent_project)) uploadableObject.parent_project = objectToUpload.parent_project.id
        if (this.isNotEmpty(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id

        //add related data
        uploadableObject.related_data = {}
        uploadableObject.related_data.agent = this.relatedData.projectagent
        if (saveRelatedData) {
          uploadableObject.related_data.attachment = this.relatedData.attachment_link;
          // uploadableObject.related_data.site = this.relatedData.site;
        }
        console.log(uploadableObject)
        return JSON.stringify(uploadableObject)
      },
      fillAutocompleteFields(obj) {
        this.project.project_type = {
          name: obj.project_type__name,
          name_en: obj.project_type__name_en,
          id: obj.project_type
        }

        //set current user as default owner

        // this.project.owner = this.isNotEmpty(this.project.owner) ? {agent:obj.owner__agent,id:obj.owner} : {agent:this.currentUser.user,id:this.currentUser.id}
        this.project.owner = {agent: obj.owner__agent, id: obj.owner}

        this.project.parent_project = {
          name: obj.parent_project__name,
          name_en: obj.parent_project__name_en,
          id: obj.parent_project
        }

      },

      fillRelatedDataAutocompleteFields(obj, type) {
        let relatedData = cloneDeep(obj)
        obj = [];
        relatedData.forEach(entity => {
          if (type === 'projectagent') obj.push({
            agent: entity.projectagent__agent__agent,
            id: entity.projectagent__agent
          })
          else obj.push(entity)
        });
        return obj
      },

      loadRelatedData(object) {
        let query;
        if (object === 'projectagent') {
          query = fetchProjectAgent(this.$route.params.id, this.relatedData.page.projectagent)
        } else if (object === 'attachment_link') {
          query = fetchProjectAttachment(this.$route.params.id, this.relatedData.page.attachment_link)
        } else if (object === 'site') {
          query = fetchLinkedSite(this.$route.params.id, this.relatedData.page.site, this.relatedData.paginateBy.site)
        }
        return new Promise(resolve => {
          //resolve it for my sites table
          // if(object === 'site') resolve(query);

          query.then(response => {
            //projectagent do not have count value
            if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results : []

            this.relatedData.count[object] = response.body.count;
            this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object], object);
            // if(object === 'site')  this.forceMapRerender()
            this.setBlockVisibility(object,this.relatedData[object].length)

          });
        });
      },
      setBlockVisibility(object,count){
        if(object === 'projectagent') this.block.members = count > 0
        if(object === 'attachment_link') this.block.files = count > 0
        if(object === 'site') this.block.sites = count > 0
      },
      //check required fields for related data
      checkRequiredFields(type) {
      },

      formatRelatedData(objectToUpload) {
        let uploadableObject = cloneDeep(objectToUpload);
        uploadableObject.project = this.project.id;

        // console.log(JSON.stringify(uploadableObject));
        return JSON.stringify(uploadableObject)
      },


      fetchList(localStorageData) {
        let params = this.isNotEmpty(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
        return new Promise((resolve) => {
          resolve(fetchProjects(params, this.currentUser.id))
        });
      },

      setDefaultSearchParameters() {
        return {
          owner: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },

      customLabelForAttachment(option) {
        return this.$i18n.locale === 'ee' ? `${option.id} - (${option.description}) (${option.author__agent})` :
          `${option.id} - (${option.description_en}) (${option.author__agent})`
      },

      addFiles(files){
        this.addFileAsRelatedDataNew(files, 'project');
      },
    },

    watch: {
      '$route.params.id': {
        handler: function (newval, oldval) {
          this.reloadData()
        },
        deep: true
      },
      'relatedData.page.site'(newval, oldval) {
        this.loadRelatedData('site')
      },
      'sidebarUserAction'(newVal) {
        this.$_handleUserAction(newVal, 'project', this.project)
      },
    }
  }
</script>

<style scoped>

  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
