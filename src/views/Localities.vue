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
      module="locality"
      title="titles.editLocality"
      :fields="fields"
      :searchParameters="searchParameters"
      :api-call="fetchLocalities"
      search-history="localitySearchHistory"
      view-type="localityViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParameters"
    ></list-module-core>

  </div>

</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchLocalities} from "@/assets/js/api/apiCalls";
  export default {
    components: {
      ListModuleCore
    },
    name: "Localities",
    data() {
      return {
        response: {},
        fields:[
          {id:"id",title:"editLocality.id",type:"number"},
          {id:"locality",title:"editLocality.locality",type:"text"},
          {id:"number",title:"editLocality.number",type:"text"},
          {id:"country",title:"editLocality.country",type:"text"},
          {id:"agent",title:"editLocality.agent",type:"text"}


        ],
        searchParameters: this.setDefaultSearchParameters()
      }
    },
    methods: {
      fetchLocalities() {
        return new Promise((resolve) => {
          resolve(fetchLocalities(this.searchParameters))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          locality: null,
          number: null,
          county: null,
          country: null,
          creator: null,
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
