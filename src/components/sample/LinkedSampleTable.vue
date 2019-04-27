<template>
  <div>
    <div class="p-0">
      <table class="table table-hover table-bordered" v-if="samples.length > 0">
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
          <td style="padding: 4px;cursor: pointer" @click="windowOpenNewTab('sample','/sample/'+sample.id)">
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
    </div>

    <div class="col-sm-12 col-md-6 p-0" v-if="count > searchParameters.paginateBy">
      <b-pagination
        size="md" align="left" :limit="5" :hide-ellipsis="true" :total-rows="count"
        v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
      </b-pagination>
    </div>
  </div>
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
            count: 0,
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
          //CREATE EVENT LOAD LINKED SAMLES ON PAGE CLOSE!!! CONTINUE
        this.$root.$on('reload-linked-samples',this.loadLinkedSamples)
        this.loadLinkedSamples();
      },
      methods: {
        windowOpenNewTab(name, path,query = {}, meta) {
          let routeData = this.$router.resolve({path: path, query: query, meta: meta});
          window.open(routeData.href, '_blank');
        },
        loadLinkedSamples() {
          fetchLinkedSamplesX(this.searchParameters, this.siteID).then(response=>{
            this.count = response.body.count
            this.samples = response.body.results ? response.body.results : []
            this.$parent.relatedData.sample = this.samples
          });
        },
      },
      watch: {
        'searchParameters': {
          handler: function (newval, oldval) {
            this.loadLinkedSamples()
          },
          deep: true
        }
      }
    }
</script>

<style scoped>

</style>
