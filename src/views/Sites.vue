<template>
  <div>

    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.sites') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/site/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS -->
    <fieldset class="border p-2" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
        <div class="row" v-if="filters.length > 0 && block.search">
          <div class="col">
            <div class="search-fields">
              <div class="d-flex flex-row flex-wrap">
                <div class="col-md-4" v-for="field,idx in filters">

                  <label :for="field.id">{{ $t(field.title) }}:</label>

                  <datepicker :id="field.id"
                              v-if="field.isDate"
                              v-model="searchParameters[field.id]"
                              lang="en"
                              :first-day-of-week="1"
                              format="DD MMM YYYY"
                              input-class="form-control"></datepicker>

                  <b-form-input v-else v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </fieldset>

    <list-module-core
      module="site"
      title="titles.editSite"
      :show-filters="false"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSites"
      search-history="siteSearchHistory"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>
  </div>
</template>

<script>

  import ListModuleCore from "./ListModuleCore";
  import {fetchSites} from "@/assets/js/api/apiCalls";
  import Datepicker from 'vue2-datepicker'

  export default {
    components: {
      ListModuleCore,
      Datepicker
    },
    name: "Sites",
    props: {

      project: {
        type: String,
        default: null
      },

      page: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        response: {},
        sites:[],

        columns:[
          {id:"id",title:"site.id",type:"number"},
          {id:"name",title:"site.name",type:"text"},
          {id:"number",title:"site.number",type:"text"},
          {id:"project",title:"site.project",type:"text"},
          {id:"date_start",title:"site.date_start",type:"text",isDate:true},
          {id:"date_end",title:"site.date_end",type:"text",isDate:true},
          // {id:"date_free",title:"site.date_free",type:"text",isDate:true},
        ],
        filters:[
          {id:"id",title:"site.id",type:"number"},
          {id:"name",title:"site.name",type:"text"},
          {id:"number",title:"site.number",type:"text"},
          {id:"project",title:"site.relatedProject",type:"text"},
          {id:"date_start",title:"site.date_start",type:"text", isDate:true},
          {id:"date_end",title:"site.date_end",type:"text", isDate:true},
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },

    methods: {
      fetchSites() {
        let vm = this
        return new Promise((resolve) => {
          resolve(fetchSites(vm.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      },
      setDefaultSearchParameters() {
        return {
          id: null,
          name: null,
          number:null,
          project: null,
          date_start: null,
          date_end: null,
          page: 1,
          paginateBy: 10,
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
