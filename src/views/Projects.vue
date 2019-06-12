<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.projects') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/project/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <fieldset class="border p-2" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
        <div class="row" v-if="filters.length > 0 && block.search">
          <div class="col-md-4" :class="{ 'col-md-6' : filters.length < 3 }" v-for="field,idx in filters">

            <label :for="field.id">{{ $t(field.title) }} :</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>
          </div>
        </div>
      </transition>
    </fieldset>

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
  import ListModuleCore from "./ListModuleCore";
  import {fetchProjects} from "@/assets/js/api/apiCalls";
  import permissionsMixin from "../components/mixins/permissionsMixin";

  export default {
    components: {
      ListModuleCore
    },
    name: "Projects",
    mixins: [permissionsMixin],
    data() {
      return {
        response: {},
        columns: [
          {id: "id", title: "project.id", type: "number"},
          {id: "name", title: "project.name", type: "text"},
          {id: "project_type", title: "project.project_type", type: "text"},
          {id: "date_start", title: "project.date_start", type: "text", isDate: true},
          {id: "date_end", title: "project.date_end", type: "text", isDate: true},
          {id: "date_free", title: "project.date_free", type: "text", isDate: true},
          {id: "owner", title: "project.owner", type: "text"},
        ],
        filters: [
          {id: "name", title: "project.name", type: "text"},
          {id: "id", title: "project.id", type: "number"},

          //{id:"project_type",title:"project.project_type",type:"text"},
          //{id:"date_start",title:"project.date_start",type:"text"},
          //{id:"date_end",title:"project.date_end",type:"text"},
          //{id:"date_free",title:"project.date_free",type:"text"},
          //{id:"owner",title:"project.owner",type:"text"},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
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
  label {
    margin: 5px 0 0 0;
    color: #999;
    font-size: 0.8rem;
  }
</style>
