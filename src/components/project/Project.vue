<template>
  <div>

    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>
    <div class="row mt-4">
      <div class="col">
        <span class="float-right">
          <button class="btn btn-primary mb-2" @click="registerObservation"><font-awesome-icon icon="globe-americas"/> Register new observation / sampling site</button>
        </span>
        <span class="float-left">
         <span class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch2" v-model="isActiveProject" >
            <label class="custom-control-label rounded pr-4 pl-4" :class="isActiveProject ? 'alert-success ' : 'alert-danger'" for="customSwitch2">
              <font-awesome-icon icon="tag"/>&ensp;{{ $t(isActiveProject ? 'frontPage.active' : 'frontPage.non_active')}}</label>
          </span>

          <!--<button  v-if="!isActiveProject" class="btn alert-danger mb-2" @click="isActiveProject = true">{{ $t('frontPage.non_active') }}</button>-->
          <!--<button v-if="isActiveProject"  class="btn alert-success mb-2" @click="isActiveProject = false">{{ $t('frontPage.active') }}</button>-->
        </span>
      </div>
    </div>
    <!-- STORAGE-->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Üldinfo
        <font-awesome-icon icon="project-diagram"/></legend>

      <div class="row">
        <div class="col-md-6">
          <label class="p-0">{{ $t('project.name') }}:</label>
          <b-form-input id="name" v-model="project.name" :state="isDefinedAndNotNull(project.name)" type="text" maxlength="100"></b-form-input>
        </div>

        <div class="col-md-6">
          <label class="p-0">{{ $t('project.name_en') }}:</label>
          <b-form-input id="name_en" v-model="project.name_en" type="text" maxlength="100"></b-form-input>
        </div>
      </div>
      <div class="row">

        <div class="col-md-4">
          <label class="p-0">{{ $t('project.project_type') }}:</label>
          <vue-multiselect v-model="project.project_type"
                           id="type"
                           :options="autocomplete.project_type"
                           v-bind:class="{ valid: isDefinedAndNotNull(project.project_type), invalid: !isDefinedAndNotNull(project.project_type) }"
                           track-by="id"
                           :label="nameLabel"
                           :placeholder="$t('add.inputs.autocomplete')"
                           :show-labels="false">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

        <div class="col-md-4">
          <label class="p-0">{{ $t('project.owner') }}:</label>
          <vue-multiselect class="align-middle" v-model="project.owner" select-label="" deselect-label="Can't remove this value"
                           label="agent" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                           :loading="autocomplete.loaders.owner"
                           :options="autocomplete.agent" :searchable="true" @search-change="autcompleteOwnerSearch"
                           :allow-empty="true"  :show-no-results="false" :max-height="600"
                           :open-direction="'bottom'">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

        <div class="col-sm-4">
          <label class="p-0">{{ $t('project.parent_project') }}:</label>
          <vue-multiselect class="align-middle" v-model="project.parent_project" select-label="" deselect-label="Can't remove this value"
                           :label="nameLabel" track-by="id" :placeholder="$t('add.inputs.autocomplete')"
                           :loading="autocomplete.loaders.parent_project"
                           :options="autocomplete.parent_project" :searchable="true" @search-change="autcompleteParentProjectSearch"
                           :allow-empty="true"  :show-no-results="false" :max-height="600"
                           :open-direction="'bottom'">
            <template slot="singleLabel" slot-scope="{ option }"><strong>
              {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong> </template>
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
            <label :for="`date_end`"  class="p-0">{{ $t('project.date_end') }}:</label>
            <datepicker id="date_end"
                        v-model="project.date_end"
                        use-utc="true "
                        lang="en"
                        :first-day-of-week="1"
                        format="DD MMM YYYY"
                        input-class="form-control"></datepicker>
          </div>

          <div class="col-sm-4">
            <label :for="`date_free`"  class="p-0">{{ $t('project.date_free') }}:</label>
            <b-form-input id="date_free" v-model="project.date_free" type="text"  maxlength="10"/>
          </div>

        </div>
    </fieldset>



    <!-- DESCRIPTION -->
    <fieldset class="border p-2 mb-2"  :key="componentKey">
      <legend class="w-auto" style="font-size: large;">{{ $t('project.description') }} | {{ $t('project.remarks') }}
        <font-awesome-icon icon="pen-fancy"/></legend>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="description" v-model="project.description" type="text" size="sm" :rows="1" :max-rows="20"/>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="remarks" v-model="project.remarks" type="text" size="sm" :rows="1" :max-rows="20"/>
        </div>
      </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Project members
        <font-awesome-icon icon="user-friends"/></legend>
      <div class="row">

        <div class="col-11 mb-2 mr-0">
          <vue-multiselect v-model="relatedData.projectagent"
                           id="projectagent"
                           :searchable="true" @search-change="autcompleteProjectAgentSearch"
                           :options="autocomplete.agent"
                           :loading="autocomplete.loaders.projectagent"
                           :multiple="true"
                           track-by="id"
                           label="agent" :open-direction="'bottom'"
                           :placeholder="$t('add.inputs.autocomplete')">
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

        <div class="col-1 mb-2 ml-0 pl-0">
          <button class="btn btn-outline-danger" :title="$t('add.inputs.keywordsRemove')" :disabled="!isDefinedAndNotEmpty(relatedData.projectagent)"
                  @click="relatedData.projectagent = []">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon>
          </button>
        </div>
      </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Project files
        <font-awesome-icon icon="folder-open"/></legend>

      <div class="row p-3">
        <div class="table-responsive-sm col-12 p-0">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th colspan="3">
                  <vue-multiselect
                    id="attachment_link"
                    :multiple="true"
                    track-by="id"
                    :options="autocomplete.attachment"
                    :internal-search="false"
                    @search-change="autcompleteAttachmentSearch"
                    :custom-label="customLabelForAttachment"
                    :reset-after="true"
                    @select="addRelatedDataAttachment"
                    :loading="autocomplete.loaders.attachment"
                    :placeholder="$t('add.inputs.autocomplete')"
                    :show-labels="false">
                    <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
                  </vue-multiselect>
                </th>
              </tr>

            </thead>
            <!--<tbody>-->
              <!--<tr v-for="(file,idx) in relatedData.attachment_link" style="background-color: #ccdcb9;" :id="'tooltip-button-show-event'+idx" >-->
                <!--&lt;!&ndash;<b-tooltip class="custom-tooltip" :ref="'tooltip'" :target="'tooltip-button-show-event'+idx" variant="primary">&ndash;&gt;-->
                  <!--&lt;!&ndash;<img style="height: 200px;" v-if="['jpg','png'].indexOf(file.uuid_filename.split('.')[1]) > -1" :src="composeFileUrl(file.uuid_filename)" onerror="this.style.display='none'"/>&ndash;&gt;-->
                  <!--&lt;!&ndash;<font-awesome-icon :icon="getFormatIcon(file.original_filename)" v-if="isDefinedAndNotNull(file.original_filename)"/>&ndash;&gt;-->
                  <!--&lt;!&ndash;{{customLabelForAttachment(file)}}&ndash;&gt;-->
                <!--&lt;!&ndash;</b-tooltip>&ndash;&gt;-->

                <!--<td @click="windowOpenNewTab('attachment','/attachment/'+file.id)">-->
                  <!--<img style="height: 50px;" v-if="['jpg','png'].indexOf(file.uuid_filename.split('.')[1]) > -1" :src="composeFileUrl(file.uuid_filename)" onerror="this.style.display='none'"/>-->
                  <!--<font-awesome-icon class="fa-3x" v-if="['jpg','png'].indexOf(file.uuid_filename.split('.')[1]) === -1 && isDefinedAndNotNull(file.original_filename)" :icon="getFormatIcon(file.original_filename)"/>-->
                <!--</td>-->
                <!--<td @click="windowOpenNewTab('attachment','/attachment/'+file.id)" style="min-width: 400px">-->
                  <!--<font-awesome-icon icon="eye"/>&ensp;{{file.original_filename}}<br/>-->
                  <!--{{customLabelForAttachment(file)}}-->
                <!--</td>-->
                <!--<td style="min-width: 60px;text-align:right" @click="relatedData.attachment_link.splice(idx, 1)"><font-awesome-icon icon="times"/></td>-->
              <!--</tr>-->
            <!--</tbody>-->
          </table>
        </div>
        <file-table :attachments="relatedData.attachment_link" :object="'project'" v-if="relatedData.attachment_link.length > 0"/>
      </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Linked Sites <font-awesome-icon icon="globe-americas"/></legend>

      <div v-if="relatedData.site.length > 0">
        <div class="col p-0">
         <span class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
            <label class="custom-control-label" for="customSwitch">{{ $t(showCollapseMap ? 'add.buttons.mapEnabled' : 'add.buttons.mapDisabled')}}</label>
          </span>
          <b-collapse v-model="showCollapseMap" id="collapseMap">
            <test-component mode="multiple" v-if="showCollapseMap" v-bind:location="{ lat: null, lng: null }" :key="mapComponentKey"
                            v-bind:locations="relatedData.site" v-on:choose-locations="chooseLocations"/>
            <!--<map-component v-bind:location="{ lat: null, lng: null }"-->
                           <!--v-bind:locations="relatedData.site" v-on:choose-locations="chooseLocations" />-->

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
              <!--<th></th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(site,index) in relatedData.site">
              <td @click="windowOpenNewTab('site','/site/'+site.id)">
                <font-awesome-icon size="1x" icon="eye"/> {{site.id}}
              </td>
              <td v-translate="{et:site.name,en:site.name_en}"></td>
              <td>{{site.date_start}}</td>
              <td>{{site.date_end}}</td>
              <!--<td style="min-width: 60px;text-align:right" @click="relatedData.site.splice(index, 1)"><font-awesome-icon icon="times"/></td>-->
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>No linked sites</div>
    </fieldset>

    <!-- IS PRIVATE-->
    <div class="row mb-3 mt-3">
      <div class="col">
        <b-form-checkbox id="is_private" v-model="project.is_private" :value="true" :unchecked-value="false">
          {{ $t('sample.is_private') }}
        </b-form-checkbox>
      </div>
    </div>

    <div class="row mt-3 mb-3">
      <div class="col">
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(false, 'project')">
          {{ $t($route.meta.isEdit? 'edit.buttons.save':'add.buttons.add') }}</button>
        <button class="btn btn-success mr-2 mb-2" :disabled="sendingData" @click="add(true, 'project')">
          {{ $t($route.meta.isEdit? 'edit.buttons.saveAndContinue':'add.buttons.addAnother') }}</button>
        <button class="btn btn-danger mr-2 mb-2" :disabled="sendingData" @click="reset('project')">
          {{ $t($route.meta.isEdit? 'edit.buttons.cancelWithoutSaving':'add.buttons.clearFields') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import Datepicker from 'vue2-datepicker'
  import formManipulation  from './../mixins/formManipulation'
  import autocompleteFieldManipulation  from './../mixins/autocompleFormManipulation'
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
  import TestComponent from "../partial/TestComponent";
  import FileTable from "../partial/FileTable";
  import findIndex from 'lodash/findIndex';
    export default {
      name: "Project",
      components: {
        FileTable,
        TestComponent,
        MapComponent,

        FontAwesomeIcon,
        Datepicker,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,autocompleteFieldManipulation],

      data() { return this.setInitialData() },

      created() {
        this.loadFullInfo()
      },

      beforeMount(){
        let vm = this, currentActiveProjects = cloneDeep(this.$localStorage.get('activeProject', 'fallbackValue'))
        let currentProjectIdx = findIndex(currentActiveProjects, function(item) { return item === parseInt(vm.$route.params.id) });
        this.isActiveProject = currentProjectIdx > -1
      },

      methods: {
        setInitialData() {
          return {
            searchHistory:'projectSearchHistory',
            relatedData: this.setDefaultRalatedData(),
            copyFields : ['id','name','name_en','project_type','parent_project','date_start','date_end','date_free',
              'description','owner','remarks','is_private','projectagent'
            ],
            autocomplete: {
              loaders: { project_type:false,parent_project:false,owner:false,projectagent:false,attachment:false
              },
              project_type: [],parent_project:[],agent:[],projectagent:[],attachment:[]
            },
            requiredFields: ['name'],
            project: {},
            previousRecord: {},
            nextRecord: {},
            searchParameters: this.setDefaultSearchParameters(),
            isActiveProject:  false,
            columns:[
              {id:"id",title:"site.id",type:"number"},
              {id:"name",title:"site.name",type:"text"},
              {id:"project",title:"site.project",type:"text"},
              {id:"date_start",title:"site.date_start",type:"text",isDate:true},
              {id:"date_end",title:"site.date_end",type:"text",isDate:true},
              {id:"date_free",title:"site.date_free",type:"text",isDate:true},
            ],
            componentKey: 0,
            mapComponentKey: 0,
            isActive: false
          }
        },

        reloadData(){
          Object.assign(this.$data, this.setInitialData());
          this.loadFullInfo()
        },

        loadFullInfo() {
          fetchProjectType().then(response => {
            this.autocomplete.project_type = this.handleResponse(response);
          });

          if(this.$route.meta.isEdit) {
            this.sendingData = true;
            fetchProject(this.$route.params.id).then(response => {

              let handledResponse = this.handleResponse(response);
              if(handledResponse.length > 0) {
                this.project = this.handleResponse(response)[0];
                this.fillAutocompleteFields(this.project)
                this.removeUnnecessaryFields(this.project, this.copyFields);
                this.project.related_data = {};
                // this.$set(this,'activeProject', this.checkIfProjectIsActive());
                this.forceRerender()
                this.$emit('data-loaded', this.project)
                this.$emit('set-object','project');
                this.sendingData = false;
                this.getListRecords('project')
              } else {
                this.sendingData = false;
              }
            });

            this.loadRelatedData('projectagent');
            this.loadRelatedData('attachment_link');
            this.loadRelatedData('site');
          } else {
            //set default user
            this.project.owner = {agent:this.currentUser.user,id:this.currentUser.id}
          }

        },

        setDefaultRalatedData(){
          return {
            projectagent:[], attachment_link:[], site: [],
            page : {projectagent:1,attachment_link:1,site:1},
            count: {projectagent:0,attachment_link:0,site:0}
          }
        },

        formatDataForUpload(objectToUpload,saveRelatedData = false) {
          let uploadableObject = cloneDeep(objectToUpload)

          if (this.isDefinedAndNotNull(objectToUpload.is_private)) uploadableObject.is_private = objectToUpload.is_private === true ? '1' : '0';
          if (this.isDefinedAndNotNull(objectToUpload.date_start)) uploadableObject.date_start = this.formatDateForUpload(objectToUpload.date_start);
          if (this.isDefinedAndNotNull(objectToUpload.date_end)) uploadableObject.date_end = this.formatDateForUpload(objectToUpload.date_end);

          //autocomplete fields
          if (this.isDefinedAndNotNull(objectToUpload.project_type)) uploadableObject.project_type = objectToUpload.project_type.id
          if (this.isDefinedAndNotNull(objectToUpload.parent_project)) uploadableObject.parent_project = objectToUpload.parent_project.id
          if (this.isDefinedAndNotNull(objectToUpload.owner)) uploadableObject.owner = objectToUpload.owner.id

          //add related data
          uploadableObject.related_data = {}
          uploadableObject.related_data.agent = this.relatedData.projectagent
          if(saveRelatedData) {
            uploadableObject.related_data.attachment = this.relatedData.attachment_link;
            // uploadableObject.related_data.site = this.relatedData.site;
          }
          console.log(uploadableObject)
          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.project.project_type = {name:obj.project_type__name,name_en:obj.project_type__name_en,id:obj.project_type}

            //set current user as default owner

          // this.project.owner = this.isDefinedAndNotNull(this.project.owner) ? {agent:obj.owner__agent,id:obj.owner} : {agent:this.currentUser.user,id:this.currentUser.id}
          this.project.owner = {agent:obj.owner__agent,id:obj.owner}

          this.project.parent_project = {name:obj.parent_project__name,name_en:obj.parent_project__name_en,id:obj.parent_project}

        },

        fillRelatedDataAutocompleteFields(obj,type){
          let relatedData = cloneDeep(obj)
          obj = [];
          relatedData.forEach(entity => {
            if(type === 'projectagent') obj.push( {agent:entity.projectagent__agent__agent, id:entity.projectagent__agent})
            else obj.push(entity)
          });
          return obj
        },

        loadRelatedData(object){
          let query;

          if(object === 'projectagent') {
            query = fetchProjectAgent(this.$route.params.id,this.relatedData.page.projectagent)
          } else if(object === 'attachment_link') {
            query = fetchProjectAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
          } else if(object === 'site') {
            query = fetchLinkedSite(this.$route.params.id,this.relatedData.page.site)
          }
          return new Promise(resolve => {
            query.then(response => {
              //projectagent do not have count value
              if (response.status === 200) this.relatedData[object] = response.body.results ? response.body.results: []

              this.relatedData.count[object] = response.body.count;
              this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object],object);
              if(object === 'site')  this.forceMapRerender()

              resolve(true)
            });
          });
        },

        //check required fields for related data
        checkRequiredFields(type){ },

        formatRelatedData(objectToUpload)  {
          let uploadableObject = cloneDeep(objectToUpload);
          uploadableObject.project = this.project.id;

          // console.log(JSON.stringify(uploadableObject));
          return JSON.stringify(uploadableObject)
        },


        fetchList(localStorageData) {
          let params = this.isDefinedAndNotNull(localStorageData) && localStorageData !== 'fallbackValue' && localStorageData !== '[object Object]' ? localStorageData : this.searchParameters;
          return new Promise((resolve) => {
            resolve(fetchProjects(params))
          });
        },

        setDefaultSearchParameters() {
          return {
            locality: null,
            number: null,
            depth: null,
            stratigraphy: null,
            agent: null,
            storage: null,
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

        addRelatedDataAttachment(option){
          if(typeof this.relatedData.attachment_link === 'undefined') this.relatedData.attachment_link = [];
          this.relatedData.attachment_link.push(option)
        },


        registerObservation(){

          //set relation object as site
          let createRelationWith = { object: 'project', data: this.project };
          this.$store.commit('CREATE_RELATION_OBJECT', { createRelationWith });
          this.$router.push({ path:'/site/add'})
        },

        // checkIfProjectIsActive(){
        //   return new Date(this.project.date_end) >= (new Date()).setHours(0,0,0,0)
        // },

        forceRerender() { this.componentKey += 1; },
        forceMapRerender() { this.mapComponentKey += 1; },

        chooseLocations(locations) {
          console.log(locations)
        },
        removeAttachmentRelation(idx) {
          this.relatedData.attachment_link.splice(idx, 1);
          this.add(true,'project',true);
        },

      },

      watch: {
        '$route.params.id': {
          handler: function (newval, oldval) {
            this.reloadData()
          },
          deep: true
        },
        // 'project.date_end': {
        //   handler: function (newval, oldval) {
        //     this.$set(this,'isActiveProject', this.checkIfProjectIsActive())
        //   },
        //   deep: true
        // },
        'isActiveProject'(newval, oldval){
          let vm = this, currentActiveProjects = cloneDeep(this.$localStorage.get('activeProject', 'fallbackValue'))
          if(currentActiveProjects === 'fallbackValue') currentActiveProjects = [];
          if(!this.isDefinedAndNotNull(this.project.id)) return

          if(newval) {
            currentActiveProjects.push(this.project.id)
          } else {
            let removeIdx = findIndex(currentActiveProjects, function(item) { return item === vm.project.id });

            currentActiveProjects.splice(removeIdx,1)
          }

          this.$localStorage.set('activeProject',  currentActiveProjects)
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

  /* Map height */
  #collapseMap {
    height: 50vh;
  }
</style>
