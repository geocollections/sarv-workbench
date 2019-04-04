<template>
  <div>
    <div class="row mt-4 page-title">

      <div class="col">
         <span class="float-left">
          <p class="h5">Pick some sites from a list or create new one</p>
           <span class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="isTableView">
            <label class="custom-control-label" for="customSwitch">{{isTableView ? 'Map enabled' : 'Map disabled'}}</label>
          </span>

        </span>
        <span class="float-right">
          <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/site/add' }">{{ $t('add.new') }}</router-link>
        </span>
      </div>

    </div>
    <!-- SEARCH FIELDS START -->
    <!--<div class="row mt-4">-->
      <!--<div class="col">-->
        <!--<div class="search-fields">-->
          <!--<div class="d-flex flex-row flex-wrap">-->
            <!--<div class="col-sm-6" v-for="field,idx in filters">-->
                <!--<label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }} :</label>-->
                <!--<b-form-input style="display: inline !important; " class="col-sm-8 mb-2"-->
                              <!--v-model="searchParameters[field.id]" :id="field.id" :type="field.type">-->
                <!--</b-form-input>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="site"
      title="titles.editSite"
      :show-filters="true"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSites"
      search-history="siteSearchHistory"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>
    <!--<map-component-search :map-data="mapData" v-if="isDefinedAndNotEmpty(mapData)"></map-component-search>-->
  </div>

</template>

<script>
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation  from './../components/mixins/formManipulation'
  import ListModuleCore from "./ListModuleCore";
  import {fetchSites} from "@/assets/js/api/apiCalls";
  import MapComponentSearch from "../components/partial/MapComponentSearch";
  import MapSearch2 from "../components/partial/MapSearch2";
  import MapComponent from "../components/partial/MapComponent";
  export default {
    components: {
      MapComponent,
      MapSearch2,
      MapComponentSearch,
      ListModuleCore
    },
    mixins: [formManipulation],
    name: "Sites",
    props: {
      apiCall: {
        type: Function
      },
    },
    data() {
      return {
        response: {},
        mapData:[],
        isTableView:true,
        columns:[
          {id:"id",title:"site.id",type:"number"},
          {id:"name",title:"site.name",type:"text"},
          {id:"project",title:"site.project",type:"text"},
          // {id:"date_start",title:"site.date_start",type:"text",isDate:true},
          // {id:"date_end",title:"site.date_end",type:"text",isDate:true},
          // {id:"date_free",title:"site.date_free",type:"text",isDate:true},
        ],
        filters:[
          {id:"id",title:"site.id",type:"number"},
          {id:"name",title:"site.name",type:"text"},
          {id:"project",title:"site.project",type:"text"},
          // {id:"date_start",title:"site.date_start",type:"text",isDate:true},
          // {id:"date_end",title:"site.date_end",type:"text",isDate:true},
        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },
    created(){
      this.fetchSitesLimit1000()
    },
    methods: {
      fetchSites() {
        return new Promise((resolve) => {
          resolve(fetchSites(this.searchParameters, this.currentUser.id))
        });
      },
      fetchSitesLimit1000() {
        let data = cloneDeep(this.searchParameters);
        data.paginateBy=1000;
        data.coords_not_null = true;
        console.log(data)
        fetchSites(data, this.currentUser.id).then(response=>{
          this.mapData = response.body.results
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
          project: null,
          // date_start: null,
          // date_end: null,
          // date_free: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      }
    },
    watch: {

      'switchChange': {
        handler: function (newval, oldval) {
          console.log(newval)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
.ralign {
	text-align: right !important;  
  }
</style>
