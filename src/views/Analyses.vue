<template>
  <div>
    <div class="row mt-4 page-title">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.analyses') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/analysis/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>
    <!-- SEARCH FIELDS START -->
    <!--<div class="row mt-4" v-if="filters.length > 0">-->
      <!--<div class="col">-->
        <!--<div class="search-fields">-->
          <!--<div class="d-flex flex-row flex-wrap">-->
            <!--<div class="col-sm-6" v-for="field,idx in filters">-->
              <!--<label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }}:</label>-->
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
      module="analysis"
      title="titles.editDoi"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchAnalyses_"
      search-history="analysisSearchHistory"
      view-type="analysisViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>

  </div>
</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import { fetchAnalyses } from "../assets/js/api/apiCalls";

  export default {
    components: {
      ListModuleCore
    },
    name: "Analyses",

    data() {
      return {
        response: {},
        columns:[
          {id:"id",title:"analysis.id",type:"number"},
          {id:"sample__id",title:"analysis.sample__id",type:"text"},
          {id:"sample__number",title:"analysis.sample__number",type:"text"},
          {id:"sample__locality__locality",title:"analysis.sample__locality__locality",type:"text"},
          {id:"sample__depth",title:"analysis.sample__depth",type:"text"},
          {id:"analysis_method__analysis_method",title:"analysis.analysis_method__analysis_method",type:"text"},
          {id:"date",title:"analysis.date_",type:"date"},
          {id:"lab_txt",title:"analysis.labor_txt",type:"text"},
          {id:"agent",title:"analysis.agent",type:"text"}
        ],
        filters:[
          {id:"owner",title:"doi.owner",type:"text"},
        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },

    created: function () {
      // Gets user data from session storage
      if (this.$session.exists() && this.$session.get('authUser') !== null) {
        const user = this.$session.get('authUser')
        this.agent = {
          id: user.agent_id,
          agent: null,
          forename: user.user,
          surename: null,
          user: user.user,
        }
        //console.log(this.agent);
      }
    },

    methods: {
      fetchAnalyses_() {
        return new Promise((resolve) => {
          resolve(fetchAnalyses(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          id:null,
          owner: null,
          page: 1,
          paginateBy: 50,
          orderBy: '-id',
        }
      },
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
      }
    }
  }
</script>

<style scoped>

</style>
