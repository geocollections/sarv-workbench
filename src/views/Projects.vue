<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.projects') }}</p>
      </div>
      <div class="col-sm-6 ralign">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/project/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>
    <!-- SEARCH FIELDS START -->
    <div class="row mt-4">
      <div class="col">
        <div class="search-fields">
          <div class="d-flex flex-row flex-wrap">
            <div class="col-sm-6" v-for="field,idx in filters">
                <label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }} :</label>
                <b-form-input style="display: inline !important; " class="col-sm-8 mb-2"
                              v-model="searchParameters[field.id]" :id="field.id" :type="field.type">
                </b-form-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="project"
      title="titles.editProject"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchProjects"
      search-history="projectSearchHistory"
      view-type="projectViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParameters"
    ></list-module-core>
  </div>

</template>

<script>

  import formManipulation  from './../components/mixins/formManipulation'
  import ListModuleCore from "./ListModuleCore";
  import {fetchProjects} from "@/assets/js/api/apiCalls";
  export default {
    components: {
      ListModuleCore
    },
    mixins: [formManipulation],
    name: "Projects",
    data() {
      return {
        response: {},
        columns:[
          {id:"id",title:"project.id",type:"number"},
          {id:"name",title:"project.name",type:"text"},
          {id:"project_type",title:"project.project_type",type:"text"},
          {id:"date_start",title:"project.date_start",type:"text",isDate:true},
          {id:"date_end",title:"project.date_end",type:"text",isDate:true},
          {id:"date_free",title:"project.date_free",type:"text",isDate:true},
          {id:"owner",title:"project.owner",type:"text"},
        ],
        filters:[
          {id:"id",title:"project.id",type:"number"},
          {id:"name",title:"project.name",type:"text"},
          {id:"project_type",title:"project.project_type",type:"text"},
          {id:"date_start",title:"project.date_start",type:"text"},
          {id:"date_end",title:"project.date_end",type:"text"},
          {id:"date_free",title:"project.date_free",type:"text"},
          {id:"owner",title:"project.owner",type:"text"},
        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },

    methods: {
      fetchProjects() {
        return new Promise((resolve) => {
          resolve(fetchProjects(this.searchParameters, this.currentUser.id))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          owner: null,
          id: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      }
    }
  }
</script>

<style scoped>
.ralign {
	text-align: right !important;  
  }
</style>
