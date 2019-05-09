<template>
  <div>
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

  import formManipulation  from './../components/mixins/formManipulation'
  import ListModuleCore from "./ListModuleCore";
  import {fetchLinkedSites, fetchSites} from "@/assets/js/api/apiCalls";
  export default {
    components: {
      ListModuleCore
    },
    mixins: [formManipulation],
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
          // {id:"project",title:"site.project",type:"text"},
          {id:"date_start",title:"site.date_start",type:"text",isDate:true},
          {id:"date_end",title:"site.date_end",type:"text",isDate:true},
        ],
        searchParameters: this.setDefaultSearchParameters()
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

</style>
