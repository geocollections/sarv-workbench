<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>
    <div class="row mt-4">
      <div class="col">
        <span class="float-right">
          <button class="btn btn-primary mb-2" @click="registerObservation">Register new observation / sampling site</button></span>
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
                           :options="autocomplete.parent_project" :searchable="true" @search-change="autcompleteProjectSearch"
                           :allow-empty="true"  :show-no-results="false" :max-height="600"
                           :open-direction="'bottom'">
            <template slot="singleLabel" slot-scope="{ option }"><strong>
              {{ $i18n.locale=== 'ee' ? option.name :option.name_en }}</strong> </template>
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

      </div>
    </fieldset>
    <!-- DATE COLLECTED AND DATE COLLECTED FREE -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('project.date') }}
        <font-awesome-icon icon="calendar-alt" title="Date identified"/></legend>

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
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('project.description') }}
        <font-awesome-icon icon="pen-fancy"/></legend>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="description" v-model="project.description" type="text" size="sm" :rows="2" :max-rows="20"/>
        </div>
      </div>
    </fieldset>

    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('project.remarks') }}
        <font-awesome-icon icon="info"/></legend>

      <div class="row">
        <div class="col-sm-12 mb-2">
          <b-form-textarea id="remarks" v-model="project.remarks" type="text" size="sm" :rows="2" :max-rows="20"/>
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
      <div class="row">

        <div class="col-12 mb-2 mr-0">
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
        </div>
      </div>
      <div class="row p-3">
        <div class="table-responsive-sm">
          <table class="table table-hover table-bordered">
            <tbody>
              <tr v-for="(file,idx) in relatedData.attachment_link" style="background-color: #d4dcc7;"   :id="'tooltip-button-show-event'+idx" >
                <b-tooltip class="custom-tooltip" :ref="'tooltip'" :target="'tooltip-button-show-event'+idx" variant="primary">
                  <img style="height: 200px;" v-if="['jpg','png'].indexOf(file.uuid_filename.split('.')[1]) > -1" :src="composeFileUrl(file.uuid_filename)" onerror="this.style.display='none'"/>
                  <font-awesome-icon :icon="getFormatIcon(file.original_filename)" v-if="isDefinedAndNotNull(file.original_filename)"/>
                  {{customLabelForAttachment(file)}}
                </b-tooltip>
                <td @click="windowOpenNewTab('attachment','/attachment/'+file.id)"><font-awesome-icon icon="eye"/></td>
                <td @click="windowOpenNewTab('attachment','/attachment/'+file.id)" style="min-width: 400px">{{file.original_filename}}</td>
                <td style="min-width: 60px;text-align:right" @click="relatedData.attachment_link.splice(index, 1)"><font-awesome-icon icon="times"/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
    fetchProjectAttachment
  } from "../../assets/js/api/apiCalls";

    export default {
      name: "Project",
      components: {
        FontAwesomeIcon,
        Datepicker,
        VueMultiselect,
        Spinner,
      },
      mixins: [formManipulation,autocompleteFieldManipulation],
      computed: { getParentId(){return this.sample.id} },
      data() { return this.setInitialData() },

      created() {
        this.loadFullInfo() },

      methods: {
        setTab(type){ this.activeTab  = type },

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
            searchParameters: this.setDefaultSearchParameters()
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
          } else {
            //set default user
            this.project.owner = {agent:this.currentUser.user,id:this.currentUser.id}
          }

        },

        setDefaultRalatedData(){
          return {
            projectagent:[], attachment_link:[],
            page : {locality_reference:1,attachment_link:1},
            count: {locality_reference:0,attachment_link:0}
          }
        },

        formatDataForUpload(objectToUpload) {
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
          if(this.isDefinedAndNotEmpty(this.relatedData.projectagent)) uploadableObject.related_data.agent = this.relatedData.projectagent
          if(this.isDefinedAndNotEmpty(this.relatedData.attachment_link)) uploadableObject.related_data.attachment = this.relatedData.attachment_link

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
            if(type === 'attachment_link') obj.push(entity)
          });
          return obj
        },

        loadRelatedData(object){
          let query;

          if(object === 'projectagent') {
            query = fetchProjectAgent(this.$route.params.id,this.relatedData.page.projectagent)
          } else if(object === 'attachment_link') {
            query = fetchProjectAttachment(this.$route.params.id,this.relatedData.page.attachment_link)
          }
          return new Promise(resolve => {
            query.then(response => {
              //projectagent do not have count value
              if (response.status === 200) this.relatedData[object] = response.body.results;

              this.relatedData.count[object] = response.body.count;
              this.relatedData[object] = this.fillRelatedDataAutocompleteFields(this.relatedData[object],object);
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

        getFormatIcon(fileName){
          let format = fileName.split('.')[1];
          if(['xlsx','xls'].indexOf(format) > -1 ) return 'file-excel';
          if(['jpg','png'].indexOf(format) > -1 ) return 'file-image';
          else return 'file'
        },

        registerObservation(){
          console.log('registerObservation')
        }
      },

      watch: {
        '$route.params.id': {
          handler: function (newval, oldval) {
            this.reloadData()
          },
          deep: true
        }
      }
    }
</script>

<style scoped>
  /*.tooltip {*/
    /*display:inline-block;*/
    /*position:relative;*/
    /*border-bottom:1px dotted #666;*/
    /*text-align:left;*/
  /*}*/

</style>
