<template>
  <div>
    <div class="row mt-4 page-title d-print-none">
      <div class="col-sm-6">
        <p class="h2">{{ $t('header.samples') }}</p>
      </div>
      <div class="col-sm-6 text-right">
        <router-link class="btn btn-primary mr-2 mb-2" :to="{ path: '/sample/add' }">{{ $t('add.new') }}</router-link>
      </div>
    </div>

    <!-- SEARCH FIELDS START -->
    <fieldset class="border p-2 d-print-none" id="block-search">
      <legend class="w-auto mb-0" :class="{ 'text-primary': !block.search }" @click="block.search = !block.search">
        <i class="fas fa-search"></i>
        {{ $t('edit.search') }}
      </legend>

      <transition name="fade">
        <div class="row" v-if="filters.length > 0 && block.search">
          <div class="col-md-4" v-for="field,idx in filters">

            <label :for="field.id">{{ $t(field.title) }}:</label>

            <b-form-input v-model="searchParameters[field.id]" :id="field.id" :type="field.type"></b-form-input>

          </div>
        </div>
      </transition>
    </fieldset>

    <!-- SEARCH FIELDS END -->
    <list-module-core
      module="sample"
      title="titles.editSample"
      :columns="columns"
      :searchParameters="searchParameters"
      :api-call="fetchSamples"
      :use-list-view="true"
      search-history="sampleSearchHistory"
      view-type="sampleViewType"
      v-on:search-params-changed="searchParametersChanged"
      v-on:set-default-search-params="setDefaultSearchParametersFromDeleteButton"
    ></list-module-core>
  </div>

</template>

<script>
  import ListModuleCore from "./ListModuleCore";
  import {fetchSamples} from "@/assets/js/api/apiCalls";
  import permissionsMixin from "../components/mixins/permissionsMixin";

  export default {
    components: {
      ListModuleCore
    },
    name: "Samples",
    mixins: [permissionsMixin],
    data() {
      return {
        response: {},
        columns: [
          {id: "number", title: "sample.numberSlashId", type: "text"},
          //{id:"number_additional",title:"sample.number_additional",type:"text", onlySearch:true},
          //{id:"number_field",title:"sample.number_field",type:"text", onlySearch:true},
          {id: "id", title: "sample.id", type: "number"},
          {id: "locality", title: "sample.locality", type: "text"},
          //{id:"locality_free",title:"sample.locality_free",type:"text", onlySearch:true},
          {id: "depth", title: "sample.depth", type: "text"},
          {id: "stratigraphy", title: "sample.stratigraphy", type: "text"},
          //{id:"lithostratigraphy",title:"sample.lithostratigraphy",type:"text", onlySearch:true},
          {id: "agent", title: "sample.agent_collected", type: "text"},
          //{id:"rock",title:"sample.rock",type:"text", onlySearch:true},
          //{id:"date_collected",title:"sample.date_collected",type:"text", onlySearch:true},
          {id: "storage", title: "sample.storage", type: "text"}
        ],
        filters: [
          {id: "number", title: "sample.number", type: "text"},
          {id: "id", title: "sample.id", type: "number"},
          {id: "locality", title: "sample.locality", type: "text"},
          {id: "depth", title: "sample.depth", type: "text"},
          {id: "stratigraphy", title: "sample.stratigraphy", type: "text"},
          {id: "agent", title: "sample.agent_collected", type: "text"},
          {id: "storage", title: "sample.storage", type: "text"}
        ],
        searchParameters: this.setDefaultSearchParameters(),
        block: {search: true}
      }
    },
    methods: {
      fetchSamples() {
        return new Promise((resolve) => {
          resolve(fetchSamples(this.searchParameters, this.currentUser, this.databaseId))
        });
      },
      searchParametersChanged(newParams) {
        this.searchParameters = newParams
      },
      setDefaultSearchParameters() {
        return {
          locality: null,
          number: null,
          // number_additional: null,
          // number_field: null,
          // locality_free: null,
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
      setDefaultSearchParametersFromDeleteButton() {
        this.searchParameters = this.setDefaultSearchParameters()
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
