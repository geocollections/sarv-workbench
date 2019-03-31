<template>
  <div>
    <spinner v-show="sendingData" class="loading-overlay" size="massive" :message="$route.meta.isEdit ? $t('edit.overlayLoading'):$t('add.overlay')"></spinner>
    <!-- STORAGE-->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">Üldinfo
        <font-awesome-icon icon="project-diagram"/></legend>

      <div class="row">
        <div class="col-md-6">
          <label class="p-0">{{ $t('project.name') }}:</label>
          <b-form-input id="name" v-model="project.name" type="text" maxlength="100"></b-form-input>
        </div>

        <div class="col-md-6">
          <label class="p-0">{{ $t('project.name_en') }}:</label>
          <b-form-input id="name_en" v-model="project.name_en" type="text" maxlength="100"></b-form-input>
        </div>
      </div>
      <div class="row">

        <div class="col-md-4">
          <label class="p-0">{{ $t('project.project_type') }}:</label>
          <vue-multiselect v-model="project.project_type" v-if="isDefinedAndNotEmpty(autocomplete.project_type)"
                           id="type"
                           :options="autocomplete.project_type"
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
              {{ $i18n.locale=== 'ee' ? option.parent_project__name :option.parent_project__name_en }}</strong> </template>
            <template slot="noResult"><b>{{ $t('messages.inputNoResults') }}</b></template>
          </vue-multiselect>
        </div>

      </div>
    </fieldset>
    <!-- DATE COLLECTED AND DATE COLLECTED FREE -->
    <fieldset class="border p-2 mb-2">
      <legend class="w-auto" style="font-size: large;">{{ $t('project.date') }}</legend>

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
  import {
    fetchProjects,
    fetchProject,
    fetchProjectType
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

      created() { this.loadFullInfo() },

      methods: {
        setTab(type){ this.activeTab  = type },

        setInitialData() {
          return {
            searchHistory:'projectSearchHistory',
            relatedData: this.setDefaultRalatedData(),
            copyFields : ['id','name','name_en','project_type','parent_project','date_start','date_end','date_free',
              'description','owner','remarks','is_private'
            ],
            autocomplete: {
              loaders: { project_type:false,parent_project:false,owner:false
              },
              project_type: [],parent_project:[],agent:[]
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
                this.$emit('data-loaded', this.project)
                this.$emit('set-object','project');
                this.sendingData = false;
                this.getListRecords('project')
              } else {
                this.sendingData = false;
              }
            });
          } else {
            //set default user
            this.project.owner = {agent:this.currentUser.user,id:this.currentUser.id}
          }

        },

        setDefaultRalatedData(){
          return {}
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

          return JSON.stringify(uploadableObject)
        },
        fillAutocompleteFields(obj){
          this.project.project_type = {name:obj.project_type__name,name_en:obj.project_type__name_en,id:obj.project_type}

            //set current user as default owner

          // this.project.owner = this.isDefinedAndNotNull(this.project.owner) ? {agent:obj.owner__agent,id:obj.owner} : {agent:this.currentUser.user,id:this.currentUser.id}
          this.project.owner = {agent:obj.owner__agent,id:obj.owner}

          this.project.parent_project = {name:obj.parent_project__name,name_en:obj.parent_project__name_en,id:obj.parent_project}
        },

        fillRelatedDataAutocompleteFields(obj){
          obj.agent = {agent:obj.agent__agent,id:obj.agent}
          return obj
        },

        loadRelatedData(object){ },

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

</style>
