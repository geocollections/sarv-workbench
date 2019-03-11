<template>
  <div>
    <!-- SEARCH FIELDS START -->
    <div class="row mt-4">
      <div class="col">
        <div class="search-fields">
          <div class="d-flex flex-row flex-wrap">
            <div class="col-sm-6" v-for="field,idx in fields">
                <label class="col-sm-4 p-0" :for="field.id">{{ $t(field.title) }}:</label>
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
      module="sample"
      title="titles.editSample"
      :fields="fields"
      :searchParameters="searchParameters"
      :api-call="fetchSamples"
      search-history="sampleSearchHistory"
      view-type="sampleViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParameters"
    ></list-module-core>

  </div>

</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchSamples} from "@/assets/js/api/apiCalls";
  export default {
    components: {
      ListModuleCore
    },
    name: "Samples",
    data() {
      return {
        response: {},
        fields:[
          {id:"id",title:"sample.id",type:"number"},
          {id:"number",title:"sample.number",type:"text"},
          {id:"number_additional",title:"sample.number_additional",type:"text", onlySearch:true},
          {id:"number_field",title:"sample.number_field",type:"text", onlySearch:true},
          {id:"locality",title:"sample.locality",type:"text"},
          {id:"locality_free",title:"sample.locality_free",type:"text", onlySearch:true},
          {id:"depth",title:"sample.depth",type:"text"},
          {id:"stratigraphy",title:"sample.stratigraphy",type:"text"},
          {id:"lithostratigraphy",title:"sample.lithostratigraphy",type:"text", onlySearch:true},
          {id:"agent",title:"sample.agent_collected",type:"text"},
          {id:"date_collected",title:"sample.date_collected",type:"text", onlySearch:true},
          {id:"storage",title:"sample.storage",type:"text"}


        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },
    methods: {
      fetchSamples() {
        return new Promise((resolve) => {
          resolve(fetchSamples(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          locality: null,
          number: null,
          number_additional: null,
          number_field: null,
          locality_free: null,
          stratigraphy: null,
          storage: null,
          depth: null,
          agent: null,
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

</style>
