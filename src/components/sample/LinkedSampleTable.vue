<template>
  <table class="table table-hover table-bordered">
    <thead class="thead-light">
    <tr>
      <th>ID</th>
      <th>{{ $t('sample.number') }}</th>
      <th>{{ $t('sample.depth') }}</th>
      <th>{{ $t('sample.depth_interval') }}</th>
      <th>{{ $t('sample.stratigraphy') }}</th>
      <th>{{ $t('sample.lithostratigraphy') }}</th>
      <th>{{ $t('sample.rock') }}</th>
    </tr>
    <tr>
      <th  class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.id"type="number"></b-form-input></th>
      <th  class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.number"type="text"></b-form-input></th>
      <th class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.depth"type="number"></b-form-input></th>
      <th class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.depth_interval"type="number"></b-form-input></th>
      <th class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.stratigraphy"type="text"></b-form-input></th>
      <th class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.lithostratigraphy"type="text"></b-form-input></th>
      <th class="p-0"><b-form-input autocomplete="off" style="display: inline !important;max-width: 100%; " class="col-sm-8"
                        v-model="searchParameters.rock"type="text"></b-form-input></th>

    </tr>
    </thead>
    <tbody>
    <tr v-for="(sample,idx) in samples">
      <td @click="windowOpenNewTab('sample','/sample/'+sample.id)">
        <font-awesome-icon size="1x" icon="eye"/> {{sample.id}}
      </td>
      <td>{{sample.number}}</td>
      <td>{{sample.depth}}</td>
      <td>{{sample.depth_interval}}</td>
      <td v-translate="{et:sample.stratigraphy__stratigraphy,en:sample.stratigraphy__stratigraphy_en}"></td>
      <td v-translate="{et:sample.lithostratigraphy__stratigraphy,en:sample.lithostratigraphy__stratigraphy_en}"></td>
      <td v-translate="{et:sample.rock,en:sample.rock_en}"></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import fontAwasomeLib  from './../mixins/fontAwasomeLib'
  import {
    fetchLinkedSamplesX
  } from "../../assets/js/api/apiCalls";
    export default {
        name: "LinkedSampleTable",
      mixins: [fontAwasomeLib],
      data(){
          return {
            samples: [],
            searchParameters : {
              id: null,
              number: null,
              depth: null,
              depth_interval: null,
              stratigraphy: null,
              lithostratigraphy: null,
              rock: null,
              page: 1,
              paginateBy: 10,
              orderBy: '-id',
            }
          }
      },
      props: {

        siteID: {
          type: String
        },

      },
      created(){
          this.loadLinkedSamples();
      },
      methods: {
        windowOpenNewTab(name, path,query = {}, meta) {
          let routeData = this.$router.resolve({path: path, query: query, meta: meta});
          window.open(routeData.href, '_blank');
        },
        loadLinkedSamples() {
          fetchLinkedSamplesX(this.searchParameters, this.siteID).then(response=>{
            console.log(response)
            this.samples = response.body.results ? response.body.results : []
          });
        },
      },
      watch: {
        'searchParameters': {
          handler: function (newval, oldval) {
            console.log(newval)
            this.loadLinkedSamples()
          },
          deep: true
        }
      }
    }
</script>

<style scoped>

</style>
