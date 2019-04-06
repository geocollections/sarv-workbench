<template>
  <div>
    <div class="col p-0">
       <span class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="customSwitch" v-model="showCollapseMap">
          <label class="custom-control-label" for="customSwitch">{{showCollapseMap ? 'Map enabled' : 'Map disabled'}}</label>
        </span>
    </div>

    <div class="col  p-0">
      <b-collapse v-model="showCollapseMap" id="collapseMap">
        <map-component style="width: 100%" v-bind:location="{ lat: null, lng: null }"
                       v-bind:locations="sites" v-on:choose-locations="chooseLocations" />
      </b-collapse>
    </div>

    <div class="row mt-4 page-title">

      <div class="col">
         <span class="float-left">
          <p class="h5">Pick some sites from a list or create new one</p>


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

  </div>

</template>

<script>
  import cloneDeep from 'lodash/cloneDeep'
  import formManipulation  from './../components/mixins/formManipulation'
  import Site  from './../components/site/Site'
  import ListModuleCore from "./ListModuleCore";
  import {fetchSites} from "@/assets/js/api/apiCalls";
  import MapComponent from "../components/partial/MapComponent";
  export default {
    components: {
      MapComponent,
      ListModuleCore,
      Site //TODO:REMOVE and add save method otherwise all SITE data loaded
    },
    mixins: [formManipulation,Site],
    name: "Sites",
    props: {
      apiCall: {
        type: Function
      },

      project: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        response: {},
        sites:[],
        showCollapseMap:true,
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
      this.fetchMySites();
      this.$root.$on('add-site',this.addSite);
      this.$root.$on('remove-site',this.removeSite);
    },
    methods: {
      fetchSites() {
        return new Promise((resolve) => {
          resolve(fetchSites(this.searchParameters, this.currentUser.id))
        });
      },
      fetchMySites() {
        let data = cloneDeep(this.searchParameters);
        data.coords_not_null = true;
        data.projectId = this.project;

        fetchSites(data, this.currentUser.id).then(response=>{
          this.sites = response.body.results
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
          projectId: null,
          page: 1,
          paginateBy: 10,
          orderBy: '-id',
        }
      },

      chooseLocations(locations) {
        console.log(locations)
      },
      addSite(entity) {
        this.sites.push(entity)
        entity.project = {id: this.project};
        this.changeSiteData(entity)
      },
      removeSite(entity) {
        let idx = this.findCurrentRecord(this.sites, entity.id);
        if(idx > -1) this.sites.splice(idx,1)
        entity.project.id = {id: null};
        this.changeSiteData(entity)

      },
      changeSiteData(object){
        let objectToUpload = cloneDeep(object)
        objectToUpload =  this.removeUnnecessaryFields(objectToUpload, this.copyFields);
        delete objectToUpload['id'];

        let formData = new FormData();
        formData.append('data', this.formatDataForUpload(objectToUpload));

        this.saveData(object,formData,'change/site/'+object.id, true).then(savedObjectId => {

        }, errResponse => { return false; });
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

#collapseMap {
  height: 50vh;
}
</style>
